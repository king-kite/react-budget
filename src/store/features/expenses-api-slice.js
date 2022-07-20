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
import {
	toCapitalize,
	UNCATEGORIZED_ID,
	UNCATEGORIZED_NAME,
} from "../../utils";

// Check Expense Date is not before or after the budgetDate
function checkDate(start_date, end_date, date) {
	if (
		new Date(start_date) <= new Date(date) &&
		new Date(date) <= new Date(end_date)
	)
		return true;
	else return false;
}

const expensesApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addExpense: build.mutation({
			queryFn: async ({ start_date, end_date, ...payload }) => {
				try {
					if (
						payload.budgetId !== UNCATEGORIZED_ID &&
						start_date &&
						end_date &&
						checkDate(start_date, end_date, payload.date) === false
					) {
						return {
							error: {
								data: {
									date:
										"Invalid date. Date must be on or after the Budget start date and before or on the Budget end date.",
								},
							},
						};
					}

					const user = await auth.currentUser;
					if (user) {
						const expense = {
							title: payload.title,
							amount: payload.amount,
							date: Timestamp.fromDate(new Date(payload.date)),
							budgetId: payload.budgetId,
							budgetName: payload.budgetName,
							description: payload.description,
							create_date: Timestamp.fromDate(new Date()),
							update_date: Timestamp.fromDate(new Date()),
							user: user.uid,
						};

						await addDoc(collection(db, "expenses"), expense);

						generateLog({
							type: "create",
							message: `${toCapitalize(
								expense.title
							)} expense was added to the ${toCapitalize(payload.budgetName)} budget.`,
						});

						return { data: expense };
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
			invalidatesTags: (result) => (result ? ["Budget", "Expense", "Log"] : []),
		}),

		deleteExpense: build.mutation({
			queryFn: async (payload) => {
				try {
					let expense = await getDoc(doc(db, "expenses", payload));
					if (expense) {
						expense = expense.data();

						await deleteDoc(doc(db, "expenses", payload));

						generateLog({
							type: "delete",
							message: `${toCapitalize(expense.budgetName)} budget expense \'${
								toCapitalize(expense.title)
							}\' was deleted.`,
						});

						return {
							data: { detail: "Expense was deleted successfully!" },
						};
					}
					return {
						error: {
							detail: `Expense with specified ID ${payload} does not exist!`,
						},
					};
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result) => (result ? ["Budget", "Expense", "Log"] : []),
		}),

		deleteExpenses: build.mutation({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const expensesRef = collection(db, "expenses");
						const expenses = await getDocs(
							query(
								expensesRef,
								where("budgetId", "==", payload),
								where("user", "==", user.uid)
							)
						);

						let budgetName = undefined;

						expenses.docs.forEach(async (expense) => {
							try {
								const data = expense.data();
								if (budgetName === undefined) budgetName = expense.budgetName;
								await deleteDoc(doc(db, "expenses", expense.id));
							} catch (error) {
								throw error;
							}
						});

						if (budgetName)
							generateLog({
								type: "delete",
								message: `${toCapitalize(
									budgetName
								)} budget expenses were deleted.`,
							});

						return {
							data: {
								detail: `${toCapitalize(
									budgetName
								)} budget expenses were deleted successfully!`,
							},
						};
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
			invalidatesTags: (result) => (result ? ["Budget", "Expense", "Log"] : []),
		}),

		editExpense: build.mutation({
			queryFn: async ({ id, start_date, end_date, ...payload }) => {
				try {
					if (
						payload.budgetId !== UNCATEGORIZED_ID &&
						start_date &&
						end_date &&
						checkDate(start_date, end_date, payload.date) === false
					) {
						return {
							error: {
								data: {
									date:
										"Invalid date. Date must be on or after the Budget start date and before or on the Budget end date.",
								},
							},
						};
					}

					await updateDoc(doc(db, "expenses", id), {
						...payload,
						date: Timestamp.fromDate(new Date(payload.date)),
						update_date: Timestamp.fromDate(new Date()),
					});
					generateLog({
						type: "update",
						message: `${toCapitalize(
							payload.budgetName
						)} expense \'${toCapitalize(payload.title)}\' was updated.`,
					});
					return { data: { id, ...payload } };
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result) => (result ? ["Budget", "Expense", "Log"] : []),
		}),

		getExpenses: build.query({
			queryFn: async () => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const expensesRef = collection(db, "expenses");
						const expenses = await getDocs(
							query(
								expensesRef,
								where("user", "==", user.uid),
								orderBy("update_date", "desc")
							)
						);

						const data = expenses.docs.map((doc) => {
							const info = doc.data();

							return {
								id: doc.id,
								title: info.title,
								amount: info.amount,
								description: info.description,
								date: info.date.toDate().toDateString(),
								budgetId: info.budgetId,
								budgetName: info.budgetName,
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
			providesTags: (result) => (result ? ["Expense"] : []),
		}),

		getBudgetExpenses: build.query({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const expensesRef = collection(db, "expenses");
						const expenses = await getDocs(
							query(
								expensesRef,
								where("budgetId", "==", payload),
								where("user", "==", user.uid),
								orderBy("update_date", "desc")
							)
						);

						const data = expenses.docs.map((doc) => {
							const info = doc.data();

							return {
								id: doc.id,
								title: info.title,
								amount: info.amount,
								description: info.description,
								date: info.date.toDate().toDateString(),
								budgetId: info.budgetId,
								budgetName: info.budgetName,
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
			providesTags: (result) => (result ? ["Budget", "Expense"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useAddExpenseMutation,

	useDeleteExpenseMutation,
	useDeleteExpensesMutation,

	useEditExpenseMutation,

	useGetBudgetExpensesQuery,
	useGetExpensesQuery,
} = expensesApi;

export default expensesApi;
