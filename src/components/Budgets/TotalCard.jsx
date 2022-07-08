import { useSelector } from "react-redux"
import BudgetCard from "./Card"
import {UNCATEGORIZED_ID, UNCATEGORIZED_NAME} from "../../utils"

const UncategorizedBudget = () => {
	const budgets = useSelector(state => state.budgets.data)
	const expenses = useSelector(state => state.expenses.data)
	if (budgets.length <= 0) return null

	const budgetsAmount = budgets.reduce((totalAmount, budget) => {
		return totalAmount + parseInt(budget.amount)
	}, 0)

	const currentAmount = expenses.reduce((totalAmount, expense) => {
		return totalAmount + parseInt(expense.amount)
	}, 0)

	return <BudgetCard 
		bg="bg-gray-100"
		amount={budgetsAmount}
		currentAmount={currentAmount}
		name="Total"
		showButtons={false}
	/>
}

export default UncategorizedBudget