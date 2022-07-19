import { useCallback, useEffect } from "react";
import { useGetBudgetsQuery } from "../store/features/budgets-api-slice";
import { useGetExpensesQuery } from "../store/features/expenses-api-slice";
import { useGetIncomeQuery } from "../store/features/income-api-slice";
import { useLoadingContext } from "../contexts";
import {
	BUDGETS_PAGE_URL,
	EXPENSES_PAGE_URL,
	INCOME_PAGE_URL,
} from "../config";
import { Cards, Top } from "../components/Home";
import { BudgetCard } from "../components/Budgets";
import { ExpenseCard } from "../components/Expenses";
import { IncomeCard } from "../components/Income";
import { Button } from "../components/controls";

const Dashboard = () => {
	const { openLoader, closeLoader } = useLoadingContext();

	const {
		data: budgets,
		isFetching: budgetsLoading,
		refetch: budgetsRefresh,
	} = useGetBudgetsQuery();
	const {
		data: expenses,
		isFetching: expensesLoading,
		refetch: expensesRefresh,
	} = useGetExpensesQuery();
	const {
		data: income,
		isFetching: incomeLoading,
		refetch: incomeRefresh,
	} = useGetIncomeQuery();

	const onRefresh = useCallback(() => {
		budgetsRefresh();
		expensesRefresh();
		incomeRefresh();
	}, [budgetsRefresh, expensesRefresh, incomeRefresh]);

	useEffect(() => {
		if (budgetsLoading || expensesLoading || incomeLoading) openLoader();
		else closeLoader();
	}, [budgetsLoading, expensesLoading, incomeLoading]);

	return (
		<div>
			<Top onRefresh={onRefresh} />
			<Cards
				budgetCount={budgets ? budgets.length : 0}
				budgets={
					budgets && budgets.length > 0
						? budgets.reduce(
								(totalAmount, budget) =>
									totalAmount + parseFloat(budget.amount),
								0
						  )
						: 0
				}
				expenses={
					expenses && expenses.length > 0
						? expenses.reduce(
								(totalAmount, expense) =>
									totalAmount + parseFloat(expense.amount),
								0
						  )
						: 0
				}
				income={
					income && income.length > 0
						? income.reduce(
								(totalAmount, data) => totalAmount + parseFloat(data.amount),
								0
						  )
						: 0
				}
			/>
			{budgets && budgets.length > 0 && (
				<div>
					<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="my-2">
							<h3 className="top-heading">Latest Budgets</h3>
							<p className="top-description">
								Take a look at your latest budgets and how your fair.
							</p>
						</div>
					</div>
					<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:gap-3 lg:grid-cols-3">
						{budgets.slice(0, 6).map((budget, index) => {
							const currentAmount =  expenses ? expenses.reduce((totalAmount, expense) => {
								if (expense.budgetId === budget.id)
									return parseFloat(totalAmount) + parseFloat(expense.amount);
								else return totalAmount;
							}, 0) : 0;

							return (
								<div key={index}>
									<BudgetCard
										{...budget}
										currentAmount={currentAmount}
										showEditButton={false}
										showDeleteButton={false}
									/>
								</div>
							);
						})}
					</div>
					<div className="my-3 max-w-[8rem]">
						<Button
							bg="bg-primary-500 hover:bg-primary-300"
							caps
							link={BUDGETS_PAGE_URL}
							title="View all"
						/>
					</div>
				</div>
			)}
			{income && income.length > 0 && (
				<div>
					<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="my-2">
							<h3 className="top-heading">Latest Income Transactions</h3>
							<p className="top-description">
								Take a look at your latest income transactions, check how much
								you earn.
							</p>
						</div>
					</div>
					<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:gap-3 lg:grid-cols-3">
						{income.slice(0, 6).map((data, index) => (
							<div key={index}>
								<IncomeCard {...data} showEditDeleteButton={false} />
							</div>
						))}
					</div>
					<div className="my-3 max-w-[8rem]">
						<Button
							bg="bg-primary-500 hover:bg-primary-300"
							caps
							link={INCOME_PAGE_URL}
							title="View all"
						/>
					</div>
				</div>
			)}
			{expenses && expenses.length > 0 && (
				<div>
					<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="my-2">
							<h3 className="top-heading">Latest Expenses</h3>
							<p className="top-description">
								Take a look at your latest expenses and what you&apos;ve been
								doing.
							</p>
						</div>
					</div>
					<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:gap-3 lg:grid-cols-3">
						{expenses.slice(0, 6).map((expense, index) => (
							<div key={index}>
								<ExpenseCard {...expense} showEditDeleteButton={false} />
							</div>
						))}
					</div>
					<div className="my-3 max-w-[8rem]">
						<Button
							bg="bg-primary-500 hover:bg-primary-300"
							caps
							link={EXPENSES_PAGE_URL}
							title="View all"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
