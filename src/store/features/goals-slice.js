import { createSlice } from "@reduxjs/toolkit"
import { uid } from "uid"

const initialState = {
	data: []
}

const goalsSlice = createSlice({
	name: "goals",
	initialState,
	reducers: {
		addGoal(state, {payload}) {
			state.data.unshift({...payload, id: payload.id || uid(16)})
			localStorage.setItem("goals", JSON.stringify(state.data))
		},
		updateGoal(state, {payload}) {
			const goal = state.data.find(data => data.id === payload.id)
			if (goal) {
				Object.assign(goal, payload)
			}
			localStorage.setItem("goals", JSON.stringify(state.data))
		},
		deleteGoal(state, {payload}) {
			const newData = state.data.filter(data => data.id !== payload);
			state.data = newData;
			localStorage.setItem("goals", JSON.stringify(state.data))
		},
		setGoals(state, {payload}) {
			state.data = payload
		},
	}
})

export const {
	addGoal, updateGoal, deleteGoal, setGoals
} = goalsSlice.actions

export default goalsSlice.reducer