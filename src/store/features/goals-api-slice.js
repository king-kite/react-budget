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
import { auth, db } from "../firebase";
import { DATA_LIFETIME } from "../../config";
import { addNotification } from "../firebase/notifications";
import { generateLog } from "../firebase/utils";
import { toCapitalize, getDate } from "../../utils";

const goalsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addGoal: build.mutation({
			queryFn: async (payload) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const goal = {
							name: payload.name,
							description: payload.description,
							amount: payload.amount,
							start_date: Timestamp.fromDate(new Date(payload.start_date)),
							end_date: Timestamp.fromDate(new Date(payload.end_date)),
							create_date: Timestamp.fromDate(new Date()),
							update_date: Timestamp.fromDate(new Date()),
							user: user.uid,
						};

						await addDoc(collection(db, "goals"), goal);

						generateLog({
							type: "create",
							message: `Financial goal ${toCapitalize(payload.name)} was created.`,
						});

						return { data: goal };
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
			invalidatesTags: (result) => (result ? ["Goal", "Log"] : []),
		}),

		deleteGoal: build.mutation({
			queryFn: async (payload) => {
				try {
					let goal = await getDoc(doc(db, "goals", payload))

					if (goal) {
						goal = goal.data();

						await deleteDoc(doc(db, "goals", payload));

						generateLog({
							type: "delete",
							message: `Financial Goal ${toCapitalize(goal.name)} was deleted`,
						});

						return {
							data: { detail: "Financial Goal was deleted successfully!" },
						};	
					}
					return {
						error: {
							detail: `Financial goal with specified ID ${payload} does not exist!`
						}
					}
				} catch (error) {
					return { error: { detail: error?.code || error?.message } };
				}
			},
			invalidatesTags: (result, error) => (!error ? ["Goal", "Log"] : []),
		}),

		editGoal: build.mutation({
			queryFn: async ({ id, ...payload }) => {
				try {
					const user = await auth.currentUser;
					if (user) {
						let goal = await getDoc(doc(db, "goals", id));
						if (goal) {
							const goal_id = goal.id;
							goal = goal.data();
							const old_end_date = getDate(goal.end_date.toDate());
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
										where("data_type", "==", "goal"),
										where("data_id", "==", goal_id),
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

							await updateDoc(doc(db, "goals", id), {
								...payload,
								start_date: Timestamp.fromDate(new Date(payload.start_date)),
								end_date: Timestamp.fromDate(new Date(payload.end_date)),
								update_date: Timestamp.fromDate(new Date()),
							});
							generateLog({
								type: "update",
								message: `Financial Goal ${toCapitalize(payload.name)} was updated successfully!`,
							});
							return { data: { id, ...payload } };
						}
						return {
							error: {
								detail: `Financial Goal with specified ID \'${id}\' does not exist!`,
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
			invalidatesTags: (result) => (result ? ["Goal", "Log"] : []),
		}),

		getGoals: build.query({
			queryFn: async () => {
				try {
					const user = await auth.currentUser;
					if (user) {
						const goalsRef = collection(db, "goals");
						const goals = await getDocs(
							query(
								goalsRef,
								where("user", "==", user.uid),
								orderBy("update_date", "desc")
							)
						);

						const data = goals.docs.map((doc) => {
							const info = doc.data();

							return {
								id: doc.id,
								name: info.name,
								description: info.description,
								amount: info.amount,
								start_date: info.start_date.toDate().toDateString(),
								end_date: info.end_date.toDate().toDateString(),
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
						data.forEach(async (goal) => {
							try {
								const promise = addNotification({
									date: goal.end_date,
									data: goal,
									data_type: "goal",
									type: "Goal",
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
			providesTags: (result) => (result ? ["Goal"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useAddGoalMutation,

	useDeleteGoalMutation,

	useEditGoalMutation,

	useGetGoalsQuery,
} = goalsApi;

export default goalsApi;
