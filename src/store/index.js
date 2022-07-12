import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { NODE_ENV } from "../config";

import alertReducer from "./features/alert-slice";
import authReducer from "./features/auth-slice";

import baseApi from "./features/base-api-slice";

const store = configureStore({
  devTools: NODE_ENV === "development",
  reducer: {
    alert: alertReducer,
    auth: authReducer,

    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export default store;
