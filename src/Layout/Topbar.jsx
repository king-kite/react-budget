import { Link, useNavigate } from "react-router-dom";
import { FaRegBell, FaHome, FaChevronDown, FaUserTie, FaSignOutAlt } from "react-icons/fa"
import { useDispatch } from "react-redux";
import { USER_IMAGE } from "../config"
import { HOME_PAGE_URL, LOGIN_PAGE_URL } from "../config/routes";
import { logout } from "../store/features/auth-slice";
import { useOutClick } from "../hooks";
import { Input, Button } from "../components/controls"

const Topbar = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate();

	const { buttonRef, ref, setVisible, visible } = useOutClick()

	return (
		<div className="relative w-full">
			<div className="bg-white flex flex-col items-center justify-between p-3 shadow-lg w-full sm:flex-row sm:px-5 md:px-7">
				<div className="my-1 px-2 text-center w-full sm:text-left">
					<p className="capitalize font-bold my-1 text-gray-800 text-sm tracking-wide md:text-base">welcome, jarel johnson</p>
					<span className="my-1 text-gray-400 text-sm">
						You're doing great this week, keep it up
					</span>
				</div>
				<div className="flex items-center my-1 px-3 w-full sm:justify-end">
					<div className="cursor-pointer duration-300 px-1 text-primary-500 hover:text-secondary-500 hover:scale-105">
						<FaRegBell className="inline-block mx-2 text-base sm:mx-4 sm:text-base text-gray-500 md:text-lg" />
					</div>
					<form 
						className="px-3 w-full md:w-4/5 lg:w-2/3"
						onSubmit={(e) => {
							e.preventDefault()
							window.alert("Submitted")
						}}
					>
						<div className="px-1">
							<Input 
								bdrColor="border-gray-300"
								placeholder="Search your transactions"
								rounded="rounded-lg md:rounded-xl"
							/>
						</div>
						<button className="hidden" style={{display: "none"}} type="submit">submit</button>
					</form>
					<div 
						onClick={() => setVisible(!visible)}
						ref={buttonRef} 
						className="cursor-pointer flex items-center px-2"
					>
						<div className="h-[30px] rounded-full w-[30px]">
							<img 
								alt="user"
								className="h-full rounded-full w-full"
								src={USER_IMAGE}
							/>
						</div>
						
						<FaChevronDown style={{fontSize: "1rem"}} className="inline-block px-1 text-gray-500 text-xs" />
					</div>
				</div>
			</div>
			<div ref={ref} className={`${
				visible ? "absolute bg-white grow-down right-0 rounded-b-lg shadow-lg top-[7.6rem] w-[45%] z-[75] sm:top-[5.2rem] sm:w-1/3 md:top-[5.4rem] md:w-1/4 lg:w-1/5 xl:w-1/6" : "hidden"
			}`}>
				<ul className="divide-y divide-gray-300 divide-opacity-50">
					<li className="h-full w-full">
						<Link className="bg-white block capitalize cursor-pointer p-2 text-sm w-full hover:bg-gray-200" to={HOME_PAGE_URL}>
							<p className="capitalize p-1 text-gray-500 tracking-wide sm:px-2">
								<FaHome style={{fontSize: ".9rem"}} className="inline-block mx-2 sm:mx-4 text-gray-500" />
								Home
							</p>
						</Link>
					</li>
					<li className="h-full w-full">
						<Link className="bg-white block capitalize cursor-pointer p-2 text-sm w-full hover:bg-gray-200" to={"#"}>
							<p className="capitalize p-1 text-gray-500 tracking-wide sm:px-2">
								<FaUserTie style={{fontSize: ".9rem"}} className="inline-block mx-2 sm:mx-4 text-gray-500" />
								Profile
							</p>
						</Link>
					</li>
					<li className="h-full w-full">
						<Link 
							onClick={() => {
								localStorage.removeItem('user')
								navigate(LOGIN_PAGE_URL, { replace: true })
								dispatch(logout())
							}}
							to="#"
							className="bg-white block capitalize cursor-pointer p-2 text-sm w-full hover:bg-gray-200"
						>
							<p className="capitalize p-1 text-gray-500 tracking-wide sm:px-2">
								<FaSignOutAlt style={{fontSize: ".9rem"}} className="inline-block mx-2 sm:mx-4 text-gray-500" />
								logout
							</p>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default Topbar;