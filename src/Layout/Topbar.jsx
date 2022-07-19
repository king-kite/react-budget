import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa";
import { PROFILE_PAGE_URL, DEFAULT_IMAGE } from "../config";
import { useGetProfileQuery } from "../store/features/auth-api-slice";
import { useOutClick } from "../hooks";
import { Loader } from "../components/controls";
import Notifications from "./Notifications"

const Topbar = () => {
	const { buttonRef, ref, setVisible, visible } = useOutClick();

	const [count, setCount] = useState(0);
	const { data, isFetching } = useGetProfileQuery();

	return (
		<div className="relative w-full">
			<div className="bg-white flex flex-col items-center justify-between p-3 relative shadow-lg w-full sm:flex-row sm:px-5 md:px-7">

				{!isFetching && data ? (
					<div className="my-1 px-2 text-center w-full sm:text-left">
						<p className="capitalize font-bold my-1 text-gray-800 text-sm tracking-wide md:text-base">
							welcome, {data.displayName || "user"}
						</p>
						<span className="my-1 text-gray-400 text-sm">
							Manage your budgets, expenses e.t.c.
						</span>
					</div>
				) : (
					<div className="flex items-center justify-center">
						<Loader color="primary" size={3} type="dotted" border="border" />
					</div>
				)}

				<div className="flex items-center justify-end my-1 px-3 w-full">
					
					<div
						ref={buttonRef}
						onClick={() => setVisible(!visible)}
						className="cursor-pointer duration-500 flex items-center justify-center min-h-[30px] min-w-[30px] mx-4 relative transition transform hover:scale-110"
					>
						<span>
							<FaRegBell className="text-xl text-gray-700" />
						</span>
						<span
							className={` ${
								count > 99
									? "p-[3px] right-[-6px]"
									: count > 9
									? "pl-[3px] pb-[1px] p-[2px] right-0"
									: "px-[5px] pb-[1px] pt-[2px] right-0"
							} absolute bg-red-500 flex justify-center items-center rounded-full top-0 text-center text-gray-100`}
							style={{ fontSize: "9px" }}
						>
							{count > 99 ? "+99" : count}
						</span>
					</div>

					<Link
						to={PROFILE_PAGE_URL}
						className="cursor-pointer duration-500 flex items-center px-2 transition transform hover:scale-110"
					>
						{!isFetching && data ? (
							<div className="h-[30px] rounded-full w-[30px]">
								<img
									alt="user"
									className="h-full rounded-full w-full"
									src={data.image || DEFAULT_IMAGE}
								/>
							</div>
						) : (
							<Loader color="primary" size={3} type="dotted" border="border" />
						)}
					</Link>

					<Notifications visible={visible} ref={ref} setCount={setCount} count={count} />
				</div>

			</div>
		</div>
	);
};

export default Topbar;
