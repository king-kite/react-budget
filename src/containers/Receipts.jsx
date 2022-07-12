import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { open } from "../store/features/alert-slice";
import {
	useGetReceiptsQuery,
	useAddReceiptMutation,
	useEditReceiptMutation,
} from "../store/features/receipts-api-slice";
import { useLoadingContext } from "../contexts"
import { Button } from "../components/controls";
import { Modal } from "../components/common";
import { ReceiptCard, ReceiptForm } from "../components/Receipts";
import { toCapitalize } from "../utils";

const Receipts = () => {
	const dispatch = useDispatch();
	
	const { data: receipts, isLoading } = useGetReceiptsQuery();

	const [
		addReceipt,
		{ status: addStatus, isLoading: addLoading, error: addError },
	] = useAddReceiptMutation();
	const [
		editReceipt,
		{ status: editStatus, isLoading: editLoading, error: editError },
	] = useEditReceiptMutation();

	const { openLoader, closeLoader }  = useLoadingContext()

	const [editMode, setEditMode] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const [data, setData] = useState({});
	const [errors, setErrors] = useState({});

	const handleChange = useCallback(({ target: { files, type, name, value } }) => {
		setData((prevState) => ({
			...prevState,
			[name]: type === "file" ? files[0] : value,
		}));

		setErrors((prevState) => ({
			...prevState,
			[name]: "",
		}));
	}, []);

	const handleAddReceipt = useCallback((value) => {
		if (value.document) {
			const documentUrl = URL.createObjectURL(new Blob([value.document], { type: '*' }))
			Object.assign(value, {file: documentUrl, document: undefined})	
		}
		addReceipt(value)
	}, [addReceipt])

	const handleUpdateReceipt = useCallback((value) => {
		const receipt = receipts.find(data => data.id === value.id)
		if (receipt) {
			if (value.document) {
				const documentUrl = URL.createObjectURL(new Blob([value.document], { type: '*' }))
				Object.assign(value, {file: documentUrl, document: undefined})	
			}
			editReceipt(value)
		} else {
			setModalVisible(false)
			setEditMode(false)
			setData({})
			dispatch(open({
				type: "danger", 
				message: `Receipt with ID ${value.id} was not found`
			}))
		} 
	}, [editReceipt, receipts, dispatch])

	useEffect(() => {
		if (isLoading) openLoader();
		else closeLoader();
	}, [isLoading]);

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
			console.log("ADD RECEIPT ERROR :>> ", addError);
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
			console.log("EDIT RECEIPT ERROR :>> ", editError);
		}
	}, [editStatus, editError]);

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
					<div>
						<Button
							bg="bg-primary-600 hover:bg-primary-500"
							caps
							iconSize="text-sm sm:text-base md:text-lg"
							IconLeft={FaPlus}
							onClick={() => {
								setEditMode(false)
								setData({})
								setModalVisible(true)
							}}
							padding="px-4 py-3"
							rounded="rounded-lg"
							title="add receipt"
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
						loading={editMode ? editLoading : addLoading}
						onChange={handleChange}
						onSubmit={editMode ? handleUpdateReceipt : handleAddReceipt}
						onReset={() =>
							setData((prevState) => ({
								...prevState,
								document: undefined,
								description: "",
								amount: "",
								date: "",
								title: ""
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
