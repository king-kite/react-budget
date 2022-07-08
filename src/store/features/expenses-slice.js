import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	data: []
}

const expensesSlice = createSlice({
	name: "expenses",
	initialState,
	reducers: {
		addExpense(state, {payload}) {
			const firstObj = state.data[0]
			const id = firstObj ? firstObj.id + 1 : 1
			state.data.unshift({...payload, id})
			localStorage.setItem("expenses", JSON.stringify(state.data))
		},
		updateExpense(state, {payload}) {
			const expense = state.data.find(data => data.id === payload.id)
			if (expense) {
				Object.assign(expense, payload)
			}
			localStorage.setItem("expenses", JSON.stringify(state.data))
		},
		deleteExpense(state, {payload}) {
			const newData = state.data.filter(data => data.id !== payload);
			state.data = newData;
			localStorage.setItem("expenses", JSON.stringify(state.data))
		},
		setExpenses(state, {payload}) {
			state.data = payload
		},
	}
})

export const {
	addExpense, updateExpense, deleteExpense, setExpenses
} = expensesSlice.actions

export default expensesSlice.reducer