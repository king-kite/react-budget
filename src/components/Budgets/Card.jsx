import { useCallback, useEffect, useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { BUDGET_DETAIL_PAGE_URL, BUDGET_EXPENSES_PAGE_URL } from "../../config";
import { open } from "../../store/features/alert-slice";
import { useDeleteBudgetMutation } from "../../store/features/budgets-api-slice";
import {
	useGetExpensesQuery,
	useMoveExpensesMutation,
} from "../../store/features/expenses-api-slice";
import { Button } from "../controls";
import {
	currencyFormatter,
	LoadingPage,
	toCapitalize,
	UNCATEGORIZED_ID,
	UNCATEGORIZED_NAME,
} from "../../utils";

const Card = ({
	bg = "bg-gray-50",
	id,
	name = "undefined",
	currentAmount = 0,
	amount,
	start_date,
	end_date,
	updateBudget,
	showButtons = true,
	showEditButton = true,
	showDeleteButton = true,
	showDetailButton = true,
}) => {
	const ratio = currentAmount / amount;

	const [loading, setLoading] = useState(false);

	const { data: expenses, isLoading: expensesLoading } = useGetExpensesQuery();

	const dispatch = useDispatch();

	const [
		deleteBudget,
		{ isLoading: deleteLoading, error: deleteError, status: deleteStatus },
	] = useDeleteBudgetMutation();
	const [moveExpenses, { isLoading: moveLoading }] = useMoveExpensesMutation();

	const deleteUncategorizedExpenses = useCallback(() => {
		const newExpenses = expenses
			? expenses.filter((expense) => expense.budgetId !== UNCATEGORIZED_ID)
			: [];
		moveExpenses(newExpenses);
	}, [moveExpenses, expenses]);

	const moveExpensesToUncategorized = useCallback(
		(budgetId) => {
			const newExpenses = expenses
				? expenses.map((expense) => {
						if (expense.budgetId === budgetId)
							return {
								...expense,
								budgetName: UNCATEGORIZED_NAME,
								budgetId: UNCATEGORIZED_ID,
							};
						return expense;
				  })
				: [];
			moveExpenses(newExpenses);
		},
		[moveExpenses, expenses]
	);

	const handleDelete = useCallback(() => {
		const _delete = window.confirm(
			id === UNCATEGORIZED_ID
				? "Do you want to delete all Uncategorized Expenses?"
				: `Are you sure you want to delete the ${toCapitalize(name)} Budget?`
		);
		if (_delete === true) {
			if (id === UNCATEGORIZED_ID) deleteUncategorizedExpenses();
			else {
				moveExpensesToUncategorized(id);
				deleteBudget(id);
			}
			setLoading(false);
		}
	}, [deleteBudget, id, name, moveExpensesToUncategorized]);

	useEffect(() => {
		if (deleteStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: `${toCapitalize(name)} ${
						id === UNCATEGORIZED_ID ? "expenses were" : "budget was"
					} deleted successfully`,
				})
			);
		} else if (deleteStatus === "rejected" && deleteError) {
			console.log("DELETE BUDGET ERROR :>> ", deleteError);
		}
	}, [deleteStatus, deleteError]);

	return (
		<div
			className={`${
				amount
					? ratio < 0.5
						? bg
						: ratio < 0.75
						? "bg-yellow-200"
						: "bg-red-200"
					: bg
			} border-2 border-gray-300 h-full p-4 relative rounded-lg shadow-lg w-full`}
		>
			<div className="flex items-baseline justify-between px-1">
				<h4 className="capitalize font-medium text-base text-gray-500 md:text-lg">
					{name}
				</h4>
				<div className="font-medium flex items-baseline text-base text-gray-600 tracking-wider md:text-lg lg:text-xl">
					{currencyFormatter.format(currentAmount)}
					{amount && (
						<>
							<span className="mx-1">/</span>
							<span className="font-normal text-gray-500 text-sm md:text-base">
								{currencyFormatter.format(amount)}
							</span>
						</>
					)}
				</div>
			</div>
			{start_date && end_date && (
				<p className="capitalize font-medium px-1 text-gray-500 text-sm md:text-base">
					{new Date(start_date).toDateString()} -{" "}
					{new Date(end_date).toDateString()}
				</p>
			)}
			{amount && (
				<div className="mt-3 mb-5 px-1 w-full">
					<div className="bg-gray-300 h-[12px] my-1 rounded-lg w-full">
						<div
							className={`${
								ratio < 0.5
									? "bg-green-500"
									: ratio < 0.75
									? "bg-yellow-600"
									: "bg-red-600"
							} ${
								ratio > 0.95 ? "rounded-lg" : ""
							} duration-1000 h-full rounded-l-lg transform transition-all`}
							style={{
								width: `${
									ratio === 0
										? 0
										: ratio < 0.01
										? 1
										: ratio > 1
										? 100
										: ratio * 100
								}%`,
							}}
						/>
					</div>
				</div>
			)}
			{showButtons && (
				<div
					className={`gap-4 grid grid-cols-2 ${
						amount ? "px-2" : "px-1 mt-3"
					} md:gap-5 lg:gap-3 w-full`}
				>
					{showEditButton && (
						<div>
							<Button
								bg="bg-blue-50 hover:bg-blue-200"
								border="border border-blue-500"
								caps
								color="text-blue-700"
								focus="focus:ring-1 focus:ring-offset-1 focus:ring-blue-100"
								IconLeft={FaPen}
								onClick={() =>
									updateBudget({
										id,
										name: toCapitalize(name),
										amount,
										start_date,
										end_date,
									})
								}
								rounded="rounded-lg"
								title="Edit"
							/>
						</div>
					)}
					{showDeleteButton && (
						<div>
							<Button
								bg="bg-red-100 hover:bg-red-200"
								border="border border-red-500"
								caps
								color="text-red-500"
								focus="focus:ring-1 focus:ring-offset-1 focus:ring-red-100"
								onClick={handleDelete}
								IconLeft={FaTrash}
								rounded="rounded-lg"
								title="delete"
							/>
						</div>
					)}
					{showDetailButton && (
						<div>
							<Button
								bg="bg-gray-100 hover:bg-gray-200"
								border="border border-gray-600"
								caps
								color="text-gray-600"
								focus="focus:ring-1 focus:ring-offset-1 focus:ring-gray-200"
								link={BUDGET_DETAIL_PAGE_URL(id)}
								IconLeft={FaEye}
								rounded="rounded-lg"
								title="details"
							/>
						</div>
					)}
					<div>
						<Button
							bg="bg-green-100 hover:bg-green-200"
							border="border border-green-600"
							caps
							color="text-green-600"
							focus="focus:ring-1 focus:ring-offset-1 focus:ring-green-200"
							link={BUDGET_EXPENSES_PAGE_URL(id)}
							IconLeft={FaEye}
							rounded="rounded-lg"
							title="Expenses"
						/>
					</div>
				</div>
			)}
			{(deleteLoading || expensesLoading || moveLoading) && (
				<LoadingPage className="absolute rounded-lg" />
			)}
		</div>
	);
};

export default Card;
