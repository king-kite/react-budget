import { useCallback, useEffect, useRef, useState } from "react"
import { FaCheckCircle, FaEraser } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { open } from "../../store/features/alert-slice"
import { useUpdatePasswordMutation } from "../../store/features/auth-api-slice"
import { Button, Input } from "../controls"

const Form = ({ onSuccess }) => {
	const [errors, setErrors] = useState({})

	const dispatch = useDispatch()

	const passwordRef = useRef()

	const [updatePassword, { isLoading, status, error }] = useUpdatePasswordMutation()

	const handleSubmit = useCallback((password) => {
		updatePassword(password)
	}, [updatePassword])

	useEffect(() => {
		if (status === "fulfilled") {
			dispatch(open({
				type: "success",
				message: "Password updated successfully"
			}))
			onSuccess()
		} else if (status === "rejected" && error) {
			setErrors(prevState => ({
				...prevState,
				password: String(error.detail)
			}))
		}
	}, [status, error])

	return (
		<form 
			onSubmit={(e) => {
				e.preventDefault()
				if (passwordRef.current?.value.trim().length >= 6) {
					handleSubmit(passwordRef.current?.value.trim())	
				} else {
					setErrors(prevState => ({
						...prevState,
						password: "Password must be at least 6 characters with no white spaces!"
					}))
				}
			}} 
			className="p-4 lg:px-2"
		>
			<div className="w-full md:flex md:flex-wrap md:items-baseline">
				<div className="mb-4 md:px-2 w-full lg:mb-5 lg:px-4">
					<Input
						bdrColor="border-gray-300"
						disabled={isLoading}
						error={errors?.password}
						label="New Password"
						labelColor="text-gray-500"
						labelSize="text-sm tracking-wider md:text-base"
						name="password"
						ref={passwordRef}
						onChange={() => {
							if (errors?.password) setErrors(prevState => ({ ...prevState, password: "" }))
						}}
						padding="px-4 py-3"
						placeholder="Enter New Password"
						type="password"
						rounded="rounded-xl"
						textSize="text-sm md:text-base"
					/>
				</div>
			</div>
			<div className="flex flex-wrap items-center justify-betwee max-w-xs p-2 sm:max-w-sm">
				<div className="py-2 w-full sm:px-2 sm:w-1/2">
					<Button 
						bg="bg-red-600 hover:bg-red-500"
						caps
						disabled={isLoading}
						focus="focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
						iconSize="text-sm sm:text-base md:text-lg"
						IconLeft={FaEraser}
						onClick={() => {
							passwordRef.current.value = ""
						}}
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
						disabled={isLoading}
						focus="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						iconSize="text-sm sm:text-base md:text-lg"
						IconLeft={FaCheckCircle}
						padding="px-4 py-3"
						loading={isLoading}
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
}

export default Form;