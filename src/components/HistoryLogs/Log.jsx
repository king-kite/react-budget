import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux"
import { open } from "../../store/features/alert-slice";
import { useDeleteLogMutation } from "../../store/features/logs-api-slice";
import { Button } from "../controls";

const Log = ({ id, timestamp, type, message }) => {
	const [deleteLog, { status, isLoading }] = useDeleteLogMutation();
	const dispatch = useDispatch();

	const handleDelete = useCallback(() => {
		const _delete = window.confirm("Are you sure you want to delete this log?");
		if (_delete === true) deleteLog(id);
	}, [deleteLog, id])

	useEffect(() => {
		if (status === "fulfilled" || status === "rejected") {
			dispatch(
				open({
					type: status === "fulfilled" ? "success" : "danger",
					message:
						status === "fulfilled"
							? "Log Deleted Successfully"
							: "Failed to Log",
				})
			);
		}
	}, [dispatch, status]);

	const borderColor =
		type === "delete"
			? "border-red-600"
			: type === "create"
			? "border-green-600"
			: type === "update"
			? "border-blue-600"
			: "border-gray-600";

	return (
		<div
			className={`${borderColor} bg-white border-2 border-[ridge] flex items-start mb-3 p-2 rounded-md shadow-lg`}
		>
			<div className="flex flex-col items-center h-full">
				<div
					className={`${borderColor} border-2 h-[0.6rem] m-1 rounded-full w-[0.6rem]`}
				/>
			</div>
			<div className="flex flex-col mx-2 w-full md:flex-row md:justify-between">
				<div>
					<h6 className="capitalize font-medium mb-1 text-gray-400 text-xs md:text-sm">
						{timestamp}
					</h6>
					<p className="font-medium my-1 text-gray-500 text-xs md:text-sm">
						{message}
					</p>
				</div>
				<div className="flex items-center mt-2 md:mt-0">
					<div className="mx-2 sm:mx-3 md:mx-4">
						<Button
							bg="bg-red-500 hover:bg-red-600"
							bold="normal"
							caps
							disabled={isLoading}
							onClick={handleDelete}
							title="Delete"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Log;
