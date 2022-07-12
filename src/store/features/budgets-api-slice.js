import { uid } from "uid";
import baseApi from "./base-api-slice";
import { generateLog } from "../firebase/utils";
import { toCapitalize } from "../../utils"

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
				generateLog({
					type: "create",
					message: `${toCapitalize(payload.name)} budget was created`
				})
				return { data };
			},
			invalidatesTags: ["Budget", "Log"],
		}),

		deleteBudget: build.mutation({
			queryFn: (payload) => {
				let budgets = localStorage.getItem("budgets");

				if (budgets === null) {
					return { error: "Budget with specified ID does not exist!" };
				}

				budgets = JSON.parse(budgets);
				let budget = budgets.find(data => data.id === payload)
				budgets = budgets.filter((data) => data.id !== payload);
				localStorage.setItem("budgets", JSON.stringify(budgets));

				if (budget) {
					generateLog({
						type: "delete",
						message: `${toCapitalize(budget.name)} budget was deleted`
					})	
				}

				return { data: "success" };
			},
			invalidatesTags: ["Budget", "Log"],
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
				generateLog({
					type: "update",
					message: `${toCapitalize(budget.name)} budget was updated`
				})	
				return { data: payload };
			},
			invalidatesTags: ["Budget", "Log"],
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
