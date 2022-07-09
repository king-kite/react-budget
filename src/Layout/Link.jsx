import { useState } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";

const AppLink = ({
	Icon,
	href,
	onClick,
	closeSidebar,
	title,
	visible,
}) => {
	const [hover, setHover] = useState(false);

	const { pathname } = useLocation();

	const _pathname =
		pathname !== "/" && pathname.slice(-1) !== "/" ? pathname + "/" : pathname;

	const active1 = useMatch(href) !== null;
	const active2 = href && href !== "/" && _pathname !== "/" && _pathname.startsWith(href)

	const activeLink = active1 || active2;

	return (
		<li>
			<Link
				to={href || "#"}
				className="cursor-pointer flex justify-center px-6 w-full sm:px-2 md:px-8 lg:px-2 xl:px-0"
				onClick={() => {
					if (onClick) onClick()
					closeSidebar()
				}}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
				<div
					className={`${visible ? "justify-start" : "justify-center"} flex items-center my-4 w-full md:my-5`}
				>
					<span
						className={`duration-300 inline-block mx-2 text-2xl ${
							activeLink || hover
								? "bg-primary-500 p-3 rounded-full scale-105 text-gray-50"
								: "text-primary-800"
						} md:text-3xl lg:text-2xl`}
					>
						<Icon className="text-2xl md:text-3xl lg:text-2xl" />
					</span>
					{visible && (
						<span className="capitalize grow-down inline-block mx-2 text-base text-gray-600">
							{title}
						</span>
					)}
				</div>
			</Link>
		</li>
	);
};

export default AppLink;
