import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { open } from "../store/features/alert-slice";
import { setIncome, addIncome, updateIncome } from "../store/features/income-slice";
import { Button } from "../components/controls"
import { Modal } from "../components/common";
import { IncomeCard, IncomeForm } from "../components/Income"
import { LoadingPage, toCapitalize } from "../utils"

const Income = () => {
	const dispatch = useDispatch();
	const income = useSelector(state => state.income.data)

	const [editMode, setEditMode] = useState(false)
	const [modalVisible, setModalVisible] = useState(false);
	const [loading, setLoading] = useState(true)

	const [data, setData] = useState({})
	const [errors, setErrors] = useState({})
	const [formLoading, setFormLoading] = useState(false)

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
		setFormLoading(true)
		setTimeout(() => {
			dispatch(addIncome(value))
			setModalVisible(false)
			dispatch(open({
				type: "success",
				message: "Income Transaction was added successfully!"
			}))
			setData({})
			setFormLoading(false)
		}, 2000)
	}, [dispatch])

	const handleUpdateIncome = useCallback((value) => {
		setFormLoading(true)
		setTimeout(() => {
			const singleIncome = income.find(data => data.id === value.id)
			if (singleIncome) {
				dispatch(updateIncome(value))
				dispatch(open({
					type: "success",
					message: "Expense was updated successfully!"
				}))
				setModalVisible(false)
				setEditMode(false)
				setData({})
			} else {
				setModalVisible(false)
				dispatch(open({
					type: "danger", 
					message: `Income Transaction with ID ${value.id} was not found`
				}))
			} 
			setFormLoading(false)
		}, 2000)
	}, [dispatch, income])

	useEffect(() => {
		setTimeout(() => {
			let storageIncome = localStorage.getItem("income")
			if (storageIncome !== null) {
				storageIncome = JSON.parse(storageIncome)
				dispatch(setIncome(storageIncome))
			}
			setLoading(false)
		}, 2000)
	}, [dispatch])

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
								onClick={() => setModalVisible(true)}
								padding="px-4 py-3"
								rounded="rounded-lg"
								title="add income"
							/>
						</div>
					</div>
				</div>
				{income.length > 0 ? (
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
							loading={formLoading}
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
			{loading && <LoadingPage />}
		</div>
	);
};

export default Income;
