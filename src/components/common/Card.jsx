import { 
	FaThLarge, FaBookOpen, FaCog, FaChartBar
} from "react-icons/fa"

const CardIcon = ({ Icon, bg, color }) => (
	<div className={`${bg || "bg-green-100"} p-2 rounded-full`}>
		<Icon className={`${color || "text-green-500"} text-base md:text-lg`} />
	</div>
)

const Card = ({ Icon, iconBg, iconColor, title, value }) => (
	<section
		className="bg-white px-4 py-3 relative rounded-xl shadow-lg w-full"
	>
		<div className="flex justify-between items-center w-full">
			{Icon && (
				<CardIcon Icon={Icon} bg={iconBg} color={iconColor} />
			)}
			<div className={Icon ? "pl-3 w-full" : " w-full"}>
				<h1 className="font-semibold my-1 text-gray-800 text-3xl sm:text-4xl lg:text-5xl">
					{value}
				</h1>
				<p className="capitalize font-medium my-1 px-1 text-gray-600 text-base tracking-wider sm:text-lg">
					{title}
				</p>
			</div>
		</div>
	</section>
);

export default Card;

