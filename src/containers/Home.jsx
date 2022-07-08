import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBudgets } from "../store/features/budgets-slice";
import { setExpenses } from "../store/features/expenses-slice";
import { open } from "../store/features/modal-slice";
import { BUDGETS_PAGE_URL, EXPENSES_PAGE_URL } from "../config";
import { Cards, Top } from "../components/Home";
import { BudgetCard } from "../components/Budgets";
import { ExpenseCard } from "../components/Expenses";
import { Button } from "../components/controls";
import { LoadingPage } from "../utils";

const Dashboard = () => {
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const budgets = useSelector((state) => state.budgets.data);
	const expenses = useSelector((state) => state.expenses.data);

	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			const budgets = localStorage.getItem("budgets");
			if (budgets !== null) {
				dispatch(setBudgets(JSON.parse(budgets)));
			}
			const expenses = localStorage.getItem("expenses");
			if (expenses !== null) {
				dispatch(setExpenses(JSON.parse(expenses)));
			}
			setLoading(false);
		}, 2000);
	}, [dispatch]);

	return (
		<div>
			<Top />
			<Cards
				expenses={
					expenses && expenses.length > 0
						? expenses.reduce(
								(totalAmount, expense) =>
									totalAmount + parseFloat(expense.amount),
								0
						  )
						: 0
				}
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
			/>
			{budgets.length > 0 && (
				<div>
					<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="my-2">
							<h3 className="top-heading">Latest Budgets</h3>
							<p className="top-description">
								Take a look at your latest budgets and how your fair.
							</p>
						</div>
					</div>
					<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:gap-8">
						{budgets.slice(0, 3).map((budget, index) => {

							const currentAmount = expenses.reduce(
								(totalAmount, expense) => {
									if (expense.budgetId === budget.id) 
										return parseFloat(totalAmount) + parseFloat(expense.amount)
									else return totalAmount;
								},
								0
							);

							return (
								<div key={index}>
									<BudgetCard
										{...budget}
										currentAmount={currentAmount}
										updateBudget={(value) => {
											dispatch(open());
											navigate(BUDGETS_PAGE_URL, {
												state: {
													budgetValue: value,
												},
											});
										}}
									/>
								</div>
							)
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
			{expenses.length > 0 && (
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
					<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:gap-8">
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
			{loading && <LoadingPage />}
		</div>
	);
};

export default Dashboard;
