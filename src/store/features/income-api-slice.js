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
import { generateLog } from "../firebase/utils";
import { toCapitalize } from "../../utils";

const incomeApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addIncome: build.mutation({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const income = {
							title: payload.title,
							description: payload.description,
							amount: payload.amount,
							date: Timestamp.fromDate(new Date(payload.date)),
							create_date: Timestamp.fromDate(new Date()),
							update_date: Timestamp.fromDate(new Date()),
							user: user.uid,
						};

						await addDoc(collection(db, "income"), income);

						generateLog({
							type: "create",
							message: `Income transaction ${toCapitalize(
								payload.title
							)} was created`,
						});

						return { data: income };
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
			invalidatesTags: (result) => (result ? ["Income", "Log"] : []),
		}),

		deleteIncome: build.mutation({
			queryFn: async (payload) => {
				try {
					let income = await getDoc(doc(db, "income", payload));
					if (income) {
						income = income.data();

						await deleteDoc(doc(db, "income", payload));

						generateLog({
							type: "delete",
							message: `Income transaction ${income.title} was deleted successfully`,
						});
						return {
							data: { detail: "Income Transaction was deleted successfully!" },
						};
					}
					return {
						error: {
							detail: `Income transaction with specified ID ${payload} does not exist!`,
						},
					};
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result, error) => (!error ? ["Income", "Log"] : []),
		}),

		editIncome: build.mutation({
			queryFn: async ({ id, ...payload }) => {
				try {
					await updateDoc(doc(db, "income", id), {
						...payload,
						date: Timestamp.fromDate(new Date(payload.date)),
						update_date: Timestamp.fromDate(new Date()),
					});
					generateLog({
						type: "update",
						message: `Income transaction ${payload.title} was updated successfully!`,
					});
					return { data: { id, ...payload } };
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result) => (result ? ["Income", "Log"] : []),
		}),

		getIncome: build.query({
			queryFn: async () => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const incomeRef = collection(db, "income");
						const income = await getDocs(
							query(
								incomeRef,
								where("user", "==", user.uid),
								orderBy("date", "desc")
							)
						);

						const data = income.docs.map((doc) => {
							const info = doc.data();

							return {
								id: doc.id,
								title: info.title,
								description: info.description,
								amount: info.amount,
								date: info.date.toDate().toDateString(),
							};
						});

						return { data };
					}
					return {
						error: {
							detail: "Authentication credentials not found!",
						},
					};
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result) => (result ? ["Income"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useAddIncomeMutation,

	useDeleteIncomeMutation,

	useEditIncomeMutation,

	useGetIncomeQuery,
} = incomeApi;

export default incomeApi;
