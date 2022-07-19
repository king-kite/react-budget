import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: undefined,
  type: "info",
  visible: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    open(state, { payload }) {
      state.message = payload.message || "A server error occurred!";
      state.type = payload.type || "info";
      state.visible = true;
      if (payload.scrollTop !== false) window.scrollTo(0, 0);
    },
    close() {
      return initialState;
    },
  },
});

export const { close, open } = alertSlice.actions;
export default alertSlice.reducer;
