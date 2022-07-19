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
import { open } from "./alert-slice";
import { DATA_LIFETIME } from "../../config";
import { auth, db } from "../firebase";
import { addNotification } from "../firebase/notifications";
import { generateLog } from "../firebase/utils";
import {
	toCapitalize,
	getDate,
	UNCATEGORIZED_ID,
	UNCATEGORIZED_NAME,
} from "../../utils";

const budgetsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addBudget: build.mutation({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const budget = {
							name: payload.name.trim(),
							amount: payload.amount,
							start_date: Timestamp.fromDate(new Date(payload.start_date)),
							end_date: Timestamp.fromDate(new Date(payload.end_date)),
							create_date: Timestamp.fromDate(new Date()),
							update_date: Timestamp.fromDate(new Date()),
							user: user.uid,
						};

						await addDoc(collection(db, "budgets"), budget);

						generateLog({
							type: "create",
							message: `${toCapitalize(budget.name)} budget was created`,
						});

						return { data: budget };
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
			invalidatesTags: (result) => (result ? ["Budget", "Log"] : []),
		}),

		deleteBudget: build.mutation({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					let budget = await getDoc(doc(db, "budgets", payload))
					if (user && budget) {
						budget = budget.data()
						await deleteDoc(doc(db, "budgets", payload));

						generateLog({
							type: "delete",
							message: `The ${toCapitalize(budget.name)} budget was deleted.`,
						});

						return {
							data: { detail: `The ${toCapitalize(budget.name)} budget was deleted successfully!.` },
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
			async onQueryStarted(payload, { queryFulfilled }) {
				try {
					const user = await auth.currentUser;
					const { data } = await queryFulfilled;

					if (data && user) {
						const expenses = await getDocs(
							query(
								collection(db, "expenses"),
								where("budgetId", "==", payload),
								where("user", "==", user.uid)
							)
						);

						await Promise.allSettled(
							expenses.docs.map(async (expense) => {
								const data = expense.data();
								return await updateDoc(doc(db, "expenses", expense.id), {
									...data,
									budgetId: UNCATEGORIZED_ID,
									budgetName: UNCATEGORIZED_NAME,
								});
							})
						);

						await addDoc(collection(db, "notifications"), {
							user: user.uid,
							title: "Expenses set to uncategorized",
							message:
								"Expenses have been set to uncategorized following the deletion of the budget! Refresh the budgets page to get latest information concerning your budgets.",
							date: Timestamp.fromDate(new Date()),
							type: "success",
							read: false,
						});
					}
				} catch (error) {
					await addDoc(collection(db, "notifications"), {
						user: user.uid,
						title: "Unable to set expenses to uncategorized",
						message:
							error?.code ||
							error?.message ||
							"A server error occurred! Unable to set expenses to uncategorized",
						date: Timestamp.fromDate(new Date()),
						type: "danger",
						read: false,
					});
				}
			},
			invalidatesTags: (result) => (result ? ["Budget", "Log"] : []),
		}),

		editBudget: build.mutation({
			queryFn: async ({ id, ...payload }) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						let budget = await getDoc(doc(db, "budgets", id));
						if (budget) {
							const budget_id = budget.id;
							budget = budget.data();
							const old_end_date = getDate(budget.end_date.toDate());
							const new_end_date = getDate(payload.end_date);
							const current_date = getDate();

							if (
								old_end_date.getTime() !== new_end_date.getTime() &&
								current_date.getTime() < new_end_date.getTime()
							) {
								// DELETE ALL NOTIFICATIONS CONCERNING THIS ID"
								const notifications = await getDocs(
									query(
										collection(db, "notifications"),
										where("data_id", "==", budget_id),
										where("data_type", "==", "budget"),
										where("user", "==", user.uid)
									)
								);
								const promises = notifications.docs.map(
									async (notification) => {
										return await deleteDoc(
											doc(db, "notifications", notification.id)
										);
									}
								);
								await Promise.allSettled(promises);
							}

							await updateDoc(doc(db, "budgets", id), {
								...payload,
								name: payload.name.trim(),
								start_date: Timestamp.fromDate(new Date(payload.start_date)),
								end_date: Timestamp.fromDate(new Date(payload.end_date)),
								update_date: Timestamp.fromDate(new Date()),
							});
							generateLog({
								type: "update",
								message: `The ${toCapitalize(
									payload.name.trim()
								)} budget was updated`,
							});
							return { data: { id, ...payload } };
						}
						return {
							error: {
								detail: `Budget with specified ID ${id} does not exist!`,
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
			invalidatesTags: (result) => (result ? ["Budget", "Log"] : []),
		}),

		getBudget: build.query({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						let info;
						if (payload !== UNCATEGORIZED_ID) {
							const budgetRef = doc(db, "budgets", payload);
							const doc_ = await getDoc(budgetRef);

							info = doc_.data();
						} else {
							info = {
								id: UNCATEGORIZED_ID,
								name: UNCATEGORIZED_NAME,
							};
						}

						if (info) {
							const expensesRef = collection(db, "expenses");
							const expenses_docs = await getDocs(
								query(
									expensesRef,
									where("budgetId", "==", payload),
									where("user", "==", user.uid),
									orderBy("update_date", "desc")
								)
							);

							const expenses = expenses_docs.docs.map((doc) => {
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

							let budget;
							if (payload !== UNCATEGORIZED_ID) {
								budget = {
									id: payload,
									name: info.name,
									amount: +info.amount,
									start_date: info.start_date.toDate().toDateString(),
									end_date: info.end_date.toDate().toDateString(),
									expenses,
								};
							} else {
								budget = {
									id: UNCATEGORIZED_ID,
									name: UNCATEGORIZED_NAME,
									expenses,
								};
							}

							return { data: budget };
						}

						return {
							error: {
								detail: `Budget with ID \"${payload}\" was not found`,
								code: 404,
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
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result) => (result ? ["Budget"] : []),
		}),

		getBudgets: build.query({
			queryFn: async () => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const budgetsRef = collection(db, "budgets");
						const budgets = await getDocs(
							query(
								budgetsRef,
								where("user", "==", user.uid),
								orderBy("update_date", "desc")
							)
						);

						const expensesRef = collection(db, "expenses");
						const expenses_docs = await getDocs(
							query(
								expensesRef,
								where("user", "==", user.uid),
								orderBy("update_date", "desc")
							)
						);

						const data = budgets.docs.map((doc) => {
							const info = doc.data();

							const expenses = [];

							expenses_docs.docs.forEach((info_) => {
								const expense = info_.data();

								if (expense.budgetId === doc.id) {
									expenses.push({
										id: info_.id,
										title: expense.title,
										amount: +expense.amount,
										description: expense.description,
										date: expense.date.toDate().toDateString(),
										budgetId: expense.budgetId,
										budgetName: expense.budgetName,
									});
								}
							});

							return {
								id: doc.id,
								name: info.name,
								amount: info.amount,
								start_date: info.start_date.toDate().toDateString(),
								end_date: info.end_date.toDate().toDateString(),
								expenses,
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
			async onQueryStarted(payload, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					if (data) {
						const promises = [];
						data.forEach(async (budget) => {
							try {
								const promise = addNotification({
									date: budget.end_date,
									data: budget,
									data_type: "budget",
									type: "Budget",
								});
								if (promise) promises.push(promise);
							} catch (error) {
								throw error;
							}
						});
						await Promise.allSettled(promises);
					}
				} catch (error) {
					dispatch(
						open({
							type: "danger",
							message: error?.code || error?.message,
						})
					);
				}
			},
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result) => (result ? ["Budget"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useAddBudgetMutation,

	useDeleteBudgetMutation,

	useEditBudgetMutation,

	useGetBudgetQuery,
	useGetBudgetsQuery,
} = budgetsApi;

export default budgetsApi;
