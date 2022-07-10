import { forwardRef, useCallback } from "react";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
	FaArrowCircleRight,
	FaArrowCircleLeft,
	FaChartLine,
	FaMoneyBillWave,
	FaMoneyCheck,
	FaReceipt,
	FaSignOutAlt,
	FaSmileBeam,
	FaTable,
	FaThLarge,
} from "react-icons/fa";
import { APP_NAME, LOGO_IMAGE } from "../config";
import * as routes from "../config/routes";
import { logout } from "../store/features/auth-slice";
import AppLink from "./Link";

const links = [
	{
		Icon: FaThLarge,
		href: routes.HOME_PAGE_URL,
		title: "dashboard",
	},
	{
		Icon: FaTable,
		href: routes.BUDGETS_PAGE_URL,
		title: "budgets",
	},
	{
		Icon: FaMoneyBillWave,
		href: routes.EXPENSES_PAGE_URL,
		title: "expenses",
	},
	{
		Icon: FaMoneyCheck,
		href: routes.INCOME_PAGE_URL,
		title: "income",
	},
	{
		Icon: FaSmileBeam,
		href: routes.GOALS_PAGE_URL,
		title: "goals",
	},
	{
		Icon: FaReceipt,
		href: routes.RECEIPTS_PAGE_URL,
		title: "receipts",
	},
	{
		Icon: FaChartLine,
		href: routes.LITERACY_PAGE_URL,
		title: "literacy",
	},
];

const Header = forwardRef(
	({ nVisible, setNVisible, setVisible, visible }, ref) => {
		const dispatch = useDispatch()
		const navigate = useNavigate()

		const handleLogout = useCallback(() => {
			dispatch(logout())
			navigate(routes.LOGIN_PAGE_URL, { replace: true })
		}, [dispatch, navigate])

		return (
			<header
				ref={ref}
				className={`${visible ? "translate-x-0" : "-translate-x-full"} ${
					nVisible
						? "w-5/6 sm:w-2/3 md:w-1/3 lg:w-1/5 xl:w-[16%]"
						: "w-[37.5%] sm:w-1/6 md:w-[12.5%] lg:w-1/12"
				} bg-gray-50 duration-500 fixed h-full left-0 top-0 transform z-50 lg:translate-x-0`}
			>
				<div className="h-full w-full overflow-y-auto">
					<div
						className={`${
							nVisible ? "px-3 py-6" : ""
						} bg-gray-50 flex items-center justify-between p-3 w-full`}
					>
						<div className="flex justify-center w-full">
							<div className="h-[40px] w-[40px]">
								<img className="h-full w-full" alt={APP_NAME} src={LOGO_IMAGE} />
							</div>
						</div>
						<div
							className={`cursor-pointer duration-500 px-2 hover:scale-105 ${
								nVisible ? "px-2" : "lg:pl-0"
							}`}
							onClick={() => setNVisible(!nVisible)}
						>
							<span className="text-primary-500 text-base md:text-lg lg:text-base">
								{nVisible ? <FaArrowCircleLeft /> : <FaArrowCircleRight />}
							</span>
						</div>
					</div>
					<ul className="divide-y divide-gray-300 divide-opacity-50 flex flex-col min-h-[75%] item-center justify-center sm:px-2 lg:px-0">
						{links.map((link, index) => (
							<AppLink
								key={index}
								{...link}
								closeSidebar={() => setVisible(false)}
								visible={nVisible}
							/>
						))}
						<AppLink 
							Icon={FaSignOutAlt}
							href="#"
							onClick={handleLogout}
							title="sign out"
							closeSidebar={() => setVisible(false)}
							visible={nVisible}
						/>
					</ul>
				</div>
			</header>
		)
	}
);

export default Header;
