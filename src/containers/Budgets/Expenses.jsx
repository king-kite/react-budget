import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BiRefresh } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { BUDGETS_PAGE_URL } from "../../config";
import { open } from "../../store/features/alert-slice";
import { useGetBudgetQuery } from "../../store/features/budgets-api-slice";
import {
	useAddExpenseMutation,
	useEditExpenseMutation,
	useDeleteExpenseMutation
} from "../../store/features/expenses-api-slice";
import { useLoadingContext } from "../../contexts";
import { Button } from "../../components/controls";
import { Modal } from "../../components/common";
import { BudgetTotalCard } from "../../components/Budgets";
import { ExpenseCard, ExpenseForm } from "../../components/Expenses";
import {
	toCapitalize,
	UNCATEGORIZED_ID,
	UNCATEGORIZED_NAME,
} from "../../utils";

const BudgetExpenses = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const { openLoader, closeLoader } = useLoadingContext();

	const {
		data: budget,
		error,
		refetch: budgetRefresh,
		isFetching: budgetFetching,
		isLoading: budgetLoading,
	} = useGetBudgetQuery(id || skipToken, {
		skip: id === undefined,
	});

	const [
		addExpense,
		{ error: addError, isLoading: addLoading, status: addStatus },
	] = useAddExpenseMutation();
	const [
		editExpense,
		{ error: editError, isLoading: editLoading, status: editStatus },
	] = useEditExpenseMutation();
	const [
		deleteExpense,
		{ error: deleteError, isLoading: deleteLoading, status: deleteStatus },
	] = useDeleteExpenseMutation();

	const [modalVisible, setModalVisible] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const [data, setData] = useState({});
	const [errors, setErrors] = useState({});

	const handleChange = useCallback(({ target: { name, value } }) => {
		setData((prevState) => ({
			...prevState,
			[name]: value,
		}));

		setErrors((prevState) => ({
			...prevState,
			[name]: "",
		}));
	}, []);

	const handleRefresh = useCallback(() => {
		budgetRefresh();
	}, [budgetRefresh]);

	useEffect(() => {
		if (addStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: `${budget ? toCapitalize(
						budget.name + " Budget"
					) : ""} Expense was added successfully!`,
				})
			);
			setModalVisible(false);
			setData({});
		} else if (addStatus === "rejected" && addError) {
			dispatch(open({
				type: "danger",
				message: String(addError.detail)
			}))
		}
	}, [budget, addStatus, addError]);

	useEffect(() => {
		if (editStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: `${budget ? toCapitalize(
						budget.name + " Budget"
					) : ""} Expense was updated successfully!`,
				})
			);
			setModalVisible(false);
			setData({});
			setEditMode(false);
		} else if (editStatus === "rejected" && editError) {
			dispatch(open({
				type: "danger",
				message: String(editError.detail)
			}))
		}
	}, [budget, editStatus, editError]);

	useEffect(() => {
		if (deleteStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Expense was deleted successfully!",
				})
			);
		} else if (deleteStatus === "rejected" && deleteError) {
			dispatch(open({
				type: "danger",
				message: String(deleteError.detail)
			}))
		}
	}, [deleteStatus, deleteError]);

	const handleAddExpense = useCallback(
		(value) => {
			if (budget) {
				addExpense({
					...value,
					budgetId: budget.id,
					budgetName: budget.name,
					start_date: budget?.start_date || undefined,
					end_date: budget?.end_date || undefined,
				});	
			}
		},
		[addExpense, budget]
	);

	const handleUpdateExpense = useCallback(
		(value) => {
			if (budget) {
				editExpense({
					...value,
					budgetId: budget.id,
					budgetName: budget.name,
					start_date: budget?.start_date || undefined,
					end_date: budget?.end_date || undefined,
				});	
			}
		},
		[editExpense, budget]
	);

	const handleDeleteExpense = useCallback(({ id, title }) => {
		const _delete = window.confirm(
			`Are you sure you want to delete the ${toCapitalize(
				title
			)} Expense?`
		);
		if (_delete === true) {
			deleteExpense(id);
		}
	}, [deleteExpense]);

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
	}, [dispatch, navigate, error]);

	useEffect(() => {
		if (budgetFetching || budgetLoading || deleteLoading) openLoader();
		else closeLoader();
	}, [budgetFetching, budgetLoading, deleteLoading]);

	return (
		<div>
			{budgetLoading === false && budget && (
				<>
					<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="my-2">
							<h3 className="top-heading">
								{budget.name} {id !== UNCATEGORIZED_ID ? "budget" : ""} expenses
							</h3>
							<p className="top-description">
								{id !== UNCATEGORIZED_ID
									? `An overview of your expenses for your ${budget.name} budget.`
									: "An overview of your uncategorized expenses."}
							</p>
						</div>
						<div className="flex items-center justify-center my-2">
							<div className="mr-1 md:mx-2">
								<Button
									bg="bg-primary-600 hover:bg-primary-500"
									caps
									iconSize="text-sm sm:text-base md:text-lg"
									IconLeft={FaPlus}
									onClick={() => {
										setEditMode(false);
										setData({});
										setModalVisible(true);
									}}
									padding="px-4 py-3"
									rounded="rounded-lg"
									title="add expense"
								/>
							</div>
							<div className="mx-1 md:mx-2">
								<Button
									bg="bg-primary-600 hover:bg-primary-500"
									caps
									iconSize="text-sm sm:text-base md:text-lg"
									IconLeft={BiRefresh}
									onClick={handleRefresh}
									padding="px-4 py-3"
									rounded="rounded-lg"
									title="refresh"
								/>
							</div>
						</div>
					</div>
					{budget.expenses && budget.expenses.length > 0 ? (
						<>
							{id !== UNCATEGORIZED_ID && (
								<div className="gap-4 grid grid-cols-1 my-4 sm:gap-5 sm:my-5 md:gap-6 md:my-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:my-8">
									<BudgetTotalCard
										amount={budget.amount || 0}
										expenses={budget.expenses}
									/>
								</div>
							)}
							<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
								{budget.expenses.map((expense, index) => (
									<div key={index}>
										<ExpenseCard
											{...expense}
											bg={(index + 1) % 2 === 0 ? "bg-white" : "bg-gray-100"}
											updateExpense={(value) => {
												setEditMode(true);
												setData(value);
												setModalVisible(true);
											}}
											deleteExpense={handleDeleteExpense}
										/>
									</div>
								))}
							</div>
						</>
					) : (
						<div className="flex flex-col justify-center items-center my-4 py-4 rounded-lg">
							<div className="my-4">
								<FaPlus className="text-primary-600 text-6xl" />
							</div>
							<p className="top-description">
								There are currently no expenses{" "}
								{id !== UNCATEGORIZED_ID ? "for this budget" : ""}
							</p>
							<p className="top-description">Add one now</p>
						</div>
					)}
					<Modal
						close={() => setModalVisible(false)}
						containerClass=""
						component={
							<ExpenseForm
								data={data}
								dates={
									budget && budget.start_date && budget.end_date ? {
										start_date: budget.start_date,
										end_date: budget.end_date,
									} : undefined
								}
								errors={errors}
								loading={editMode ? editLoading : addLoading}
								onChange={handleChange}
								onSubmit={editMode ? handleUpdateExpense : handleAddExpense}
								onReset={() =>
									setData((prevState) => ({
										...prevState,
										title: "",
										description: "",
										amount: "",
										date: "",
										budgetId: "",
									}))
								}
							/>
						}
						description={`Fill in the form below to ${
							editMode ? "update" : "add"
						} an ${toCapitalize(budget.name)} ${
							id === UNCATEGORIZED_ID ? "" : "budget"
						} expense.`}
						title={`${editMode ? "Edit" : "Add"} ${toCapitalize(budget.name)} ${
							id === UNCATEGORIZED_ID ? "" : "Budget"
						} Expense.`}
						visible={modalVisible}
					/>
				</>
			)}
		</div>
	);
};

export default BudgetExpenses;
