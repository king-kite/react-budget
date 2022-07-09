import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { open } from "../store/features/alert-slice";
import { setGoals, addGoal, updateGoal } from "../store/features/goals-slice";
import { Button } from "../components/controls";
import { Modal } from "../components/common";
import { GoalCard, GoalForm } from "../components/Goals";
import { LoadingPage, toCapitalize } from "../utils";

const Goals = () => {
	const dispatch = useDispatch();
	const goals = useSelector((state) => state.goals.data);

	const [editMode, setEditMode] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);

	const [data, setData] = useState({});
	const [errors, setErrors] = useState({});
	const [formLoading, setFormLoading] = useState(false);

	const handleChange = useCallback(({ target: { name, value } }) => {
		setData((prevState) => ({
			...prevState,
			[name]: value,
		}));

		setErrors((prevState) => ({
			...prevState,
			[name]: "",
		}));
	}, []);

	const handleAddGoal = useCallback((value) => {
		setFormLoading(true)
		setTimeout(() => {
			dispatch(addGoal(value))
			setModalVisible(false)
			dispatch(open({
				type: "success",
				message: "Financial Goal was added successfully!"
			}))
			setData({})
			setFormLoading(false)
		}, 2000)
	}, [dispatch])

	const handleUpdateGoal = useCallback((value) => {
		setFormLoading(true)
		setTimeout(() => {
			const goal = goals.find(data => data.id === value.id)
			if (goal) {
				dispatch(updateGoal(value))
				dispatch(open({
					type: "success",
					message: "Financial Goal was updated successfully!"
				}))
				setModalVisible(false)
				setEditMode(false)
				setData({})
			} else {
				setModalVisible(false)
				dispatch(open({
					type: "danger", 
					message: `Financial Goal with ID ${value.id} was not found`
				}))
			} 
			setFormLoading(false)
		}, 2000)
	}, [dispatch, goals])

	useEffect(() => {
		setTimeout(() => {
			let storageGoals = localStorage.getItem("goals");
			if (storageGoals !== null) {
				storageGoals = JSON.parse(storageGoals);
				dispatch(setGoals(storageGoals));
			}
			setLoading(false);
		}, 2000);
	}, [dispatch]);

	return (
		<div>
			<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="my-2">
					<h3 className="top-heading">Financial Goals</h3>
					<p className="top-description">
						An overview of your all your Financial Goals.
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
							title="add goal"
						/>
					</div>
				</div>
			</div>
			{goals.length > 0 ? (
				<div className="gap-4 grid grid-cols-1 sm:gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
					{goals.map((goal, index) => (
						<div key={index}>
							<GoalCard
								{...goal}
								bg={(index + 1) % 2 === 0 ? "bg-white" : "bg-gray-100"}
								updateGoal={(value) => {
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
					<p className="top-description">There are currently no financial goals.</p>
					<p className="top-description">Add one now</p>
				</div>
			)}
			<Modal
				close={() => setModalVisible(false)}
				containerClass=""
				component={
					<GoalForm
						data={data}
						errors={errors}
						loading={formLoading}
						onChange={handleChange}
						onSubmit={editMode ? handleUpdateGoal : handleAddGoal}
						onReset={() =>
							setData((prevState) => ({
								...prevState,
								name: "",
								description: "",
								amount: "",
								start_date: "",
								end_date: ""
							}))
						}
					/>
				}
				description={`Fill in the form below to ${
					editMode ? "update" : "add"
				} a financial goal...`}
				title={`${editMode ? "Update" : "Add"} Financial Goal`}
				visible={modalVisible}
			/>
			{loading && <LoadingPage />}
		</div>
	);
};

export default Goals;
