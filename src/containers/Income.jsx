import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { open } from "../store/features/alert-slice";
import { useLoadingContext } from "../contexts"
import { useAddIncomeMutation, useEditIncomeMutation, useGetIncomeQuery } from "../store/features/income-api-slice"
import { Button } from "../components/controls"
import { Modal } from "../components/common";
import { IncomeCard, IncomeForm } from "../components/Income"
import { toCapitalize } from "../utils"

const Income = () => {
	const dispatch = useDispatch();
	const { data:income, isLoading } = useGetIncomeQuery();

	const [addIncome, { status:addStatus, isLoading:addLoading, error:addError}] = useAddIncomeMutation()
	const [editIncome, { status:editStatus, isLoading:editLoading, error:editError}] = useEditIncomeMutation()

	const { openLoader, closeLoader } = useLoadingContext();

	const [editMode, setEditMode] = useState(false)
	const [modalVisible, setModalVisible] = useState(false);

	const [data, setData] = useState({})
	const [errors, setErrors] = useState({})

	const handleChange = useCallback(({ target: { name, value }}) => {
		setData(prevState => ({
			...prevState,
			[name]: value
		}))

		setErrors(prevState => ({
			...prevState,
			[name]: ""
		}))
	}, [])

	const handleAddIncome = useCallback((value) => {
		addIncome(value)
	}, [addIncome])

	const handleUpdateIncome = useCallback((value) => {
			const singleIncome = income ? income.find(data => data.id === value.id) : null
			if (singleIncome) {
				editIncome(value)
			} else {
				setModalVisible(false)
				dispatch(open({
					type: "danger", 
					message: `Income Transaction with ID ${value.id} was not found`
				}))
			} 
	}, [dispatch, editIncome, income])

	useEffect(() => {
		if (isLoading) openLoader()
		else closeLoader()
	}, [isLoading])

	useEffect(() => {
		if (addStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Income Transaction was added successfully!"
				})
			);
			setModalVisible(false);
			setData({});
		} else if (addStatus === "rejected" && addError) {
			console.log("ADD INCOME ERROR :>> ", addError);
		}
	}, [addStatus, addError]);

	useEffect(() => {
		if (editStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Income Transaction was updated successfully!",
				})
			);
			setModalVisible(false);
			setData({});
			setEditMode(false);
		} else if (editStatus === "rejected" && editError) {
			console.log("EDIT INCOME ERROR :>> ", editError);
		}
	}, [editStatus, editError]);

	return (
		<div>
			
				<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="my-2">
						<h3 className="top-heading">Income Transactions</h3>
						<p className="top-description">
							An overview of your all your Income Transactions.
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
								title="add income"
							/>
						</div>
					</div>
				</div>
				{income && income.length > 0 ? (
					<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
						{income.map((data, index) => (
							<div key={index}>
								<IncomeCard 
									{...data} 
									bg={(index + 1) % 2 === 0 ? "bg-white" : "bg-gray-100"}
									updateIncome={(value) => {
										setData(value)
										setEditMode(true)
										setModalVisible(true)
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
						<p className="top-description">
							There are currently no Income Transactions.
						</p>
						<p className="top-description">
							Add one now
						</p>
					</div>
				)}
				<Modal
					close={() => setModalVisible(false)}
					containerClass=""
					component={
						<IncomeForm 
							data={data}
							errors={errors}
							loading={editMode ? editLoading : addLoading}
							onChange={handleChange}
							onSubmit={editMode ? handleUpdateIncome : handleAddIncome}
							onReset={() => setData(prevState => ({
								...prevState,
								title: "",
								description: "",
								amount: "",
								date: "",
							}))}
						/>
					}
					description={`Fill in the form below to ${editMode ? "update" : "add"} an income transaction...`}
					title={`${editMode ? "Update" : "Add"} an Income Trasaction`}
					visible={modalVisible}
				/>
		</div>
	);
};

export default Income;
