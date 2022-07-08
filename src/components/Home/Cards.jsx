import {
	FaCreditCard,
	FaUsers,
	FaDollarSign,
	FaChartBar,
} from "react-icons/fa";
import { Card } from "../common"
import { currencyFormatter } from "../../utils"

const Cards = ({ budgets, budgetCount, expenses }) => {

	const cards = [
	{
		Icon: FaDollarSign,
		iconBg: "bg-red-100",
		iconColor: "text-red-500",
		title: "total expenses",
		value: expenses > 0 ? currencyFormatter.format(expenses) : 0,
	},
	{
		Icon: FaUsers,
		iconBg: "bg-green-100",
		iconColor: "text-green-500",
		title: "total income",
		value: "0",
	},
	{
		Icon: FaCreditCard,
		iconBg: "bg-blue-100",
		iconColor: "text-blue-500",
		title: "No. of budgets",
		value: budgetCount,
	},
	{
		Icon: FaChartBar,
		iconBg: "bg-purple-100",
		iconColor: "text-purple-500",
		title: "total budget",
		value: budgets > 0 ? currencyFormatter.format(budgets) : 0,
	},
];
	return (
		<div className="gap-4 grid grid-cols-1 my-4 md:gap-6 md:grid-cols-2 lg:gap-3 lg:grid-cols-4 lg:my-7">
			{cards.map((card, index) => (
				<Card key={index} {...card}/>
			))}
		</div>
	)
}

export default Cards