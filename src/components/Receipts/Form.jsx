import { FaCheckCircle, FaEraser, FaCloudUploadAlt } from "react-icons/fa"
import { Button, File, Input, Textarea } from "../controls"
import { toCapitalize } from "../../utils"

const Form = ({ data, errors, loading, onChange, onSubmit, onReset, editMode, }) => (
	<form 
		onSubmit={(e) => {
			e.preventDefault()
			onSubmit({
				...data,
				title: data.title.toLowerCase(),
			})
		}} 
		className="p-4 lg:px-2"
	>
		<div className="w-full md:flex md:flex-wrap md:items-baseline">
			<div className="mb-4 md:px-2 w-full md:w-1/2 lg:mb-5 lg:px-4">
				<div className="max-w-[15rem]">
					<div className="w-full">
						<File 
							accept=".doc,.docx,.pdf,image/*"
							bg="bg-primary-600 hover:bg-primary-500"
							bdrColor="border-primary-600 hover:border-primary-500"
							disabled={loading}
							error={errors?.document}
							Icon={FaCloudUploadAlt}
							label="Receipt Document"
							labelColor="text-gray-500"
							labelSize="text-sm tracking-wider md:text-base"
							onChange={onChange}
							required={!editMode}
							name="document"
							placeholder="Upload Receipt Document"
							padding="px-4 py-3"
							rounded="rounded-full"
							value={data.document && data.document?.name ? String(data.document.name) : undefined}
						/>
					</div>
				</div>
			</div>
			<div className="mb-4 md:px-2 w-full lg:mb-5 lg:px-4">
				<Input
					bdrColor="border-gray-300"
					disabled={loading}
					error={errors?.title}
					label="Title Of the Receipt"
					labelColor="text-gray-500"
					labelSize="text-sm tracking-wider md:text-base"
					onChange={onChange}
					name="title"
					padding="px-4 py-3"
					placeholder="Enter title of the receipt"
					rounded="rounded-xl"
					textSize="text-sm md:text-base"
					value={data.title || ""}
				/>
			</div>
			<div className="mb-4 md:px-2 md:w-1/2 lg:mb-5 lg:px-4">
				<Input
					bdrColor="border-gray-300"
					disabled={loading}
					error={errors?.amount}
					label="Amount on Receipt"
					labelColor="text-gray-500"
					labelSize="text-sm tracking-wider md:text-base"
					onChange={onChange}
					name="amount"
					padding="px-4 py-3"
					placeholder="Enter the Amount on the Receipt"
					rounded="rounded-xl"
					textSize="text-sm md:text-base"
					type="number"
					min={1}
					step={0.1}
					value={data.amount || ""}
				/>
			</div>
			<div className="mb-4 md:px-2 md:w-1/2 lg:mb-5 lg:px-4">
				<Input
					bdrColor="border-gray-300"
					disabled={loading}
					error={errors?.date}
					label="Date"
					labelColor="text-gray-500"
					labelSize="text-sm tracking-wider md:text-base"
					onChange={onChange}
					name="date"
					padding="px-4 py-3"
					placeholder="Enter Date"
					rounded="rounded-xl"
					textSize="text-sm md:text-base"
					type="date"
					value={data.date || ""}
				/>
			</div>
			<div className="mb-4 w-full md:px-2 lg:mb-5 lg:px-4">
				<Textarea
					bdrColor="border-gray-300"
					disabled={loading}
					error={errors?.description}
					label="Description"
					labelColor="text-gray-500"
					labelSize="text-sm tracking-wider md:text-base"
					onChange={onChange}
					name="description"
					placeholder="Enter Receipt Description"
					rounded="rounded-xl"
					style={{ height: "60px" }}
					textSize="text-sm md:text-base"
					value={data.description || ""}
				/>
			</div>
		</div>
		<div className="flex flex-wrap items-center justify-betwee max-w-xs p-2 sm:max-w-sm">
			<div className="py-2 w-full sm:px-2 sm:w-1/2">
				<Button 
					bg="bg-red-600 hover:bg-red-500"
					caps
					disabled={loading}
					focus="focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
					iconSize="text-sm sm:text-base md:text-lg"
					IconLeft={FaEraser}
					onClick={onReset}
					padding="px-4 py-3"
					rounded="rounded-full"
					type="button"
					title="clear" 
					titleSize="text-sm md:text-base"
				/>
			</div>
			<div className="py-2 w-full sm:px-2 sm:w-1/2">
				<Button 
					bg="bg-indigo-600 hover:bg-indigo-500"
					caps
					disabled={loading}
					focus="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					iconSize="text-sm sm:text-base md:text-lg"
					IconLeft={FaCheckCircle}
					padding="px-4 py-3"
					loading={loading}
					loader
					rounded="rounded-full"
					type="submit"
					title="submit" 
					titleSize="text-sm md:text-base"
				/>
			</div>
		</div>
	</form>
)

export default Form;