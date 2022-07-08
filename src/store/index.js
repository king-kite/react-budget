import { configureStore } from "@reduxjs/toolkit";
import { NODE_ENV } from "../config";
import alertReducer from "./features/alert-slice";
import authReducer from "./features/auth-slice";
import budgetsReducer from "./features/budgets-slice";
import expensesReducer from "./features/expenses-slice";
import modalReducer from "./features/modal-slice"

const store = configureStore({
  devTools: NODE_ENV === "development",
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    budgets: budgetsReducer,
    expenses: expensesReducer,
    modal: modalReducer
  },
});

export default store;