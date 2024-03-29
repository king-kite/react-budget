import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
	useGetBudgetsQuery,
	useAddBudgetMutation,
	useEditBudgetMutation,
} from "../../store/features/budgets-api-slice";
import { useGetExpensesQuery } from "../../store/features/expenses-api-slice";
import { open } from "../../store/features/alert-slice";
import { useLoadingContext } from "../../contexts";
import { Button } from "../../components/controls";
import {
	BudgetCard,
	BudgetForm,
	TotalCard,
	UncategorizedBudgetCard,
} from "../../components/Budgets";
import { Modal } from "../../components/common";
import { UNCATEGORIZED_ID, UNCATEGORIZED_NAME } from "../../utils";

function checkDate({ startDate, endDate, date }) {
	const start_date = new Date(startDate);
	const end_date = new Date(endDate);
	const value_date = new Date(date);

	if (start_date <= value_date && value_date <= end_date) return true;
	else return false;
}

const Budgets = () => {
	const [data, setData] = useState({});
	const [errors, setErrors] = useState({});
	const [editMode, setEditMode] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const dispatch = useDispatch();

	const { openLoader, closeLoader } = useLoadingContext();

	const { data: budgets, isLoading: budgetsLoading } = useGetBudgetsQuery();
	const { data: expenses, isLoading: expensesLoading } = useGetExpensesQuery();

	useEffect(() => {
		if (budgetsLoading || expensesLoading) openLoader();
		else closeLoader();
	}, [budgetsLoading, expensesLoading]);

	const [
		addBudget,
		{ error: addError, isLoading: addLoading, status: addStatus },
	] = useAddBudgetMutation();
	const [
		editBudget,
		{ error: editError, isLoading: editLoading, status: editStatus },
	] = useEditBudgetMutation();

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

	useEffect(() => {
		if (addStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Budget was created successfully!",
				})
			);
			setModalVisible(false);
			setData({});
		} else if (addStatus === "rejected" && addError) {
			console.log("ADD ERROR :>>", addError);
		}
	}, [addError, addStatus, dispatch]);

	useEffect(() => {
		if (editStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Budget was updated successfully!",
				})
			);

			setModalVisible(false);
			setData({});
		} else if (editStatus === "rejected" && editError) {
			console.log("EDIT ERROR :>>", editError);
		}
	}, [editError, editStatus, dispatch]);

	const handleAddBudget = useCallback(
		(value) => {
			let isValid = true;
			const budget = budgets.find(
				(budget) =>
					(budget.name === value.name) &&
					(
						checkDate({
							startDate: value.start_date,
							endDate: value.end_date,
							date: budget.start_date,
						}) ||
						checkDate({
							startDate: value.start_date,
							endDate: value.end_date,
							date: budget.end_date,
						}) || 
						checkDate({
							startDate: budget.start_date,
							endDate: budget.end_date,
							date: value.start_date,
						}) ||
						checkDate({
							startDate: budget.start_date,
							endDate: budget.end_date,
							date: value.end_date,
						})
					)
			);
			if (budget) {
				setErrors((prevState) => ({
					...prevState,
					name: `Budget with name \"${budget.name}\" already exists in the specified period of time => ${budget.start_date} - ${budget.end_date} !`,
				}));
				isValid = false;
			}
			const start_date = new Date(value.start_date).getTime();
			const end_date = new Date(value.end_date).getTime();

			if (end_date < start_date) {
				setErrors((prevState) => ({
					...prevState,
					end_date: "End date must be greater than Start date",
				}));
				isValid = false;
			}

			if (isValid === true) addBudget(value);
		},
		[addBudget, budgets]
	);

	const handleUpdateBudget = useCallback(
		(value) => {
			let isValid = true;
			const budget = budgets.find(
				(budget) =>
					(budget.name === value.name) && (budget.id !== value.id) &&
					(
						checkDate({
							startDate: value.start_date,
							endDate: value.end_date,
							date: budget.start_date,
						}) ||
						checkDate({
							startDate: value.start_date,
							endDate: value.end_date,
							date: budget.end_date,
						}) || 
						checkDate({
							startDate: budget.start_date,
							endDate: budget.end_date,
							date: value.start_date,
						}) ||
						checkDate({
							startDate: budget.start_date,
							endDate: budget.end_date,
							date: value.end_date,
						})
					)
			);
			if (budget) {
				setErrors((prevState) => ({
					...prevState,
					name: `Budget with name \"${budget.name}\" already exists in the specified period of time => ${budget.start_date} - ${budget.end_date} !`,
				}));
				isValid = false;
			}
			const start_date = new Date(value.start_date).getTime();
			const end_date = new Date(value.end_date).getTime();

			if (end_date < start_date) {
				setErrors((prevState) => ({
					...prevState,
					end_date: "End date must be greater than Start date",
				}));
				isValid = false;
			}

			if (isValid === true) editBudget(value);
		},
		[dispatch, budgets, editBudget]
	);

	return (
		<div>
			<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="my-2">
					<h3 className="top-heading">budgets</h3>
					<p className="top-description">An overview of your budgets</p>
				</div>
				<div className="flex items-center justify-center my-2">
					<div>
						<Button
							bg="bg-primary-600 hover:bg-primary-500"
							caps
							iconSize="text-sm md:text-base"
							IconLeft={FaPlus}
							onClick={() => {
								setData({});
								setEditMode(false);
								setModalVisible(true);
							}}
							padding="px-6 py-3"
							rounded="rounded-lg"
							title="add budget"
						/>
					</div>
				</div>
			</div>
			{(budgets && budgets.length > 0) || (expenses && expenses.length > 0) ? (
				<>
					<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:gap-3 lg:grid-cols-3">
						{budgets &&
							budgets.map((budget, index) => {
								const currentAmount = expenses
									? expenses.reduce((totalAmount, expense) => {
											if (expense.budgetId === budget.id)
												return (
													parseFloat(totalAmount) + parseFloat(expense.amount)
												);
											else return totalAmount;
									  }, 0)
									: 0;

								return (
									<div key={index}>
										<BudgetCard
											{...budget}
											bg={(index + 1) % 2 === 0 ? "bg-white" : "bg-gray-100"}
											currentAmount={currentAmount}
											updateBudget={(value) => {
												setData(value);
												setErrors({});
												setEditMode(true);
												setModalVisible(true);
											}}
										/>
									</div>
								);
							})}
					</div>
					<div className="gap-4 grid grid-cols-1 my-4 sm:gap-5 sm:my-5 md:gap-6 md:my-6 md:grid-cols-2 lg:gap-3 lg:my-3 lg:grid-cols-3">
						<UncategorizedBudgetCard
							expenses={
								expenses
									? expenses.filter(
											(expense) => expense.budgetId === UNCATEGORIZED_ID
									  )
									: []
							}
						/>
						<TotalCard expenses={expenses || []} budgets={budgets} />
					</div>
				</>
			) : (
				<div className="flex flex-col justify-center items-center my-4 py-4 rounded-lg">
					<div className="my-4">
						<FaPlus className="text-primary-600 text-6xl" />
					</div>
					<p className="top-description">You have no Budget.</p>
					<p className="top-description">Add one now</p>
				</div>
			)}
			<Modal
				close={() => setModalVisible(false)}
				containerClass=""
				component={
					<BudgetForm
						data={data}
						errors={errors}
						loading={editMode ? editLoading : addLoading}
						onChange={handleChange}
						onReset={() =>
							setData((prevState) => ({
								...prevState,
								name: "",
								start_date: "",
								end_date: "",
								amount: "",
							}))
						}
						onSubmit={(value) => {
							setErrors({});
							if (editMode === true) handleUpdateBudget(value);
							else handleAddBudget(value);
						}}
					/>
				}
				description={
					editMode
						? "Fill in the form below to edit this budget..."
						: "Fill in the form below to add a new budget..."
				}
				title={editMode ? "Edit Budget" : "Add a New Budget"}
				visible={modalVisible}
			/>
		</div>
	);
};

export default Budgets;
