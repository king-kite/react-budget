import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBudgets } from "../store/features/budgets-slice";
import { Cards, Top } from "../components/Home";
import { BudgetCard } from "../components/Budgets";
import { LoadingPage } from "../utils"

const Dashboard = () => {
	const [loading, setLoading] = useState(false)

	const dispatch  = useDispatch()
	const budgets = useSelector(state => state.budgets.data)

	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			const budgets = localStorage.getItem("budgets");
			if (budgets !== null) {
				dispatch(setBudgets(JSON.parse(budgets)));
			}
			setLoading(false);
		}, 2000);
	}, [dispatch]);

	return (
		<div>		
			<Top />
			<Cards />
			<div>
				<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="my-2">
						<h3 className="top-heading">
							Latest Budgets
						</h3>
						<p className="top-description">
							Take a look at your lateset budgets and how your fair.
						</p>
					</div>
				</div>
				<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:gap-8">
					{budgets.slice(0, 3).map((budget, index) => (
						<div key={index}>
							<BudgetCard {...budget} />
						</div>
					))}
				</div>
			</div>
			{loading & <LoadingPage />}
		</div>
	);
}

export default Dashboard;
