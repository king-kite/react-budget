import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux"
import { BiRefresh } from "react-icons/bi"
import { FaBook, FaTrash } from "react-icons/fa"
import { open } from "../store/features/alert-slice"
import { useGetLogsQuery, useDeleteAllLogsMutation } from "../store/features/logs-api-slice";
import { useLoadingContext } from "../contexts"
import { Log } from "../components/Logs";
import { Button } from "../components/controls"

const Logs = () => {
	const { data:logs, isLoading, isFetching, refetch } = useGetLogsQuery()

	const [deleteAllLogs, {isLoading: deleteLoading, error, status}] = useDeleteAllLogsMutation()

	const { openLoader, closeLoader } = useLoadingContext();

	const dispatch = useDispatch()

	const handleDeleteLogs = useCallback(() => {
		const _delete = window.confirm("Are you sure you want to delete all logs?");
		if (_delete === true) deleteAllLogs();
	}, [deleteAllLogs])

	useEffect(() => {
		if (isLoading || deleteLoading) openLoader()
		else closeLoader()
	}, [isLoading, deleteLoading])

	useEffect(() => {
		if (status === "fulfilled") {
			dispatch(open({
				type: "success",
				message: "Logs were deleted successfully"
			}))
		} else if (status === "rejected") {
			console.log("DELETE ALL LOGS ERROR :>> ", error)
		}
	}, [status, error])

	return (
		<div>
			<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="my-2">
					<h3 className="top-heading">History Log</h3>
					<p className="top-description">
						A complete overview of all your actions.
					</p>
				</div>
				<div className="flex items-center justify-center my-2">
					<div className="mr-1">
						<Button 
							bg="bg-primary-600 hover:bg-primary-500"
							caps
							disabled={isFetching || deleteLoading}
							loader
							loading={isFetching}
							focus="focus:ring-2 focus:ring-offset-1 focus:ring-primary-300"
							iconSize="text-sm sm:text-base md:text-lg"
							IconLeft={BiRefresh}
							onClick={refetch}
							padding="px-4 py-3"
							rounded="rounded-full"
							title="refresh logs"
						/>
					</div>
					<div className="mx-1">
						<Button 
							bg="bg-red-600 hover:bg-red-500"
							caps
							disabled={isFetching || deleteLoading}
							loader
							loading={deleteLoading}
							focus="focus:ring-2 focus:ring-offset-1 focus:ring-red-300"
							iconSize="text-sm"
							IconLeft={FaTrash}
							onClick={handleDeleteLogs}
							padding="px-4 py-3"
							rounded="rounded-full"
							title="delete all logs"
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
						There are currently no logs.
					</p>
				</div>
				)}
		</div>
	);
};

export default Logs;
