import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	data: [],
}

const budgetsSlice = createSlice({
	name: "budgets",
	initialState,
	reducers: {
		addBudget(state, {payload}) {
			const firstObj = state.data[0]
			const id = firstObj ? firstObj.id + 1 : 1
			state.data.unshift({ ...payload, id: id })
			localStorage.setItem("budgets", JSON.stringify(state.data))
		},
		updateBudget(state, {payload}) {
			const budget = state.data.find(data => data.id === payload.id)
			if (budget) {
				Object.assign(budget, payload)
			}
			localStorage.setItem("budgets", JSON.stringify(state.data))
		},
		deleteBudget(state, {payload}) {
			const newData = state.data.filter(data => data.id !== payload);
			state.data = newData;
			localStorage.setItem("budgets", JSON.stringify(state.data))
		},
		setBudgets(state, {payload}) {
			state.data = payload
		}
	}
})

export const {
	addBudget, updateBudget, deleteBudget, setBudgets
} = budgetsSlice.actions

export default budgetsSlice.reducer