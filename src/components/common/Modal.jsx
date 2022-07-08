import { useCallback, useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa"

const wrapperStyle =
	"duration-500 fixed h-full left-0 overflow-hidden px-3 top-0 transform transition-opacity w-full z-[200]";
const containerStyle =
	" bg-white duration-1000 max-w-2xl mx-auto overflow-y-auto p-3 relative rounded-lg shadow-lg top-[5%] transform transition-all w-full z-50 ";
const hideContainer = "-translate-y-full opacity-0 invisible ";
const showContainer = "translate-y-0 opacity-100 visible ";

const Modal = ({
	containerClass,
	component,
	close,
	description,
	keepVisible,
	visible,
	title,
}) => {
	const [reset, setReset] = useState(false);

	const ref = useRef(null);

	const handleMouseClick = useCallback(
		({ target }) =>
			!keepVisible &&
			typeof close === "function" &&
			!ref?.current?.contains(target) &&
			close(),
		[close, keepVisible]
	);

	useEffect(() => {
		if (visible) setReset(false);
	}, [visible]);

	useEffect(() => {
		if (keepVisible === false)
			document.addEventListener("click", handleMouseClick, true);
		else document.removeEventListener("click", handleMouseClick, true);

		return () =>
			document.removeEventListener("click", handleMouseClick, true);
	}, [keepVisible, handleMouseClick]);

	return (
		<div
			className={`${wrapperStyle}
				${visible ? "opacity-100 scale-100 visible" : "invisible opacity-0 scale-0"}
			`}
			style={{ background: "rgba(0, 0, 0, 0.6)" }}
		>
			<div
				className={
					(visible ? showContainer : hideContainer) + containerStyle + " " + containerClass
				}
				ref={ref}
				style={{ maxHeight: "90vh" }}
			>
				{reset === false && (<>
					<header className="flex items-start justify-between w-full">
						<div className="mx-4">
							{title && (
								<>
									<h4 className="capitalize font-semibold mb-2 text-primary-500 text-base md:text-lg">
										{title}
									</h4>
									{description && (
										<p className="mt-1 text-gray-400 text-sm md:text-base">
											{description}
										</p>
									)}
								</>
							)}
						</div>
						<div
							onClick={() => {
								close();
								setReset(true);
							}}
							className="cursor-pointer duration-500 mx-4 p-2 rounded-full text-gray-700 text-xs transform transition-all hover:bg-gray-200 hover:scale-110 hover:text-gray-600 md:text-sm"
						>
							<FaTimes className="text-xs sm:text-sm" />
						</div>
					</header>
					<main>{component}</main>
				</>)}
			</div>
		</div>
	);
};

Modal.defaultProps = {
	containerClass: "border border-dashed border-primary-500",
	keepVisible: true,
};

export default Modal;
