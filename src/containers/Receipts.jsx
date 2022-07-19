import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiRefresh } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { open } from "../store/features/alert-slice";
import {
	useGetReceiptsQuery,
	useAddReceiptMutation,
	useEditReceiptMutation,
	useDeleteReceiptMutation
} from "../store/features/receipts-api-slice";
import { auth } from "../store/firebase";
import { deleteFile, uploadFile } from "../store/firebase/utils";
import { useLoadingContext } from "../contexts";
import { Button } from "../components/controls";
import { Modal } from "../components/common";
import { ReceiptCard, ReceiptForm } from "../components/Receipts";
import { toCapitalize } from "../utils";

const buildPath = (path) => path.toLowerCase().replaceAll(" ", "-");

const Receipts = () => {
	const dispatch = useDispatch();

	const {
		data: receipts,
		error,
		refetch,
		isFetching: isLoading,
	} = useGetReceiptsQuery();

	const [
		addReceipt,
		{ status: addStatus, isLoading: addLoading, error: addError },
	] = useAddReceiptMutation();
	const [
		editReceipt,
		{ status: editStatus, isLoading: editLoading, error: editError },
	] = useEditReceiptMutation();
	const [
		deleteReceipt,
		{ status: deleteStatus, isLoading: deleteLoading, error: deleteError },
	] = useDeleteReceiptMutation();

	const { openLoader, closeLoader } = useLoadingContext();

	const [editMode, setEditMode] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const [data, setData] = useState({});
	const [errors, setErrors] = useState({});
	const [fileUploading, setFileUploading] = useState(false);

	const handleChange = useCallback(
		({ target: { files, type, name, value } }) => {
			setData((prevState) => ({
				...prevState,
				[name]: type === "file" ? files[0] : value,
			}));

			setErrors((prevState) => ({
				...prevState,
				[name]: "",
			}));
		},
		[]
	);

	const handleAddReceipt = useCallback(
		async (value) => {
			const user = await auth.currentUser;
			if (value.document && user) {
				setFileUploading(true);
				const path =
					"receipts/" +
					user.email +
					"/" +
					buildPath(value.title.trim() + " " + value.document.name.trim());
				uploadFile({
					file: value.document,
					path,
					onSuccess: (fileURL) => {
						delete value.document;
						Object.assign(value, { file: fileURL, path });
						addReceipt(value);
						setFileUploading(false);
					},
					onError: (error) => {
						setErrors((prevState) => ({
							...prevState,
							document: String(error.detail)
						}))
						setFileUploading(false);
					},
				});
			} else {
				setErrors((prevState) => ({
					...prevState,
					document: "Receipt Document is required!",
				}));
			}
		},
		[addReceipt]
	);

	const handleUpdateReceipt = useCallback(
		async (value) => {
			const receipt = receipts.find((data) => data.id === value.id);
			if (receipt) {
				const user = await auth.currentUser;
				if (value.document && user) {
					setFileUploading(true);
					const path =
						"receipts/" +
						user.email +
						"/" +
						buildPath(value.title.trim() + " " + value.document.name.trim());

					// Delete the old receipt file
					if (receipt?.path) {
						await deleteFile({
							path: receipt.path,
						});
					}

					// Upload the new receipt file
					uploadFile({
						file: value.document,
						path,
						onSuccess: (fileURL) => {
							delete value.document;
							Object.assign(value, { file: fileURL, path });
							editReceipt(value);
							setFileUploading(false);
						},
						onError: (error) => {
							setErrors(prevState => ({
								...prevState,
								document: String(error.detail)
							}))
							setFileUploading(false);
						},
					});
				} else {
					editReceipt(value);
				}
			} else {
				setModalVisible(false);
				setEditMode(false);
				setData({});
				dispatch(
					open({
						type: "danger",
						message: `Receipt with ID ${value.id} was not found`,
					})
				);
			}
		},
		[editReceipt, receipts, dispatch]
	);

	const handleDeleteReceipt = useCallback(({ id, title }) => {
		const _delete = window.confirm(
			`Are you sure you want to delete the ${toCapitalize(
				title
			)} Receipt?`
		);
		if (_delete === true) {
				deleteReceipt(id);
		}
	}, [deleteReceipt]);

	useEffect(() => {
		if (isLoading || deleteLoading) openLoader();
		else closeLoader();
	}, [isLoading, deleteLoading]);

	useEffect(() => {
		if (error) {
			dispatch(open({
				type: "danger",
				message: String(error.detail)
			}))
		}
	}, [error])

	useEffect(() => {
		if (addStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Receipt was added successfully!",
				})
			);
			setModalVisible(false);
			setData({});
		} else if (addStatus === "rejected" && addError) {
			dispatch(open({
				type: "danger",
				message: String(addError.detail)
			}))
		}
	}, [addStatus, addError]);

	useEffect(() => {
		if (editStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Receipt was updated successfully!",
				})
			);
			setModalVisible(false);
			setData({});
			setEditMode(false);
		} else if (editStatus === "rejected" && editError) {
			dispatch(open({
				type: "danger",
				message: String(editError.detail)
			}))
		}
	}, [editStatus, editError]);

	useEffect(() => {
		if (deleteStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Receipt was deleted successfully!",
				})
			);
		} else if (deleteStatus === "rejected" && deleteError) {
			dispatch(open({
				type: "danger",
				message: String(deleteError.detail)
			}))
		}
	}, [deleteStatus, deleteError]);

	return (
		<div>
			<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="my-2">
					<h3 className="top-heading">Receipts</h3>
					<p className="top-description">
						An overview of your all your Receipts.
					</p>
				</div>
				<div className="flex items-center justify-center my-2">
					<div className="mr-1 md:mx-2">
						<Button
							bg="bg-primary-600 hover:bg-primary-500"
							caps
							iconSize="text-sm sm:text-base md:text-lg"
							IconLeft={FaPlus}
							onClick={() => {
								setEditMode(false);
								setData({});
								setModalVisible(true);
							}}
							padding="px-4 py-3"
							rounded="rounded-lg"
							title="add receipt"
						/>
					</div>
					<div className="mx-1 md:mx-2">
						<Button
							bg="bg-primary-600 hover:bg-primary-500"
							caps
							iconSize="text-sm sm:text-base md:text-lg"
							IconLeft={BiRefresh}
							onClick={refetch}
							padding="px-4 py-3"
							rounded="rounded-lg"
							title="refresh"
						/>
					</div>
				</div>
			</div>
			{receipts && receipts.length > 0 ? (
				<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
					{receipts.map((receipt, index) => (
						<div key={index}>
							<ReceiptCard
								{...receipt}
								bg={(index + 1) % 2 === 0 ? "bg-white" : "bg-gray-100"}
								updateReceipt={(value) => {
									setData(value);
									setEditMode(true);
									setModalVisible(true);
								}}
								deleteReceipt={handleDeleteReceipt}
							/>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col justify-center items-center my-4 py-4 rounded-lg">
					<div className="my-4">
						<FaPlus className="text-primary-600 text-6xl" />
					</div>
					<p className="top-description">There are currently no receipts.</p>
					<p className="top-description">Add one now</p>
				</div>
			)}
			<Modal
				close={() => setModalVisible(false)}
				containerClass=""
				component={
					<ReceiptForm
						editMode={editMode}
						data={data}
						errors={errors}
						loading={
							fileUploading
								? fileUploading
								: editMode
								? editLoading
								: addLoading
						}
						onChange={handleChange}
						onSubmit={editMode ? handleUpdateReceipt : handleAddReceipt}
						onReset={() =>
							setData((prevState) => ({
								...prevState,
								document: undefined,
								description: "",
								amount: "",
								date: "",
								title: "",
							}))
						}
					/>
				}
				description={`Fill in the form below to ${
					editMode ? "update" : "add"
				} receipt...`}
				title={`${editMode ? "Update" : "Add"} Receipt`}
				visible={modalVisible}
			/>
		</div>
	);
};

export default Receipts;
