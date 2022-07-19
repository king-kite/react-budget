import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux"
import { BiRefresh } from "react-icons/bi"
import { FaBook, FaTrash } from "react-icons/fa"
import { open } from "../store/features/alert-slice"
import { useGetLogsQuery, useDeleteLogMutation, useDeleteAllLogsMutation } from "../store/features/logs-api-slice";
import { useLoadingContext } from "../contexts"
import { Log } from "../components/HistoryLogs";
import { Button } from "../components/controls"

const Logs = () => {
	const { data:logs, isFetching, error, refetch } = useGetLogsQuery()

	const [deleteLog, { isLoading: deleteLoading, error: deleteError, status: deleteStatus }] = useDeleteLogMutation();
	const [deleteAllLogs, {isLoading: deleteAllLoading, error: deleteAllError, status}] = useDeleteAllLogsMutation()

	const { openLoader, closeLoader } = useLoadingContext();

	const dispatch = useDispatch()

	const handleDeleteLogs = useCallback(() => {
		const _delete = window.confirm("Are you sure you want to delete all logs?");
		if (_delete === true) deleteAllLogs();
	}, [deleteAllLogs])

	const handleDeleteLog = useCallback((id) => {
		const _delete = window.confirm("Are you sure you want to delete this log?");
		if (_delete === true) deleteLog(id);
	}, [deleteLog])

	useEffect(() => {
		if (isFetching || deleteAllLoading || deleteLoading) openLoader()
		else closeLoader()
	}, [isFetching, deleteAllLoading, deleteLoading])

	useEffect(() => {
		if (error) {
			dispatch(open({
				type: "danger",
				message: String(error.detail)
			}))
		}
	}, [error])

	useEffect(() => {
		if (status === "fulfilled") {
			dispatch(open({
				type: "success",
				message: "Logs were deleted successfully"
			}))
		} else if (status === "rejected" && deleteAllError) {
			dispatch(open({
				type: "danger",
				message: String(deleteAllError.detail)
			}))
		}
	}, [status, error])

	useEffect(() => {
		if (deleteStatus === "fulfilled") {
			dispatch(open({
				type: "success",
				message: "Log was deleted successfully"
			}))
		} else if (deleteStatus === "rejected" && deleteError) {
			dispatch(open({
				type: "danger",
				message: String(deleteError.detail)
			}))
		}
	}, [deleteStatus, deleteError])

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
							disabled={isFetching || deleteAllLoading}
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
							disabled={isFetching || deleteAllLoading}
							loader
							loading={deleteAllLoading}
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
					{logs.map((log, index) => <Log key={index} {...log} isLoading={deleteLoading || deleteAllLoading} deleteLog={handleDeleteLog} />)}
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
