import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { open } from "../store/features/alert-slice";
import { useGetBudgetsQuery } from "../store/features/budgets-api-slice";
import {
	useGetExpensesQuery,
	useAddExpenseMutation,
	useEditExpenseMutation,
} from "../store/features/expenses-api-slice";
import { setBudgets } from "../store/features/budgets-slice";
import {
	setExpenses,
	addExpense,
	updateExpense,
} from "../store/features/expenses-slice";
import { useLoadingContext } from "../contexts";
import { Button } from "../components/controls";
import { Modal } from "../components/common";
import { ExpenseCard, ExpenseForm } from "../components/Expenses";
import { toCapitalize, UNCATEGORIZED_ID, UNCATEGORIZED_NAME } from "../utils";

const AllExpenses = () => {
	const dispatch = useDispatch();

	const { data: budgets, isLoading: budgetsLoading } = useGetBudgetsQuery();
	const { data: expenses, isLoading: expensesLoading } = useGetExpensesQuery();

	const [
		addExpense,
		{ error: addError, isLoading: addLoading, status: addStatus },
	] = useAddExpenseMutation();
	const [
		editExpense,
		{ error: editError, isLoading: editLoading, status: editStatus },
	] = useEditExpenseMutation();

	const { closeLoader, openLoader } = useLoadingContext();

	const [editMode, setEditMode] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

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

	const handleAddExpense = useCallback(
		(value) => {
			if (value.budgetId === UNCATEGORIZED_ID)
				Object.assign(value, {
					budgetName: UNCATEGORIZED_NAME,
					budgetId: UNCATEGORIZED_ID,
				});
			else {
				const budget = budgets
					? budgets.find((b) => b.id === value.budgetId)
					: null;
				if (budget)
					Object.assign(value, {
						budgetName: budget.name,
						budgetId: budget.id,
					});
				else {
					return setErrors((prevState) => ({
						...prevState,
						budgetId: `Budget with ID ${value.budgetId} was not found`,
					}));
				}
			}
			addExpense(value);
		},
		[budgets, addExpense]
	);

	const handleUpdateExpense = useCallback(
		(value) => {
			if (value.budgetId === UNCATEGORIZED_ID)
				Object.assign(value, {
					budgetName: UNCATEGORIZED_NAME,
					budgetId: UNCATEGORIZED_ID,
				});
			else {
				const budget = budgets
					? budgets.find((b) => b.id === value.budgetId)
					: null;
				if (budget) {
					Object.assign(value, {
						budgetName: budget.name,
						budgetId: budget.id,
					});
				} else
					setErrors((prevState) => ({
						...prevState,
						budgetId: `Budget with ID ${value.budgetId} was not found`,
					}));
			}
			editExpense(value);
		},
		[editExpense, budgets]
	);

	useEffect(() => {
		if (budgetsLoading || expensesLoading) openLoader();
		else closeLoader();
	}, [budgetsLoading, expensesLoading]);

	useEffect(() => {
		if (addStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Expense was added successfully!",
				})
			);
			setModalVisible(false);
			setData({});
		} else if (addStatus === "rejected" && addError) {
			console.log("ADD EXPENSE ERROR :>> ", addError);
		}
	}, [addStatus, addError]);

	useEffect(() => {
		if (editStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Expense was updated successfully!",
				})
			);
			setModalVisible(false);
			setData({});
			setEditMode(false);
		} else if (editStatus === "rejected" && editError) {
			console.log("ADD EXPENSE ERROR :>> ", editError);
		}
	}, [editStatus, editError]);

	return (
		<div>
			<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="my-2">
					<h3 className="top-heading">All Expenses</h3>
					<p className="top-description">
						An overview of your all your expenses.
					</p>
				</div>
				<div className="flex items-center justify-center my-2">
					<div>
						<Button
							bg="bg-primary-600 hover:bg-primary-500"
							caps
							iconSize="text-sm sm:text-base md:text-lg"
							IconLeft={FaPlus}
							onClick={() => {
								setData({});
								setEditMode(false);
								setModalVisible(true);
							}}
							padding="px-4 py-3"
							rounded="rounded-lg"
							title="add expense"
						/>
					</div>
				</div>
			</div>
			{expenses && expenses.length > 0 ? (
				<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
					{expenses.map((expense, index) => (
						<div key={index}>
							<ExpenseCard
								{...expense}
								bg={(index + 1) % 2 === 0 ? "bg-white" : "bg-gray-100"}
								updateExpense={(value) => {
									setData(value);
									setEditMode(true);
									setModalVisible(true);
								}}
							/>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col justify-center items-center my-4 py-4 rounded-lg">
					<div className="my-4">
						<FaPlus className="text-primary-600 text-6xl" />
					</div>
					<p className="top-description">There are currently no expenses.</p>
					<p className="top-description">Add one now</p>
				</div>
			)}
			<Modal
				close={() => setModalVisible(false)}
				containerClass=""
				component={
					<ExpenseForm
						budgets={budgets || []}
						data={data}
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
				} an expense for a budget...`}
				title={`${editMode ? "Update" : "Add"} a Budget Expense`}
				visible={modalVisible}
			/>
		</div>
	);
};

export default AllExpenses;
