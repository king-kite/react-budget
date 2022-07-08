import { useCallback, useState } from "react"
import { FaEye, FaPen, FaTrash } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { BUDGET_DETAIL_PAGE_URL, BUDGET_EXPENSES_PAGE_URL } from "../../config";
import { open } from "../../store/features/alert-slice";
import { addBudget, deleteBudget } from "../../store/features/budgets-slice";
import { moveExpenses } from "../../store/features/expenses-slice";
import { Button } from "../controls"
import { currencyFormatter, LoadingPage, toCapitalize, UNCATEGORIZED_ID, UNCATEGORIZED_NAME } from "../../utils";


const Card = ({ 
	bg="bg-gray-50",
	id, 
	name="undefined", 
	currentAmount=0, 
	amount,
	start_date,
	end_date,
	updateBudget
}) => {
	const ratio = currentAmount / amount;

	const [loading, setLoading] = useState(false)

	const uncategorized = useSelector(state => state.budgets.data.find(budget => budget.id === UNCATEGORIZED_ID))
	const expenses = useSelector(state => state.expenses.data)

	const dispatch = useDispatch()

	const moveExpensesToUncategorized = useCallback((budgetId) => {
		if (uncategorized === undefined || uncategorized === null) {
			dispatch(addBudget({
				id: UNCATEGORIZED_ID,
				name: UNCATEGORIZED_NAME,
			}))
		}
		const newExpenses = expenses.filter(expense => {
			if (expense.budgetId === budgetId) {
				Object.assign(expense, { budgetId: UNCATEGORIZED_ID, budgetName: UNCATEGORIZED_NAME })
			}
			return expense
		})
		dispatch(moveExpenses(newExpenses))
	}, [dispatch, expenses, uncategorized])

	const handleDelete = useCallback(() => {
		const _delete = window.confirm(`Are you sure you want to delete the ${toCapitalize(name)} Budget?`)
		if (_delete === true) {
			setLoading(true)
			setTimeout(() => {
				moveExpensesToUncategorized(id)
				dispatch(deleteBudget(id))
				dispatch(open({
					type: 'success',
					message: `${toCapitalize(name)} Budget was deleted successfully`
				}))
				setLoading(false)
			}, 2000)
		}
	}, [dispatch, id, name, moveExpensesToUncategorized])

	return (
		<div 
			className={`${amount ?
				ratio < 0.5 ? bg : ratio < 0.75 ? "bg-yellow-200" : "bg-red-200" : bg
			} border-2 border-gray-300 p-4 relative rounded-lg shadow-lg`}
		>
			<div className="flex items-baseline justify-between px-1">
				<h4 className="capitalize font-medium text-base text-gray-500 md:text-lg">
					{name}
				</h4>
				<div className="font-medium flex items-baseline text-base text-gray-500 tracking-wider md:text-lg lg:text-xl">
					{currencyFormatter.format(currentAmount)} 
					{amount && (
						<>
							<span className="mx-1">/</span>
							<span className="font-normal text-gray-400 text-sm md:text-base"> 
								{currencyFormatter.format(amount)}
							</span>
						</>
					)}
				</div>
			</div>
			{start_date && end_date && (
				<p className="capitalize font-medium px-1 text-gray-500 text-sm md:text-base">
					{new Date(start_date).toDateString()} - {new Date(end_date).toDateString()}
				</p>
			)}
			{amount && (
				<div className="mt-3 mb-5 px-1 w-full">
					<div className="bg-gray-400 h-[12px] my-1 rounded-lg w-full">
						<div
							className={`${
								ratio < 0.5 ? "bg-primary-500" : ratio < 0.75 ? "bg-yellow-600" : "bg-red-600"
							} ${ratio > 0.95 ? "rounded-lg" : ""} duration-1000 h-[11px] rounded-l-lg transform transition-all`}
							style={{ width: `${ratio * 100}%` }}
						/>
					</div>
				</div>
			)}
			<div className={`gap-4 grid grid-cols-2 ${amount ? "px-2" : "px-1 mt-3"} md:gap-5 w-full`}>
				{amount && (
					<>
						<div>
							<Button 
								bg="bg-blue-50 hover:bg-blue-200"
								border="border border-blue-500"
								caps
								color="text-blue-700"
								focus="focus:ring-1 focus:ring-offset-1 focus:ring-blue-100"
								IconLeft={FaPen}
								onClick={() => updateBudget({
									id,
									name: toCapitalize(name),
									amount,
									start_date,
									end_date
								})}
								rounded="rounded-lg"
								title="Edit" 
							/>
						</div>
						<div>
							<Button 
								bg="bg-red-100 hover:bg-red-200"
								border="border border-red-500"
								caps
								color="text-red-500"
								focus="focus:ring-1 focus:ring-offset-1 focus:ring-red-100"
								onClick={handleDelete}
								IconLeft={FaTrash}
								rounded="rounded-lg"
								title="delete" 
							/>
						</div>
					<div>
						<Button 
							bg="bg-gray-100 hover:bg-gray-200"
							border="border border-gray-600"
							caps
							color="text-gray-600"
							focus="focus:ring-1 focus:ring-offset-1 focus:ring-gray-200"
							link={BUDGET_DETAIL_PAGE_URL(id)}
							IconLeft={FaEye}
							rounded="rounded-lg"
							title="details" 
						/>
					</div>
					</>
				)}
				<div>
					<Button 
						bg="bg-green-100 hover:bg-green-200"
						border="border border-green-600"
						caps
						color="text-green-600"
						focus="focus:ring-1 focus:ring-offset-1 focus:ring-green-200"
						link={BUDGET_EXPENSES_PAGE_URL(id)}
						IconLeft={FaEye}
						rounded="rounded-lg"
						title="Expenses" 
					/>
				</div>
			</div>
			{loading && <LoadingPage className="absolute rounded-lg" />}
		</div>
	)
}

export default Card;