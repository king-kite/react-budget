import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { FaPlus } from "react-icons/fa";
import { BUDGETS_PAGE_URL } from "../../config"
import { open } from "../../store/features/alert-slice";
import { setExpenses, addExpense, updateExpense } from "../../store/features/expenses-slice";
import { useLoadingContext } from "../../contexts"
import { Button } from "../../components/controls"
import { Modal } from "../../components/common";
import { ExpenseCard, ExpenseForm } from "../../components/Expenses"
import { toCapitalize, UNCATEGORIZED_ID, UNCATEGORIZED_NAME } from "../../utils"

const BudgetExpenses = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const expenses = useSelector(state => state.expenses.data)

	const { isLoading, openLoader, closeLoader } = useLoadingContext()

	const [budgetExpenses, setBudgetExpenses] = useState([])
	const [budget, setBudget] = useState(null)
	const [modalVisible, setModalVisible] = useState(false);
	const [editMode, setEditMode] = useState(false)

	const [data, setData] = useState({})
	const [errors, setErrors] = useState({})
	const [formLoading, setFormLoading] = useState(false)

	const handleChange = useCallback(({ target: { name, value }}) => {
		setData(prevState => ({
			...prevState,
			[name]: value
		}))

		setErrors(prevState => ({
			...prevState,
			[name]: ""
		}))
	}, [])

	const handleAddExpense = useCallback((value) => {
		setFormLoading(true)
		setTimeout(() => {
			setModalVisible(false)
			setData({})
			dispatch(addExpense({ ...value, budgetId: budget.id, budgetName: budget.name }))
			dispatch(open({
				type: "success",
				message: `${toCapitalize(budget.name)} Budget Expense was added successfully!`
			}))
			setFormLoading(false)
		}, 2000)
	}, [dispatch, budget])

	const handleUpdateExpense = useCallback((value) => {
		setFormLoading(true)
		setTimeout(() => {
			setModalVisible(false)
			setData({})
			setEditMode(false)
			dispatch(updateExpense({ ...value, budgetId: budget.id, budgetName: budget.name }))
			dispatch(open({
				type: "success",
				message: `${toCapitalize(budget.name)} Budget Expense was updated successfully!`
			}))
			setFormLoading(false)
		}, 2000)
	}, [dispatch, budget])

	useEffect(() => {
		openLoader()
		setTimeout(() => {

			const storageBudgets = localStorage.getItem("budgets")
			if (storageBudgets === null) {
				navigate(BUDGETS_PAGE_URL, { replace: true })
				dispatch(open({
					message: `Budget with ID \"${id}\" does not exist!`,
					type: "danger",
				}))
			} else {
				const budgets = JSON.parse(storageBudgets)
				if (id === UNCATEGORIZED_ID) {
					setBudget({
						id: UNCATEGORIZED_ID,
						name: UNCATEGORIZED_NAME
					})
					let storageExpenses = localStorage.getItem("expenses")
					if (storageExpenses !== null) {
						storageExpenses = JSON.parse(storageExpenses)
						dispatch(setExpenses(storageExpenses))
					}
				} else {

					const budget = budgets.find(value => value.id === id)
					if (budget) {
						setBudget(budget)
						let storageExpenses = localStorage.getItem("expenses")
						if (storageExpenses !== null) {
							storageExpenses = JSON.parse(storageExpenses)
							dispatch(setExpenses(storageExpenses))
						}
					} else {
						navigate(BUDGETS_PAGE_URL, { replace: true })
						dispatch(open({
							message: `Budget with ID \"${id}\" does not exist!`,
							type: "danger",
						}))
					}
				}
			}
			closeLoader()
		}, 2000)
	}, [dispatch, navigate, id])

	useEffect(() => {
		setBudgetExpenses(expenses.filter(expense => expense.budgetId === id))
	}, [expenses])

	return (
		<div>
			{(isLoading === false && budget !== null &&
				<>
					<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="my-2">
							<h3 className="top-heading">{budget.name} budget expenses</h3>
							<p className="top-description">
								An overview of your expenses for your {budget.name} budget.
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
										setData({})
										setModalVisible(true)
									}}
									padding="px-4 py-3"
									rounded="rounded-lg"
									title="add expense"
								/>
							</div>
						</div>
					</div>
					{budgetExpenses.length > 0 ? (
						<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
							{budgetExpenses.map((expense, index) => (
								<div key={index}>
									<ExpenseCard 
										{...expense} 
										bg={(index + 1) % 2 === 0 ? "bg-white" : "bg-gray-100"}
										updateExpense={(value) => {
											setEditMode(true)
											setData(value)
											setModalVisible(true)
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
							<p className="top-description">
								There are currently no expenses for this budget.
							</p>
							<p className="top-description">
								Add one now
							</p>
						</div>
					)}
					<Modal
						close={() => setModalVisible(false)}
						containerClass=""
						component={
							<ExpenseForm 
								data={data}
								errors={errors}
								loading={formLoading}
								onChange={handleChange}
								onSubmit={editMode ? handleUpdateExpense : handleAddExpense}
								onReset={() => setData(prevState => ({
									...prevState,
									title: "",
									description: "",
									amount: "",
									date: "",
									budgetId: ""
								}))}
							/>
						}
						description={`Fill in the form below to ${editMode ? "update" : "add"} an expense for the ${toCapitalize(budget.name)} budget...`}
						title={`${editMode ? "Edit" : "Add"} ${toCapitalize(budget.name)} Budget Expenses`}
						visible={modalVisible}
					/>
				</>
			)}
		</div>
	);
};

export default BudgetExpenses;
