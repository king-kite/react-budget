import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { FaPen, FaTrash } from "react-icons/fa";
import { open } from "../../store/features/alert-slice"
import { deleteExpense } from "../../store/features/expenses-slice";
import { Button } from "../controls"
import { currencyFormatter, LoadingPage, toCapitalize } from "../../utils";

const ExpenseCard = ({
	amount,
	bg = "bg-white",
	id,
	budgetId,
	budgetName,
	date,
	description,
	title,
	updateExpense,
}) => {
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	const handleDelete = useCallback(() => {
		const _delete = window.confirm(
			`Are you sure you want to delete the ${toCapitalize(
				title
			)} Expense?`
		);
		if (_delete === true) {
			setLoading(true);
			setTimeout(() => {
				dispatch(deleteExpense(id));
				dispatch(open({
					type: 'success',
					message: `${toCapitalize(title)} Expense was deleted successfully`
				}))
				setLoading(false);
			}, 2000);
		}
	}, [dispatch, id, title]);

	return (
		<div
			className={`${bg} border border-gray-400 p-4 relative rounded-lg shadow-lg`}
		>
			<div className="flex items-baseline justify-between">
				<h4 className="capitalize font-medium text-base text-gray-500 md:text-lg">
					{title}
				</h4>
				<div className="font-medium flex items-baseline text-base text-gray-500 tracking-wider md:text-lg lg:text-xl">
					{currencyFormatter.format(amount)}
				</div>
			</div>
			<p className="capitalize font-semibold my-1 text-gray-500 text-sm md:text-base">
				{budgetName}
			</p>
			<p className="capitalize font-semibold my-1 text-gray-500 text-sm md:text-base">
				{new Date(date).toDateString()}
			</p>
			<span className="capitalize text-gray-400 underline text-sm">
				description
			</span>
			<p className="my-1 text-gray-500 text-sm md:text-base">{description}</p>

			<div className="gap-4 grid grid-cols-2 pt-3 md:gap-5 w-full">
				<div>
					<Button
						bg="bg-blue-50 hover:bg-blue-200"
						border="border border-blue-500"
						caps
						color="text-blue-700"
						focus="focus:ring-1 focus:ring-offset-1 focus:ring-blue-100"
						IconLeft={FaPen}
						onClick={() =>
							updateExpense({
								id,
								title: toCapitalize(title),
								budgetId,
								date,
								description,
								amount,
							})
						}
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
			</div>
			{loading && <LoadingPage className="absolute rounded-lg" />}
		</div>
	);
};

export default ExpenseCard;