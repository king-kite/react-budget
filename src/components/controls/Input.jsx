import { useCallback, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({
	bg,
	bdr,
	bdrColor,
	color,
	disabled,
	error,
	errorSize,
	helpText,
	helpTextColor,
	helpTextSize,
	Icon,
	iconColor,
	iconClass,
	iconSize,
	label,
	labelColor,
	labelSize,
	multiple,
	onChange,
	name,
	padding,
	placeholder,
	placeholderColor,
	rounded,
	required,
	requiredColor,
	textSize,
	type,
	value,
	...props
}) => {
	const [_type, setType] = useState(type || "text");

	const bgColor = disabled ? "bg-gray-500" : bg;

	const borderColor = disabled
		? "border-transparent"
		: error
		? "border-red-500"
		: bdrColor
		? bdrColor
		: "border-primary-500";

	const _labelColor = disabled
		? "text-gray-500"
		: error
		? "text-red-500"
		: labelColor
		? labelColor
		: "text-primary-500";

	const iconTextColor = disabled ? "text-white" : iconColor;

	const textColor = disabled
		? placeholderColor
		: type === "date"
		? value === "" || value === null || value === undefined
			? "text-gray-400"
			: color
		: color;

	const handlePasswordCheck = useCallback(() => {
		if (_type === "password") setType("text");
		else setType("password");
	}, [_type]);

	return (
		<>
			{(label || badge || btn) && (
				<div className="flex items-center justify-between mb-2">
					{label && (
						<label
							className={`${_labelColor} ${labelSize} block capitalize font-semibold`}
							htmlFor={name}
						>
							{label}
							{required && (
								<span className={`${requiredColor || "text-red-500"} mx-1`}>
									*
								</span>
							)}
						</label>
					)}
				</div>
			)}
			<div
				className={`${borderColor} ${bgColor} ${rounded} ${bdr} flex items-center shadow-lg text-xs w-full`}
			>
				{Icon && (
					<span
						className={`${bgColor} ${iconTextColor} ${iconSize} ${iconClass}`}
					>
						<Icon className={`${iconTextColor} ${iconSize}`} />
					</span>
				)}
				<input
					className={`${bgColor} ${textColor} ${rounded} ${padding} ${
						_type === "date" ? "cursor-text" : ""
					} ${textSize} apperance-none leading-tight w-full focus:outline-none focus:shadow-outline`}
					disabled={disabled}
					name={name}
					onChange={onChange}
					placeholder={placeholder}
					required={required}
					multiple={multiple}
					type={_type}
					value={value}
					{...props}
				/>
				{type === "password" && (
					<span
						onClick={handlePasswordCheck}
						className={`${bgColor} cursor-pointer mr-2`}
					>
						{_type === "password" ? (
							<FaEye className={iconTextColor + " text-xs"} />
						) : (
							<FaEyeSlash className={iconTextColor + " text-xs"} />
						)}
					</span>
				)}
			</div>
			{error && (
				<p
					className={`capitalize font-secondary font-semibold italic mt-1 text-red-500 ${errorSize}`}
				>
					{error}
				</p>
			)}
			{helpText && (
				<p
					className={`font-secondary font-semibold mt-1 px-1 ${helpTextColor} ${helpTextSize}`}
				>
					{helpText}
				</p>
			)}
		</>
	);
};

Input.defaultProps = {
	bg: "bg-transparent",
	bdr: "border",
	color: "text-gray-600",
	errorSize: "text-xs",
	helpTextColor: "text-gray-400",
	helpTextSize: "text-xs",
	iconColor: "text-primary-500",
	iconClass: "mx-2",
	iconSize: "text-xs",
	labelSize: "text-xs md:text-sm",
	multiple: false,
	padding: "px-3 py-2",
	placeholderColor: "placeholder-white text-white",
	required: true,
	requiredColor: "text-red-500",
	rounded: "rounded",
	textSize: "text-xs md:text-sm",
	type: "text",
};

export default Input;
