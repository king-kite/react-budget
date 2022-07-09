import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { open } from "../store/features/alert-slice";
import { setReceipts, addReceipt, updateReceipt } from "../store/features/receipts-slice";
import { Button } from "../components/controls";
import { Modal } from "../components/common";
import { ReceiptCard, ReceiptForm } from "../components/Receipts";
import { LoadingPage, toCapitalize } from "../utils";

const Receipts = () => {
	const dispatch = useDispatch();
	const receipts = useSelector((state) => state.receipts.data);

	const [editMode, setEditMode] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);

	const [data, setData] = useState({});
	const [errors, setErrors] = useState({});
	const [formLoading, setFormLoading] = useState(false);

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
		setFormLoading(true)
		setTimeout(() => {
			if (value.document) {
				const documentUrl = URL.createObjectURL(new Blob([value.document], { type: '*' }))
				Object.assign(value, {file: documentUrl, document: undefined})	
			}
			dispatch(addReceipt(value))
			setModalVisible(false)
			dispatch(open({
				type: "success",
				message: "Receipt was added successfully!"
			}))
			setData({})
			setFormLoading(false)
		}, 2000)
	}, [dispatch])

	const handleUpdateReceipt = useCallback((value) => {
		setFormLoading(true)
		setTimeout(() => {
			const receipt = receipts.find(data => data.id === value.id)
			if (receipt) {
				if (value.document) {
					const documentUrl = URL.createObjectURL(new Blob([value.document], { type: '*' }))
					Object.assign(value, {file: documentUrl, document: undefined})	
				}
				dispatch(updateReceipt(value))
				dispatch(open({
					type: "success",
					message: "Receipt was updated successfully!"
				}))
				setModalVisible(false)
				setEditMode(false)
				setData({})
			} else {
				setModalVisible(false)
				dispatch(open({
					type: "danger", 
					message: `Receipt with ID ${value.id} was not found`
				}))
			} 
			setFormLoading(false)
		}, 2000)
	}, [dispatch, receipts])

	useEffect(() => {
		setTimeout(() => {
			let storageReceipts = localStorage.getItem("receipts");
			if (storageReceipts !== null) {
				storageReceipts = JSON.parse(storageReceipts);
				dispatch(setReceipts(storageReceipts));
			}
			setLoading(false);
		}, 2000);
	}, [dispatch]);

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
							onClick={() => setModalVisible(true)}
							padding="px-4 py-3"
							rounded="rounded-lg"
							title="add receipt"
						/>
					</div>
				</div>
			</div>
			{receipts.length > 0 ? (
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
						loading={formLoading}
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
			{loading && <LoadingPage />}
		</div>
	);
};

export default Receipts;
