import { Cards, Top } from "../components/Home";
import { BudgetCard } from "../components/Budgets";


const Dashboard = () => (
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
				<div>
					<BudgetCard />
				</div>
				<div>
					<BudgetCard />
				</div>
				<div>
					<BudgetCard />
				</div>
			</div>
		</div>
	</div>
);

export default Dashboard;
