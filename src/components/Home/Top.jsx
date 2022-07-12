import { BiRefresh } from "react-icons/bi"
import { Button } from "../controls";

const Top = ({ onRefresh }) => (
	<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
		<div className="my-2">
			<h3 className="top-heading">
				dashboard
			</h3>
			<p className="top-description">
				A complete overview of your budgets, income and expenses.
			</p>
		</div>
		<div className="flex items-center justify-center my-2">
			<div>
				<Button 
					bg="bg-primary-600 hover:bg-primary-500"
					caps
					focus="focus:ring-2 focus:ring-offset-1 focus:ring-primary-300"
					iconSize="text-sm sm:text-base md:text-lg"
					IconLeft={BiRefresh}
					onClick={onRefresh}
					padding="px-4 py-3"
					rounded="rounded-full"
					title="refresh dashboard"
				/>
			</div>
		</div>
	</div>
)

export default Top;