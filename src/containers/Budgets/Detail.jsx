import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { BUDGETS_PAGE_URL, BUDGET_EXPENSES_PAGE_URL } from "../../config";
import { open } from "../../store/features/alert-slice";
import { useGetBudgetQuery } from "../../store/features/budgets-api-slice";
import { useLoadingContext } from "../../contexts";
import { InfoComp } from "../../components/common";
import { Button } from "../../components/controls";
import { toCapitalize, currencyFormatter, UNCATEGORIZED_ID } from "../../utils";

const BudgetDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const { data: budget, isLoading: budgetLoading, error } = useGetBudgetQuery(
		id || skipToken,
		{
			skip: id === undefined,
		}
	);

	const { isLoading, closeLoader, openLoader } = useLoadingContext();

	useEffect(() => {
		if (budgetLoading) openLoader();
		else closeLoader();
	}, [budgetLoading]);

	useEffect(() => {
		if (error) {
			if (error.code && error.code === 404) navigate(BUDGETS_PAGE_URL);
			dispatch(
				open({
					message: String(error.detail),
					type: "danger",
				})
			);
		}
	}, [navigate, dispatch, error]);

	const details = budget
		? id !== UNCATEGORIZED_ID
			? [
					{
						title: "Name",
						value: budget?.name ? toCapitalize(budget.name) : "",
					},
					{
						title: "Amount",
						value: currencyFormatter.format(
							budget?.amount ? +budget.amount : 0
						),
					},
					{
						title: "Current Amount",
						value: currencyFormatter.format(
							budget.expenses.reduce(
								(totalAmount, expense) =>
									parseFloat(totalAmount) + parseFloat(+expense.amount),
								0
							)
						),
					},
					{
						title: "Start Date",
						value: budget?.start_date
							? new Date(budget.start_date).toDateString()
							: "",
					},
					{
						title: "End Date",
						value: budget?.end_date
							? new Date(budget.end_date).toDateString()
							: "",
					},
			  ]
			: [
					{
						title: "Name",
						value: budget?.name ? toCapitalize(budget.name) : "",
					},
					{
						title: "Current Amount",
						value: currencyFormatter.format(
							budget.expenses.reduce(
								(totalAmount, expense) =>
									parseFloat(totalAmount) + parseFloat(+expense.amount),
								0
							)
						),
					},
			  ]
		: [];

	const expensesInfo = budget
		? budget.expenses.map((expense) => ({
				title: toCapitalize(expense.title),
				value: `Amount: ${currencyFormatter.format(+expense.amount)}, Date: ${
					expense.date
				}`,
		  }))
		: [];

	return (
		<div>
			{budget && (
				<>
					<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="my-2">
							<h3 className="top-heading">
								{budget.name} {id !== UNCATEGORIZED_ID ? "Budget" : ""} Details
								and Expenses
							</h3>
						</div>
						<div className="flex items-center justify-center my-2">
							<div>
								<Button
									bg="bg-primary-600 hover:bg-primary-500"
									caps
									iconSize="text-sm md:text-base"
									IconLeft={FaEye}
									link={BUDGET_EXPENSES_PAGE_URL(id)}
									padding="px-6 py-3"
									rounded="rounded-lg"
									title="view expenses"
								/>
							</div>
						</div>
					</div>

					<div>
						<InfoComp title="Details" infos={details} />
					</div>

					{expensesInfo.length > 0 && (
						<div>
							<InfoComp title="Expenses" infos={expensesInfo} />
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default BudgetDetail;
