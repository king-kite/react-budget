import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { open } from "../store/features/alert-slice";
import {
	useGetGoalsQuery,
	useAddGoalMutation,
	useEditGoalMutation,
} from "../store/features/goals-api-slice";
import { useLoadingContext } from "../contexts";
import { Button } from "../components/controls";
import { Modal } from "../components/common";
import { GoalCard, GoalForm } from "../components/Goals";
import { toCapitalize } from "../utils";

const Goals = () => {
	const dispatch = useDispatch();

	const { data: goals, isLoading } = useGetGoalsQuery();

	const [
		addGoal,
		{ status: addStatus, isLoading: addLoading, error: addError },
	] = useAddGoalMutation();
	const [
		editGoal,
		{ status: editStatus, isLoading: editLoading, error: editError },
	] = useEditGoalMutation();

	const { openLoader, closeLoader } = useLoadingContext();

	const [editMode, setEditMode] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const [data, setData] = useState({});
	const [errors, setErrors] = useState({});

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

	const handleAddGoal = useCallback(
		(value) => {
			addGoal(value);
		},
		[addGoal]
	);

	const handleUpdateGoal = useCallback(
		(value) => {
			const goal = goals ? goals.find((data) => data.id === value.id) : null;
			if (goal) {
				editGoal(value);
			} else {
				setModalVisible(false);
				dispatch(
					open({
						type: "danger",
						message: `Financial Goal with ID ${value.id} was not found`,
					})
				);
			}
		},
		[dispatch, editGoal, goals]
	);

	useEffect(() => {
		if (isLoading) openLoader();
		else closeLoader();
	}, [isLoading]);

	useEffect(() => {
		if (addStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Financial Goal was added successfully!",
				})
			);
			setModalVisible(false);
			setData({});
		} else if (addStatus === "rejected" && addError) {
			console.log("ADD GOAL ERROR :>> ", addError);
		}
	}, [addStatus, addError]);

	useEffect(() => {
		if (editStatus === "fulfilled") {
			dispatch(
				open({
					type: "success",
					message: "Financial Goal was updated successfully!",
				})
			);
			setModalVisible(false);
			setData({});
			setEditMode(false);
		} else if (editStatus === "rejected" && editError) {
			console.log("EDIT GOAL ERROR :>> ", editError);
		}
	}, [editStatus, editError]);

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
							onClick={() => {
								setEditMode(false)
								setData({})
								setModalVisible(true)
							}}
							padding="px-4 py-3"
							rounded="rounded-lg"
							title="add goal"
						/>
					</div>
				</div>
			</div>
			{goals && goals.length > 0 ? (
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
					<p className="top-description">
						There are currently no financial goals.
					</p>
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
						loading={editMode ? editLoading : addLoading}
						onChange={handleChange}
						onSubmit={editMode ? handleUpdateGoal : handleAddGoal}
						onReset={() =>
							setData((prevState) => ({
								...prevState,
								name: "",
								description: "",
								amount: "",
								start_date: "",
								end_date: "",
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
		</div>
	);
};

export default Goals;
