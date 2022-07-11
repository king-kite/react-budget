import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { skipToken } from "@reduxjs/toolkit/query/react"
import { BUDGETS_PAGE_URL, BUDGET_EXPENSES_PAGE_URL } from "../../config";
import { open } from "../../store/features/alert-slice";
import { useGetBudgetQuery } from "../../store/features/budgets-api-slice";
import { useGetBudgetExpensesQuery } from "../../store/features/expenses-api-slice"
import { useLoadingContext } from "../../contexts";
import { InfoComp } from "../../components/common";
import { Button } from "../../components/controls";
import { toCapitalize } from "../../utils";

const BudgetDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const { data:budget, isLoading:budgetLoading, error } = useGetBudgetQuery(id || skipToken, {
		skip: id === undefined
	})

	const { data:expenses, isLoading:expensesLoading } = useGetBudgetExpensesQuery(id || skipToken, {
		skip: id === undefined
	})
	
	const { isLoading, closeLoader, openLoader } = useLoadingContext()

	useEffect(() => {
		if (budgetLoading || expensesLoading) openLoader()
		else closeLoader()
	}, [budgetLoading, expensesLoading])

	useEffect(() => {
		if (error) {
			console.log("BUDGET NOT FOUND ERROR :>> ", error)
			navigate(BUDGETS_PAGE_URL);
			dispatch(
				open({
					message: `Budget with ID \"${id}\" does not exist!`,
					type: "danger",
				})
			);	
		}
	}, [navigate, dispatch, error])

	const details = budget && expenses ? [
		{ title: "Name", value: budget?.name ? toCapitalize(budget.name) : "" },
		{ title: "Amount", value: budget?.amount || 2 },
		{
			title: "Current Amount",
			value: expenses.reduce(
				(totalAmount, expense) =>
					parseFloat(totalAmount) + parseFloat(expense.amount),
				0
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
			value: budget?.end_date ? new Date(budget.end_date).toDateString() : "",
		},
	] : [];

	const expensesInfo = budget && expenses ? expenses.map((expense) => ({
		title: toCapitalize(expense.title),
		value: `Amount: ${expense.amount}, Date: ${expense.date}`,
	})) : [];

	return (
		<div>
			{budget && (
				<>
					<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="my-2">
							<h3 className="top-heading">
								{budget.name} Budget Details and Expenses
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
