import { useSelector } from "react-redux"
import BudgetCard from "./Card"
import {UNCATEGORIZED_ID, UNCATEGORIZED_NAME} from "../../utils"

const UncategorizedBudget = () => {
	const expenses = useSelector(state => state.expenses.data.filter(expense => expense.budgetId === UNCATEGORIZED_ID))
	if (expenses.length <= 0) return null

	const currentAmount = expenses.reduce((totalAmount, expense) => {
		if (
			expense.budgetId === UNCATEGORIZED_ID
		) return totalAmount + parseInt(expense.amount)
		else return 0
	}, 0)

	return <BudgetCard 
		bg="bg-white"
		currentAmount={currentAmount}
		id={UNCATEGORIZED_ID}
		name={UNCATEGORIZED_NAME}
	/>
}

export default UncategorizedBudget