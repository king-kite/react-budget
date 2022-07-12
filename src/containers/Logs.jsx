import { useEffect } from "react";
import { BiRefresh } from "react-icons/bi"
import { FaBook } from "react-icons/fa"
import { useGetLogsQuery } from "../store/features/logs-api-slice";
import { useLoadingContext } from "../contexts"
import { Log } from "../components/Logs";
import { Button } from "../components/controls"

const Logs = () => {
	const { data:logs, isLoading, refetch } = useGetLogsQuery()

	const { openLoader, closeLoader } = useLoadingContext();

	useEffect(() => {
		if (isLoading) openLoader()
		else closeLoader()
	}, [isLoading])

	return (
		<div>
			
				<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="my-2">
						<h3 className="top-heading">History Logs</h3>
						<p className="top-description">
							A complete overview of all your actions.
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
								onClick={refetch}
								padding="px-4 py-3"
								rounded="rounded-full"
								title="refresh logs"
							/>
						</div>
					</div>
				</div>

				{logs && logs.length > 0 ? (
					<div className="bg-gray-200 h-full max-w-4xl mx-auto p-3 rounded-lg w-full sm:px-4 md:py-5 lg:py-8">
						{logs.map((log, index) => <Log key={index} {...log} />)}
					</div>
					): (
					<div className="flex flex-col justify-center items-center my-4 py-4 rounded-lg">
						<div className="my-4">
							<FaBook className="text-primary-600 text-6xl" />
						</div>
						<p className="top-description">
							There are currently no history logs.
						</p>
					</div>
					)}
		</div>
	);
};

export default Logs;
