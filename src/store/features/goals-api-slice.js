import { uid } from "uid";
import baseApi from "./base-api-slice";

const goalsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addGoal: build.mutation({
			queryFn: (payload) => {
				let goals = localStorage.getItem("goals");

				const data = { id: payload.id || uid(16), ...payload };

				if (goals !== null) {
					goals = JSON.parse(goals);
					goals = [data, ...goals];
				} else {
					goals = [data];
				}

				localStorage.setItem("goals", JSON.stringify(goals));
				return { data };
			},
			invalidatesTags: ["Goal"],
		}),

		deleteGoal: build.mutation({
			queryFn: (payload) => {
				let goals = localStorage.getItem("goals");

				if (goals === null) {
					return { error: "Goal with specified ID does not exist!" };
				}

				goals = JSON.parse(goals);
				goals = goals.filter((data) => data.id !== payload);
				localStorage.setItem("goals", JSON.stringify(goals));

				return { data: "success" };
			},
			invalidatesTags: ["Goal"],
		}),

		editGoal: build.mutation({
			queryFn: (payload) => {
				let goals = localStorage.getItem("goals");

				if (goals === null) {
					return { error: "Goal with specified ID does not exist!" };
				}

				goals = JSON.parse(goals);

				let singleGoal = goals.find((data) => data.id === payload.id);
				if (singleGoal) {
					Object.assign(singleGoal, payload);
				}
				localStorage.setItem("goals", JSON.stringify(goals));
				return { data: payload };
			},
			invalidatesTags: ["Goal"],
		}),

		getGoals: build.query({
			queryFn: () => {
				const goals = localStorage.getItem("goals");

				if (goals !== null) {
					return { data: JSON.parse(goals) };
				}

				return { data: [] };
			},
			providesTags: ["Goal"],
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
