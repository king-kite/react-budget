import BudgetCard from "./Card"
import {UNCATEGORIZED_ID, UNCATEGORIZED_NAME} from "../../utils"

const UncategorizedBudget = ({ expenses = [] }) => {

	if (expenses === undefined || expenses.length <= 0) return null

	const currentAmount = expenses.reduce((totalAmount, expense) => {
		if (
			expense.budgetId === UNCATEGORIZED_ID
		) return totalAmount + parseFloat(+expense.amount)
		else return totalAmount
	}, 0)

	return <BudgetCard 
		bg="bg-white"
		currentAmount={currentAmount}
		id={UNCATEGORIZED_ID}
		name={UNCATEGORIZED_NAME}
		showEditButton={false}
	/>
}

export default UncategorizedBudget