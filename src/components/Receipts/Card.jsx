import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { FaCloudDownloadAlt, FaPen, FaTrash } from "react-icons/fa";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../store/firebase";
import { open } from "../../store/features/alert-slice";
import { Button } from "../controls";
import { currencyFormatter, toCapitalize } from "../../utils";

const Card = ({
	amount,
	bg = "bg-white",
	id,
	date,
	description,
	file,
	path,
	title,
	updateReceipt,
	deleteReceipt,
	showEditDeleteButton = true,
}) => {
	const dispatch = useDispatch();

	const handleDownload = useCallback(async () => {
		if (path) {
			getDownloadURL(ref(storage, path))
				.then((url) => {
					const link_url = window.URL.createObjectURL(new Blob([url]));
					const link = document.createElement("a");
					link.href = link_url;
					link.setAttribute("download", title);
					document.body.appendChild(link);
					link.click();
				})
				.catch((error) => {
					dispatch(
						open({
							type: "danger",
							message:
								error?.code ||
								error?.message ||
								"A server error occurred. Unable to download receipt document.",
						})
					);
				});
		} else {
			dispatch(
				open({
					type: "danger",
					message:
						"Unable to download receipt document. Path to document does not exist!",
				})
			);
		}
	}, [path]);

	return (
		<div
			className={`${bg} border border-gray-400 flex flex-col justify-between h-full p-4 relative rounded-lg shadow-lg w-full`}
		>
			<div>
				<div className="flex items-baseline justify-between">
					<h4 className="capitalize font-medium text-base text-gray-500 md:text-lg">
						{title}
					</h4>
					<div className="font-medium flex items-baseline text-base text-gray-500 tracking-wider md:text-lg lg:text-xl">
						{currencyFormatter.format(amount)}
					</div>
				</div>
				{date && (
					<p className="capitalize font-medium px-1 text-gray-500 text-sm md:text-base">
						{new Date(date).toDateString()}
					</p>
				)}
				<span className="capitalize text-gray-400 underline text-sm">
					description
				</span>
				<p className="my-1 text-gray-500 text-sm md:text-base">{description}</p>
			</div>

			<div className="gap-4 grid grid-cols-2 pt-3 md:gap-5 w-full">
				{showEditDeleteButton && (
					<>
						<div>
							<Button
								bg="bg-blue-50 hover:bg-blue-200"
								border="border border-blue-500"
								caps
								color="text-blue-700"
								focus="focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
								IconLeft={FaPen}
								onClick={() =>
									updateReceipt({
										id,
										title: toCapitalize(title),
										date: new Date(date).toLocaleDateString("en-CA"),
										description,
										amount,
									})
								}
								rounded="rounded-lg"
								title="Edit"
							/>
						</div>
						<div>
							<Button
								bg="bg-red-100 hover:bg-red-200"
								border="border border-red-500"
								caps
								color="text-red-500"
								focus="focus:ring-2 focus:ring-offset-2 focus:ring-red-200"
								onClick={() => deleteReceipt({ id, title })}
								IconLeft={FaTrash}
								rounded="rounded-lg"
								title="delete"
							/>
						</div>
					</>
				)}
				<div>
					<Button
						bg="bg-green-100 hover:bg-green-200"
						border="border border-green-500"
						caps
						color="text-green-500"
						focus="focus:ring-2 focus:ring-offset-2 focus:ring-green-200"
						onClick={handleDownload}
						IconLeft={FaCloudDownloadAlt}
						rounded="rounded-lg"
						title="download"
					/>
				</div>
			</div>
		</div>
	);
};

export default Card;
