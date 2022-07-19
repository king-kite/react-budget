import BudgetCard from "./Card"

const TotalBudget = ({ amount, expenses=[] }) => {
	if (!expenses || !Array.isArray(expenses)) return null

	const expensesAmount = expenses.reduce((totalAmount, expense) => {
		return totalAmount + parseFloat(+expense.amount)
	}, 0)


	return <BudgetCard 
		bg="bg-gray-100 max-h-[100px]"
		amount={amount || 0}
		currentAmount={expensesAmount}
		name="Total"
		showButtons={false}
	/>
}

export default TotalBudget