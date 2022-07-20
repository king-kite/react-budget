import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	orderBy,
	where,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { DATA_LIFETIME } from "../../config";
import baseApi from "./base-api-slice";

const logsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		deleteLog: build.mutation({
			queryFn: async (payload) => {
				try {
					await deleteDoc(doc(db, "logs", payload));

					return {
						data: { detail: "Log was deleted successfully!" },
					};
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result, error) => (!error ? ["Log"] : []),
		}),

		deleteAllLogs: build.mutation({
			queryFn: async () => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const logsRef = collection(db, "logs");
						const _logs = await getDocs(
							query(logsRef, where("user", "==", user.uid))
						);
						const promises = _logs.docs.map(async (_log) => {
							return await deleteDoc(doc(db, "logs", _log.id));
						});
						await Promise.allSettled(promises);
						return {
							data: { detail: "All logs were deleted successfully!" },
						};
					} else {
						return {
							error: {
								detail: "Authentication credentials were not provided!",
							},
						};
					}
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result, error) => (!error ? ["Log"] : []),
		}),

		getLogs: build.query({
			queryFn: async () => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const logsRef = collection(db, "logs");
						const _logs = await getDocs(
							query(
								logsRef,
								where("user", "==", user.uid),
								orderBy("date", "desc")
							)
						);

						const data = _logs.docs.map((doc) => {
							const info = doc.data();

							return {
								id: doc.id,
								message: info.message,
								type: info.type,
								date: info.date.toDate(),
							};
						});

						return { data };
					} else {
						return {
							error: {
								detail: "Authentication credentials were not provided!",
							},
						};
					}
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result) => (result ? ["Log"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useDeleteLogMutation,
	useDeleteAllLogsMutation,

	useGetLogsQuery,
} = logsApi;

export default logsApi;
