import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import {
	setBudgets,
	addBudget,
	updateBudget,
} from "../../store/features/budgets-slice";
import { setExpenses } from "../../store/features/expenses-slice";
import { open } from "../../store/features/alert-slice";
import { Button } from "../../components/controls";
import {
	BudgetCard,
	BudgetForm,
	TotalCard,
	UncategorizedBudgetCard,
} from "../../components/Budgets";
import { Modal } from "../../components/common";
import { LoadingPage } from "../../utils";

const Budgets = () => {
	const [data, setData] = useState({});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(true);
	const [formLoading, setFormLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const dispatch = useDispatch();
	const budgets = useSelector((state) => state.budgets.data);
	const expenses = useSelector((state) => state.expenses.data);

	const { state } = useLocation();

	useEffect(() => {
		if (state && state?.budgetValue) {
			setData(state.budgetValue)
			setModalVisible(true)
			setEditMode(true)
		}
	}, [state])

	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			const budgets = localStorage.getItem("budgets");
			const expenses = localStorage.getItem("expenses");
			if (budgets !== null) {
				dispatch(setBudgets(JSON.parse(budgets)));
			}
			if (expenses !== null) {
				dispatch(setExpenses(JSON.parse(expenses)));
			}
			setLoading(false);
		}, 2000);
	}, [dispatch]);

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

	const handleAddBudget = useCallback(
		(value) => {
			setFormLoading(true);
			setTimeout(() => {
				let isValid = true;
				const exists = budgets.find(
					(budget) => budget.name === value.name
				);
				if (exists) {
					setErrors((prevState) => ({
						...prevState,
						name: `Budget with name \"${value.name}\" already exists!`,
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

				if (isValid === true) {
					dispatch(addBudget(value));
					dispatch(
						open({
							type: "success",
							message: "Budget was created successfully!",
						})
					);

					setModalVisible(false);
					setData({});
				}
				setFormLoading(false);
			}, 2000);
		},
		[dispatch, budgets]
	);

	const handleUpdateBudget = useCallback(
		(value) => {
			setFormLoading(true);
			setTimeout(() => {
				let isValid = true;
				const exists = budgets.find(
					(budget) =>
						budget.name === value.name && budget.id !== value.id
				);
				if (exists) {
					setErrors((prevState) => ({
						...prevState,
						name: `Budget with name \"${value.name}\" already exists!`,
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

				if (isValid === true) {
					dispatch(updateBudget(value));
					dispatch(
						open({
							type: "success",
							message: "Budget was updated successfully!",
						})
					);

					setModalVisible(false);
					setData({});
				}
				setFormLoading(false);
			}, 2000);
		},
		[dispatch]
	);

	return (
		<div>
			<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="my-2">
					<h3 className="top-heading">budgets</h3>
					<p className="top-description">
						An overview of your budgets
					</p>
				</div>
				<div className="flex items-center justify-center my-2">
					<div>
						<Button
							bg="bg-primary-600 hover:bg-primary-500"
							caps
							iconSize="text-sm md:text-base"
							IconLeft={FaPlus}
							onClick={() => {
								setData({})
								setModalVisible(true)
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
						{budgets.map((budget, index) => {
							const budgetStartDate = new Date(budget.start_date)
							const budgetEndDate = new Date(budget.end_date)

							const currentAmount = expenses.reduce((totalAmount, expense) => {
								const expenseDate = new Date(expense.date)
								if (
									expense.budgetId === budget.id 
									// &&
									// expenseDate >= budgetStartDate &&
									// expenseDate <= budgetEndDate
								) return totalAmount + parseInt(expense.amount)
								else return 0
							}, 0)

							return (
								<div key={index}>
									<BudgetCard
										{...budget}
										bg={
											(index + 1) % 2 === 0
												? "bg-white"
												: "bg-gray-100"
										}
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
						<UncategorizedBudgetCard />
						<TotalCard />
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
						loading={formLoading}
						onChange={handleChange}
						onReset={() => setData({})}
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
			{loading && <LoadingPage />}
		</div>
	);
};

export default Budgets;
