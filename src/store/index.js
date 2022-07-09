import { configureStore } from "@reduxjs/toolkit";
import { NODE_ENV } from "../config";
import alertReducer from "./features/alert-slice";
import authReducer from "./features/auth-slice";
import budgetsReducer from "./features/budgets-slice";
import expensesReducer from "./features/expenses-slice";
import goalsReducer from "./features/goals-slice";
import incomeReducer from "./features/income-slice";
import receiptsReducer from "./features/receipts-slice";

const store = configureStore({
  devTools: NODE_ENV === "development",
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    budgets: budgetsReducer,
    expenses: expensesReducer,
    income: incomeReducer,
    goals: goalsReducer,
    receipts: receiptsReducer
  },
});

export default store;