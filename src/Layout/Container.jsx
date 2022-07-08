import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APP_NAME, LOGO_IMAGE } from "../config";
import { close } from "../store/features/alert-slice";
import { useOutClick } from "../hooks";
import { MenuIcon } from "../components/common";
import { Alert } from "../components/controls";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const Container = ({ children }) => {
	const { buttonRef, ref, setVisible, visible } = useOutClick();
	const [nVisible, setNVisible] = useState(false);

	const dispatch = useDispatch();
	const message = useSelector((state) => state.alert.message);
	const alertType = useSelector((state) => state.alert.type);
	const alertVisible = useSelector((state) => state.alert.visible);

	return (
		<>
			<Sidebar
				ref={ref}
				visible={visible}
				setVisible={setVisible}
				nVisible={nVisible}
				setNVisible={setNVisible}
			/>
			<main
				className={`${
					!nVisible ? "lg:w-11/12" : "lg:w-4/5 xl:w-[84%]"
				} min-h-[90vh] transform transition w-full lg:ml-auto lg:min-h-screen`}
			>
				<div className="bg-gray-100 flex items-center justify-between p-4 w-full md:p-5 lg:hidden">
					<div className="h-[40px] w-[40px]">
						<img
							className="h-full w-full"
							alt={APP_NAME}
							src={LOGO_IMAGE}
						/>
					</div>
					<div className="cursor-pointer duration-300 px-2 hover:scale-105">
						<MenuIcon
							color="primary"
							ref={buttonRef}
							setVisible={setVisible}
							visible={visible}
						/>
					</div>
				</div>
				<div className="bg-gray-50 h-full min-h-[90vh] w-full lg:min-h-screen">
					<Topbar />
					<div className="p-3 sm:p-5 md:p-8">
						<div
							className={
								alertVisible
									? "block container mx-auto py-2 relative w-full z-[55]"
									: "hidden"
							}
						>
							<Alert
								message={message}
								onClick={() => dispatch(close())}
								type={alertType}
								visible={alertVisible}
							/>
						</div>
						{children}
					</div>
				</div>
			</main>
		</>
	);
};

export default Container;
