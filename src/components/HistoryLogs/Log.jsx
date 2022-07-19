import { Button } from "../controls";

const Log = ({ id, timestamp, isLoading, type, message, deleteLog }) => {

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
							onClick={() => deleteLog(id)}
							title="Delete"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Log;
