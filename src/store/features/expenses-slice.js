import { createSlice } from "@reduxjs/toolkit"
import { uid } from "uid"

const initialState = {
	data: []
}

const expensesSlice = createSlice({
	name: "expenses",
	initialState,
	reducers: {
		addExpense(state, {payload}) {
			state.data.unshift({...payload, id: payload.id || uid(16)})
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
		moveExpenses(state, { payload }) {
			state.data = payload
			localStorage.setItem("expenses", JSON.stringify(payload))
		}
	}
})

export const {
	addExpense, updateExpense, deleteExpense, setExpenses, moveExpenses
} = expensesSlice.actions

export default expensesSlice.reducer