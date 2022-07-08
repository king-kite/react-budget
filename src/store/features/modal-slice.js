import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    open(state) {
      state.visible = true;
    },
    close() {
      return initialState
    },
  },
});

export const { close, open } = modalSlice.actions;
export default modalSlice.reducer;
