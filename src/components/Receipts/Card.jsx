import { FaCloudDownloadAlt, FaPen, FaTrash } from "react-icons/fa";
import { Button } from "../controls"
import { currencyFormatter, toCapitalize, downloadFile } from "../../utils";

const Card = ({
	amount,
	bg = "bg-white",
	id,
	date,
	description,
	file,
	title,
	updateReceipt,
	deleteReceipt,
	showEditDeleteButton=true
}) => (
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
									focus="focus:ring-1 focus:ring-offset-1 focus:ring-blue-100"
									IconLeft={FaPen}
									onClick={() =>
										updateReceipt({
											id,
											title: toCapitalize(title),
											date: new Date(date).toLocaleDateString('en-CA'),
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
									focus="focus:ring-1 focus:ring-offset-1 focus:ring-red-100"
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
							focus="focus:ring-1 focus:ring-offset-1 focus:ring-green-100"
							onClick={() => {
								downloadFile(file, title)
							}}
							IconLeft={FaCloudDownloadAlt}
							rounded="rounded-lg"
							title="download"
						/>
					</div>
				</div>
		</div>
	);

export default Card;
