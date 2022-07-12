import BudgetCard from "./Card"
import {UNCATEGORIZED_ID, UNCATEGORIZED_NAME} from "../../utils"

const UncategorizedBudget = ({ budgets=[], expenses=[] }) => {
	if (budgets.length <= 0) return null

	const budgetsAmount = budgets && budgets.length > 0 ? budgets.reduce((totalAmount, budget) => {
		return totalAmount + parseInt(budget.amount)
	}, 0) : 0

	const currentAmount = expenses && expenses.length > 0 ? expenses.reduce((totalAmount, expense) => {
		return totalAmount + parseInt(expense.amount)
	}, 0) : 0

	return <BudgetCard 
		bg="bg-gray-100"
		amount={budgetsAmount}
		currentAmount={currentAmount}
		name="Total"
		showButtons={false}
	/>
}

export default UncategorizedBudget