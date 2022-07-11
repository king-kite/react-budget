import { uid } from "uid"
import baseApi from "./base-api-slice"
import { UNCATEGORIZED_ID } from "../../utils"

const expensesApi = baseApi.injectEndpoints({
	endpoints: (build) => ({

		addExpense: build.mutation({
			queryFn: (payload) => {
				let expenses = localStorage.getItem("expenses")

				const data = { id: payload.id || uid(16), ...payload }

				if (expenses !== null) {
					expenses = JSON.parse(expenses)
					expenses = [data, ...expenses]
				} else {
					expenses = [payload]
				}
				
				localStorage.setItem("expenses", JSON.stringify(expenses))
				return { data }
			},
			invalidatesTags: ['Expense']
		}),

		deleteExpense: build.mutation({
			queryFn: (payload) => {

				let expenses = localStorage.getItem("expenses");

				if (expenses === null) {
					return { error: "Expense with specified ID does not exist!" };
				}

				expenses = JSON.parse(expenses)
				expenses = expenses.filter(data => data.id !== payload)
				localStorage.setItem("expenses", JSON.stringify(expenses))
				
				return { data: "success" }
			},
			invalidatesTags: ['Expense']
		}),

		editExpense: build.mutation({
			queryFn: (payload) => {
				let expenses =localStorage.getItem("expenses")

				if (expenses === null) {
					return { error: "Expense with specified ID does not exist!" }
				}

				expenses = JSON.parse(expenses);

				const expense = expenses.find(data => data.id === payload.id)
				if (expense) {
					Object.assign(expense, payload)
				}
				localStorage.setItem("expenses", JSON.stringify(expenses))
				return { data: payload }
			},
			invalidatesTags: ['Expense']
		}),

		getExpenses: build.query({
			queryFn: () => {
				const expenses = localStorage.getItem("expenses");

				if (expenses !== null) {
					return { data: JSON.parse(expenses) };
				}

				return { data: [] }
			},
			providesTags: ['Expense']
		}),

		getBudgetExpenses: build.query({
			queryFn: (payload) => {
				let budgets = localStorage.getItem("budgets")
				if (budgets === null) {
					return { error: "Budget with specified ID does not exist" }
				}
				budgets = JSON.parse(budgets)
				const budget = budgets.find(budget => budget.id === payload)
				if (budget) {
					const expenses = localStorage.getItem("expenses");

					if (expenses !== null) {
						return { data: JSON.parse(expenses).filter(expense => expense.budgetId === payload) };
					}	

					return { data: [] }
				} else if (payload === UNCATEGORIZED_ID) {
					const expenses = localStorage.getItem("expenses");

					if (expenses !== null) {
						return { data: JSON.parse(expenses).filter(expense => expense.budgetId === payload) };
					}	

					return { data: [] }
				}

				return { error: "Budget with specified ID does not exist" }
			},
			providesTags: ['Expense']
		}),

		moveExpenses: build.mutation({
			queryFn: (payload) => {
				localStorage.setItem("expenses", JSON.stringify(payload))
				return {
					data: payload
				}
			},
			invalidatesTags: ['Expense']
		}),

	}),
	overrideExisting: false,
})

export const {
	useAddExpenseMutation,

	useDeleteExpenseMutation,

	useEditExpenseMutation,

	useGetBudgetExpensesQuery,
	useGetExpensesQuery,

	useMoveExpensesMutation,
} = expensesApi

export default expensesApi