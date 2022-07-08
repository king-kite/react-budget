import {
	FaCreditCard,
	FaUsers,
	FaDollarSign,
	FaChartBar,
} from "react-icons/fa";
import { Card } from "../common"

const cards = [
	{ Icon: FaCreditCard, iconBg: "bg-blue-100", iconColor: "text-blue-500", title: "spent so far", value: "0" },
	{ Icon: FaUsers, iconBg: "bg-green-100", iconColor: "text-green-500", title: "total income", value: "0" },
	{ Icon: FaDollarSign, iconBg: "bg-red-100", iconColor: "text-red-500", title: "total expenses", value: "0" },
	{ Icon: FaChartBar, iconBg: "bg-purple-100", iconColor: "text-purple-500", title: "total budget", value: "0" }
]

const Cards = () => (
	<div className="gap-4 grid grid-cols-1 my-4 md:gap-6 md:grid-cols-2 lg:gap-3 lg:grid-cols-4 lg:my-7">
		{cards.map((card, index) => (
			<Card key={index} {...card}/>
		))}
	</div>
)

export default Cards