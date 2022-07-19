import { useCallback, useEffect, useRef, useState } from "react"
import { FaCheckCircle, FaEraser, FaCloudUploadAlt } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { uploadFile } from "../../store/firebase/utils"
import { open } from "../../store/features/alert-slice"
import { useUpdateProfileMutation } from "../../store/features/auth-api-slice"
import { Button, File, Input } from "../controls"

function getExtension(name) {
	const arr = name.trim().split(".")
	const extension = arr[arr.length - 1].toLowerCase()
	return "." + extension.trim()
}

const Form = ({ displayName, email, onSuccess }) => {
	const [errors, setErrors] = useState({})

	const [imageName, setImageName] = useState(undefined)
	const [imageUploading, setImageUploading] = useState(false)

	const dispatch = useDispatch()

	const imageRef = useRef()
	const displayNameRef = useRef()

	useEffect(() => {
		if (displayName && displayNameRef.current) displayNameRef.current.value = displayName
	}, [])

	const [updateProfile, { isLoading, status, error }] = useUpdateProfileMutation()

	const handleImageReset = useCallback(() => {
		imageRef.current.value = ""
		setImageName(undefined)
	}, [])

	const handleSubmit = useCallback((data) => {
		if (data.image) {
			setImageUploading(true)
			const path =
				"users/" +
				email +
				"/" + "display_photo" +
				getExtension(data.image.name.trim());
			uploadFile({
				file: data.image,
				path,
				onSuccess: (fileURL) => {
					updateProfile({
						displayName: data.displayName,
						photoURL: fileURL
					});
					setImageUploading(false);
				},
				onError: (error) => {
					setErrors(prevState => ({
						...prevState,
						image: String(error.detail || "An error occurred when uploading the image.")
					}))
					setImageUploading(false);
				},
			});
		} else {
			updateProfile({ displayName: data.displayName })
		}
	}, [updateProfile, email])

	useEffect(() => {
		if (status === "fulfilled") {
			dispatch(open({
				type: "success",
				message: "Profile updated successfully"
			}))
			onSuccess()
			handleImageReset()
		} else if (status === "rejected" && error) {
			dispatch(open({
				message: String(error.detail),
				type: "danger"
			}))
		}
	}, [status, error])

	return (
		<form 
			onSubmit={(e) => {
				e.preventDefault()
				handleSubmit({
					image: imageRef.current?.files ? imageRef.current.files[0] : undefined,
					displayName: displayNameRef.current?.value
				})
			}} 
			className="p-4 lg:px-2"
		>
			<div className="w-full md:flex md:flex-wrap md:items-baseline">
				<div className="mb-4 md:px-2 w-full md:w-1/2 lg:mb-5 lg:px-4">
					<div className="max-w-[15rem]">
						<div className="w-full">
							<File 
								accept="image/*"
								bg="bg-primary-600 hover:bg-primary-500"
								bdrColor="border-primary-600 hover:border-primary-500"
								disabled={imageUploading || isLoading}
								error={errors?.image}
								Icon={FaCloudUploadAlt}
								ref={imageRef}
								onChange={(e) => {
									const files = e.target.files
									if (files[0]) setImageName(files[0].name)
									else setImageName(undefined)
									if (errors?.image) setErrors(prevState => ({ ...prevState, image: "" }))
								}}
								label="Display Photo"
								labelColor="text-gray-500"
								labelSize="text-sm tracking-wider md:text-base"
								required={false}
								name="image"
								placeholder="Upload Display Photo"
								padding="px-4 py-3"
								rounded="rounded-full"
								value={imageName}
							/>
						</div>
					</div>
				</div>
				<div className="mb-4 md:px-2 w-full lg:mb-5 lg:px-4">
					<Input
						bdrColor="border-gray-300"
						disabled={imageUploading || isLoading}
						error={errors?.displayName}
						label="Display Name"
						labelColor="text-gray-500"
						labelSize="text-sm tracking-wider md:text-base"
						name="displayName"
						ref={displayNameRef}
						padding="px-4 py-3"
						placeholder="Enter Display Name"
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
						disabled={imageUploading || isLoading}
						focus="focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
						iconSize="text-sm sm:text-base md:text-lg"
						IconLeft={FaEraser}
						onClick={() => {
							handleImageReset()
							displayNameRef.current.value = ""
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
						disabled={imageUploading || isLoading}
						focus="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						iconSize="text-sm sm:text-base md:text-lg"
						IconLeft={FaCheckCircle}
						padding="px-4 py-3"
						loading={imageUploading || isLoading}
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