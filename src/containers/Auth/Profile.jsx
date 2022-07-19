import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { FaUserEdit, FaLock } from "react-icons/fa";
import { DEFAULT_IMAGE } from "../../config";
import { useLoadingContext } from "../../contexts";
import { open } from "../../store/features/alert-slice"
import { useGetProfileQuery } from "../../store/features/auth-api-slice";
import { InfoComp, Modal } from "../../components/common";
import { Button } from "../../components/controls";
import { PasswordForm, ProfileForm } from "../../components/Profile";
import { toCapitalize } from "../../utils";

const Profile = () => {
	const [formType, setFormType] = useState("user");
	const [modalVisible, setModalVisible] = useState(false);

	const { closeLoader, openLoader } = useLoadingContext();

	const { data: user, isFetching, error } = useGetProfileQuery();

	const dispatch = useDispatch()

	useEffect(() => {
		if (isFetching) openLoader();
		else closeLoader();
	}, [isFetching]);

	useEffect(() => {
		if (error)
			dispatch(open({
				message: String(error.detail),
				type: "danger"
			}))
	}, [error])

	const details = user
		? [
				{
					title: "Display Photo",
					type: "image",
					value: {
						alt: user.displayName || user.email,
						src: user.image || DEFAULT_IMAGE,
					},
				},
				{
					title: "Email",
					value: user.email,
				},
				{
					title: "Display Name",
					value: user.displayName || "------",
				},
		  ]
		: [];

	return (
		<div>
			{user && (
				<>
					<div className="flex flex-col items-start my-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="my-2">
							<h3 className="top-heading">Profile</h3>
							<p className="top-description">
								View profile information below.
							</p>
						</div>
						<div className="flex flex-col items-start my-2 xs:flex-row xs:items-center xs:justify-center">
							<div className="my-1 mr-1 xs:my-0">
								<Button
									bg="bg-primary-600 hover:bg-primary-500"
									caps
									iconSize="text-sm md:text-base"
									IconLeft={FaUserEdit}
									onClick={() => {
										setFormType("user")
										setModalVisible(true);
									}}
									padding="px-6 py-3"
									rounded="rounded-lg"
									title="edit"
								/>
							</div>
							<div className="my-1 mr-1 xs:my-0 xs:mx-1">
								<Button
									bg="bg-red-600 hover:bg-red-500"
									caps
									iconSize="text-sm md:text-base"
									IconLeft={FaLock}
									onClick={() => {
										setFormType("password")
										setModalVisible(true);
									}}
									padding="px-6 py-3"
									rounded="rounded-lg"
									title="change password"
								/>
							</div>
						</div>
					</div>

					<div>
						<InfoComp title="Details" infos={details} />
					</div>

					<Modal
						close={() => setModalVisible(false)}
						containerClass=""
						component={
							formType === "user" ? (
								<ProfileForm
									onSuccess={() => setModalVisible(false)}
									displayName={user.displayName}
									email={user.email}
								/>
							) : (
								<PasswordForm onSuccess={() => setModalVisible(false)} />
							)
						}
						description={formType === "user" ? "Fill in the form below to update profile information" : "Fill in the form below to change your password"}
						title={formType === "user" ? "Update Profile Information" : "Change Password"}
						visible={modalVisible}
					/>
				</>
			)}
		</div>
	);
};

export default Profile;
