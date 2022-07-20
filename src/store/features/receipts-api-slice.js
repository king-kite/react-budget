import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	orderBy,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore";

import baseApi from "./base-api-slice";
import { DATA_LIFETIME } from "../../config";
import { auth, db } from "../firebase";
import { generateLog, deleteFile } from "../firebase/utils";
import { toCapitalize } from "../../utils";

const receiptsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addReceipt: build.mutation({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const receipt = {
							title: payload.title.trim(),
							description: payload.description,
							amount: payload.amount,
							file: payload.file,
							path: payload.path,
							date: Timestamp.fromDate(new Date(payload.date)),
							create_date: Timestamp.fromDate(new Date()),
							update_date: Timestamp.fromDate(new Date()),
							user: user.uid,
						};

						await addDoc(collection(db, "receipts"), receipt);

						generateLog({
							type: "create",
							message: `Receipt ${toCapitalize(payload.title)} was created.`,
						});

						return { data: receipt };
					}
					return {
						error: {
							detail: "Authentication credentials were not provided!",
						},
					};
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result) => result ? ["Receipt", "Log"] : [],
		}),

		deleteReceipt: build.mutation({
			queryFn: async (payload) => {
				try {

					const receipt = await getDoc(doc(db, "receipts", payload))

					const receiptInfo = receipt.data()

					if (receiptInfo?.path) {
						await deleteFile({
							path: receiptInfo.path,
						})	
					}

					await deleteDoc(doc(db, "receipts", payload));

					generateLog({
						type: "delete",
						message: `The \'${toCapitalize(receiptInfo.title)}\' receipt was deleted.`,
					});

					return {
						data: { detail: `Receipt ${toCapitalize(receiptInfo.title)} was deleted successfuly.` },
					};
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result, error) => !error ? ["Receipt", "Log"] : [],
		}),

		editReceipt: build.mutation({
			queryFn: async ({ id, ...payload }) => {
				try {
					await updateDoc(doc(db, "receipts", id), {
						...payload,
						title: payload.title.trim(),
						date: Timestamp.fromDate(new Date(payload.date)),
						update_date: Timestamp.fromDate(new Date()),
					});
					generateLog({
						type: "update",
						message: `Receipt ${toCapitalize(payload.title)} was updated.`,
					});
					return { data: { id, ...payload } };
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result) => result ? ["Receipt"] : [],
		}),

		getReceipts: build.query({
			queryFn: async () => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const receiptsRef = collection(db, "receipts");
						const receipts = await getDocs(
							query(
								receiptsRef,
								where("user", "==", user.uid),
								orderBy("update_date", "desc")
							)
						);

						const data = receipts.docs.map((doc) => {
							const info = doc.data();

							return {
								id: doc.id,
								title: info.title,
								description: info.description,
								amount: info.amount,
								file: info.file,
								path: info.path,
								date: info.date.toDate().toDateString(),
							};
						});

						return { data };
					}
					return {
						error: {
							detail: "Authentication credentials were not provided!",
						},
					};
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result) => result ? ["Receipt"] : [],
		}),
	}),
	overrideExisting: false,
});

export const {
	useAddReceiptMutation,

	useDeleteReceiptMutation,

	useEditReceiptMutation,

	useGetReceiptsQuery,
} = receiptsApi;

export default receiptsApi;
