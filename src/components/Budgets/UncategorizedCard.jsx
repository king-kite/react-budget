import { useSelector } from "react-redux"
import BudgetCard from "./Card"
import {UNCATEGORIZED_ID, UNCATEGORIZED_NAME} from "../../utils"

/*
bg="bg-gray-50",
	id, 
	name="undefined", 
	currentAmount=0, 
	amount,
	start_date,
	end_date,
	updateBudget
*/

const UncategorizedBudget = () => {
	const expenses = useSelector(state => state.expenses.data.filter(expense => expense.budgetId === UNCATEGORIZED_ID))
	if (expenses.length <= 0) return null

	const currentAmount = expenses.reduce((totalAmount, expense) => {
		const expenseDate = new Date(expense.date).toDateString()
		if (
			expense.budgetId === UNCATEGORIZED_ID
		) return totalAmount + expense.amount
	}, 0)

	return <BudgetCard 
		bg="bg-white"
		currentAmount={0}
		id={UNCATEGORIZED_ID}
		name={UNCATEGORIZED_NAME}
	/>
}

export default UncategorizedBudget