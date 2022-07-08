import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { FaEye } from "react-icons/fa"
import { BUDGETS_PAGE_URL, BUDGET_EXPENSES_PAGE_URL } from "../../config"
import { open } from "../../store/features/alert-slice";
import { InfoComp } from "../../components/common";
import { Button } from "../../components/controls"
import { LoadingPage, toCapitalize } from "../../utils"

const BudgetDetail = () => {
	const [budget, setBudget] = useState(null)
	const [expenses, setExpenses] = useState([])
	const [loading, setLoading] = useState(true)

	const {id} = useParams();
	const navigate = useNavigate()

	const dispatch = useDispatch();

	useEffect(() => {
		setTimeout(() => {

			const storageBudgets = localStorage.getItem("budgets")
			if (storageBudgets === null) {
				navigate(BUDGETS_PAGE_URL)
				dispatch(open({
					message: `Budget with ID \"${id}\" does not exist!`,
					type: "danger",
				}))
			} else {
				const budgets = JSON.parse(storageBudgets)
				const _budget = budgets.find(value => value.id === parseInt(id))
				if (_budget) {
					setBudget(_budget)
					let storageExpenses = localStorage.getItem("expenses")
					if (storageExpenses !== null) {
						storageExpenses = JSON.parse(storageExpenses)
						setExpenses(storageExpenses.filter(expense => expense.budgetId === _budget.id))
					}
				} else {
					navigate(BUDGETS_PAGE_URL)
					dispatch(open({
						message: `Budget with ID \"${id}\" does not exist!`,
						type: "danger",
					}))
				}
			}
			setLoading(false)
		}, 2000)
	}, [dispatch, navigate, id])

	const details = [
		{ title: "Name", value: budget?.name ? toCapitalize(budget.name) : "" },
		{ title: "Amount", value: budget?.amount || 2 },
		{ title: "Current Amount", value: "" },
		{ title: "Start Date", value: budget?.start_date ? new Date(budget.start_date).toDateString() : "" },
		{ title: "End Date", value: budget?.end_date ? new Date(budget.end_date).toDateString() : "" },
	];

	const expensesInfo = expenses.map(expense => ({
		title: toCapitalize(expense.title), value: `Amount: ${expense.amount}, Date: ${expense.date}`
	}))

	return (
		<div>

			{loading === false && budget !== null && (
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
						<InfoComp
							title="Details"
							infos={details}
						/>
					</div>	

					{expenses.length > 0 && (
						<div>
							<InfoComp
								title="Expenses"
								infos={expensesInfo}
							/>
						</div>	
					)}
				</>
			)}
			{loading && <LoadingPage />}
		</div>
	);
}

export default BudgetDetail;
