import { FaCheckCircle, FaEraser } from "react-icons/fa"
import { Button, Input, Textarea } from "../controls"
import { toCapitalize } from "../../utils"

const Form = ({ data, errors, loading, onChange, onSubmit, onReset }) => (
	<form 
		onSubmit={(e) => {
			e.preventDefault()
			onSubmit({
				...data,
				name: data.name.toLowerCase(),
			})
		}} 
		className="p-4 lg:px-2"
	>
		<div className="w-full md:flex md:flex-wrap">
			<div className="mb-4 md:px-2 md:w-1/2 lg:mb-5 lg:px-4">
				<Input
					bdrColor="border-gray-300"
					disabled={loading}
					error={errors?.name}
					label="Name Of Goal"
					labelColor="text-gray-500"
					labelSize="text-sm tracking-wider md:text-base"
					onChange={onChange}
					name="name"
					padding="px-4 py-3"
					placeholder="Enter Name Of Goal"
					rounded="rounded-xl"
					textSize="text-sm md:text-base"
					value={data.name || ""}
				/>
			</div>
			<div className="mb-4 md:px-2 md:w-1/2 lg:mb-5 lg:px-4">
				<Input
					bdrColor="border-gray-300"
					disabled={loading}
					error={errors?.amount}
					label="Goal Amount"
					labelColor="text-gray-500"
					labelSize="text-sm tracking-wider md:text-base"
					onChange={onChange}
					name="amount"
					padding="px-4 py-3"
					placeholder="Enter Goal Amount"
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
					error={errors?.start_date}
					label="Start Date"
					labelColor="text-gray-500"
					labelSize="text-sm tracking-wider md:text-base"
					onChange={onChange}
					name="start_date"
					padding="px-4 py-3"
					placeholder="Enter Goal Start Date"
					rounded="rounded-xl"
					textSize="text-sm md:text-base"
					type="date"
					value={data.start_date || ""}
				/>
			</div>
			<div className="mb-4 md:px-2 md:w-1/2 lg:mb-5 lg:px-4">
				<Input
					bdrColor="border-gray-300"
					disabled={loading}
					error={errors?.end_date}
					label="End Date"
					labelColor="text-gray-500"
					labelSize="text-sm tracking-wider md:text-base"
					onChange={onChange}
					name="end_date"
					padding="px-4 py-3"
					placeholder="Enter Goal End Date"
					rounded="rounded-xl"
					textSize="text-sm md:text-base"
					type="date"
					value={data.end_date || ""}
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
					placeholder="Enter Goal Description"
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