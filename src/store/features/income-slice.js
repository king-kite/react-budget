import { createSlice } from "@reduxjs/toolkit"
import { uid } from "uid"

const initialState = {
	data: []
}

const incomeSlice = createSlice({
	name: "income",
	initialState,
	reducers: {
		addIncome(state, {payload}) {
			state.data.unshift({...payload, id: payload.id || uid(16)})
			localStorage.setItem("income", JSON.stringify(state.data))
		},
		updateIncome(state, {payload}) {
			const income = state.data.find(data => data.id === payload.id)
			if (income) {
				Object.assign(income, payload)
			}
			localStorage.setItem("income", JSON.stringify(state.data))
		},
		deleteIncome(state, {payload}) {
			const newData = state.data.filter(data => data.id !== payload);
			state.data = newData;
			localStorage.setItem("income", JSON.stringify(state.data))
		},
		setIncome(state, {payload}) {
			state.data = payload
		},
	}
})

export const {
	addIncome, updateIncome, deleteIncome, setIncome
} = incomeSlice.actions

export default incomeSlice.reducer