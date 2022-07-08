import { Routes, Route } from "react-router-dom";

import * as routes from "./config/routes";

import Layout from "./Layout";

import { Authenticated, CheckAuth, NotAuthenticated } from "./utils";

import NotFoundPage from "./pages/404";

import LoginPage from "./pages/auth/login";
import HomePage from "./pages"
import BudgetsPage from "./pages/budgets"
import BudgetDetailPage from "./pages/budgets/detail"
import BudgetExpensesPage from "./pages/budgets/expenses"

import ExpensesPage from "./pages/expenses";
import IncomePage from "./pages/income";

const AppRoutes = () => (
	<Routes>
		<Route path="*" element={<NotFoundPage />} />

		<Route element={<CheckAuth />}>
			<Route element={<NotAuthenticated />}>
				<Route path={routes.LOGIN_PAGE_URL} element={<LoginPage />} />
			</Route>

			<Route element={<Authenticated />}>
				<Route element={<Layout />}>

					{/* Add Pages Here */}
					<Route path={routes.HOME_PAGE_URL} element={<HomePage />} />
					<Route path={routes.BUDGETS_PAGE_URL}>
						<Route path="" element={<BudgetsPage />} />
						<Route path=":id">
							<Route path="" element={<BudgetDetailPage />} />
							<Route path="expenses/" element={<BudgetExpensesPage />} />
						</Route>
					</Route>
					<Route path={routes.EXPENSES_PAGE_URL} element={<ExpensesPage />} />
					<Route path={routes.INCOME_PAGE_URL} element={<IncomePage />} />
				</Route>
			</Route>
		</Route>
	</Routes>
);

export default AppRoutes;
