import { uid } from "uid";
import baseApi from "./base-api-slice";

const budgetsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		addBudget: build.mutation({
			queryFn: (payload) => {
				let budgets = localStorage.getItem("budgets");

				const data = { id: payload.id || uid(16), ...payload };

				if (budgets !== null) {
					budgets = JSON.parse(budgets);
					budgets = [data, ...budgets];
				} else {
					budgets = [data];
				}

				localStorage.setItem("budgets", JSON.stringify(budgets));
				return { data };
			},
			invalidatesTags: ["Budget"],
		}),

		deleteBudget: build.mutation({
			queryFn: (payload) => {
				let budgets = localStorage.getItem("budgets");

				if (budgets === null) {
					return { error: "Budget with specified ID does not exist!" };
				}

				budgets = JSON.parse(budgets);
				budgets = budgets.filter((data) => data.id !== payload);
				localStorage.setItem("budgets", JSON.stringify(budgets));

				return { data: "success" };
			},
			invalidatesTags: ["Budget"],
		}),

		editBudget: build.mutation({
			queryFn: (payload) => {
				let budgets = localStorage.getItem("budgets");

				if (budgets === null) {
					return { error: "Budget with specified ID does not exist!" };
				}

				budgets = JSON.parse(budgets);

				const budget = budgets.find((data) => data.id === payload.id);
				if (budget) {
					Object.assign(budget, payload);
				}
				localStorage.setItem("budgets", JSON.stringify(budgets));
				return { data: payload };
			},
			invalidatesTags: ["Budget"],
		}),

		getBudget: build.query({
			queryFn: (payload) => {
				let budgets = localStorage.getItem("budgets");
				if (budgets === null) {
					return { error: "Budget with specified ID does not exist!" };
				}

				budgets = JSON.parse(budgets)
				const budget = budgets.find((data) => data.id === payload);
				if (budget) {
					return { data: budget };
				}

				return { error: "Budget with specified ID does not exist!" };
			},
			providesTags: ["Budget"],
		}),

		getBudgets: build.query({
			queryFn: () => {
				const budgets = localStorage.getItem("budgets");

				if (budgets !== null) {
					return { data: JSON.parse(budgets) };
				}

				return { data: [] };
			},
			providesTags: ["Budget"],
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
