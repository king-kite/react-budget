import { Routes, Route } from "react-router-dom";

import * as routes from "./config/routes";

import Layout from "./Layout";

import { Authenticated, CheckAuth, NotAuthenticated } from "./utils";

import NotFoundPage from "./pages/404";

import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import HomePage from "./pages";

import BudgetsPage from "./pages/budgets";
import BudgetDetailPage from "./pages/budgets/detail";
import BudgetExpensesPage from "./pages/budgets/expenses";

import ExpensesPage from "./pages/expenses";
import GoalsPage from "./pages/goals";
import IncomePage from "./pages/income";
import LiteracyPage from "./pages/literacy";
import ReceiptsPage from "./pages/receipts";

const AppRoutes = () => (
	<Routes>
		<Route path="*" element={<NotFoundPage />} />

		<Route element={<CheckAuth />}>
			<Route element={<NotAuthenticated />}>
				<Route path={routes.LOGIN_PAGE_URL} element={<LoginPage />} />
				<Route
					path={routes.REGISTER_PAGE_URL}
					element={<RegisterPage />}
				/>
			</Route>

			<Route element={<Authenticated />}>
				<Route element={<Layout />}>
					<Route path={routes.HOME_PAGE_URL} element={<HomePage />} />
					<Route path={routes.BUDGETS_PAGE_URL}>
						<Route path="" element={<BudgetsPage />} />
						<Route path=":id">
							<Route path="" element={<BudgetDetailPage />} />
							<Route
								path="expenses/"
								element={<BudgetExpensesPage />}
							/>
						</Route>
					</Route>
					<Route
						path={routes.EXPENSES_PAGE_URL}
						element={<ExpensesPage />}
					/>

					<Route
						path={routes.GOALS_PAGE_URL}
						element={<GoalsPage />}
					/>

					<Route
						path={routes.INCOME_PAGE_URL}
						element={<IncomePage />}
					/>

					<Route
						path={routes.LITERACY_PAGE_URL}
						element={<LiteracyPage />}
					/>

					<Route
						path={routes.RECEIPTS_PAGE_URL}
						element={<ReceiptsPage />}
					/>
				</Route>
			</Route>
		</Route>
	</Routes>
);

export default AppRoutes;
