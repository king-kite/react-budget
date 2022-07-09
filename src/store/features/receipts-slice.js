import { createSlice } from "@reduxjs/toolkit"
import { uid } from "uid"

const initialState = {
	data: []
}

const receiptsSlice = createSlice({
	name: "receipts",
	initialState,
	reducers: {
		addReceipt(state, {payload}) {
			state.data.unshift({...payload, id: payload.id || uid(16)})
			localStorage.setItem("receipts", JSON.stringify(state.data))
		},
		updateReceipt(state, {payload}) {
			const receipt = state.data.find(data => data.id === payload.id)
			if (receipt) {
				Object.assign(receipt, payload)
			}
			localStorage.setItem("receipts", JSON.stringify(state.data))
		},
		deleteReceipt(state, {payload}) {
			const newData = state.data.filter(data => data.id !== payload);
			state.data = newData;
			localStorage.setItem("receipts", JSON.stringify(state.data))
		},
		setReceipts(state, {payload}) {
			state.data = payload
		},
	}
})

export const {
	addReceipt, updateReceipt, deleteReceipt, setReceipts
} = receiptsSlice.actions

export default receiptsSlice.reducer