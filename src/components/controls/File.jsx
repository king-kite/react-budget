import { forwardRef } from "react"

const File = forwardRef(({
	accept,
	bg,
	bdr,
	bdrColor,
	disabled,
	error,
	errorSize,
	Icon,
	iconColor,
	iconSize,
	label,
	labelColor,
	labelSize,
	onChange,
	name,
	padding,
	placeholder,
	required,
	requiredColor,
	rounded,
	txtColor,
	textSize,
	value,
	...props
}, ref) => {

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
		: labelColor;

	const iconTextColor = disabled ? "text-white" : iconColor;

	const textColor = disabled
		? "text-white"
		: txtColor ? txtColor : "text-white";

	return (
		<div className="w-full">
			{label && (
				<span
					className={`${_labelColor} block capitalize font-semibold mb-2 ${labelSize}`}
				>
					{label}
					{required && (
            <span className={`${requiredColor || "text-red-500"} mx-1`}>
              *
            </span>
          )}
				</span>
			)}
			<div
				className={`${rounded} block shadow-lg w-full`}
			>
				<label 
					className={`${padding} ${bdr} ${borderColor} ${rounded} ${bgColor} ${!disabled ? "cursor-pointer" : ""} flex items-center justify-center`}
				>
					{Icon && (
						<Icon className={`${iconTextColor} block mx-2 ${iconSize}`} />
					)}
					<p className={`${textColor} block capitalize text-xs md:text-sm`}>
						{placeholder}
					</p>
					<input
						accept={accept}
						className="h-[1px] opacity-0 w-[1px]"
						disabled={disabled}
						ref={ref}
						onChange={onChange}
						name={name}
						required={required}
						type="file"
						{...props}
					/>
				</label>
			</div>
			{value && (
				<p className={`capitalize font-primary font-semibold italic mt-1 text-primary-500 ${textSize}`}>
					{String(value)}
				</p>
			)}
			{error && (
				<p className={`capitalize font-primary font-semibold italic mt-1 text-red-500 ${errorSize}`}>
					{error}
				</p>
			)}
		</div>
	);
});

File.defaultProps = {
	accept: "*",
	bg: "bg-primary-500 hover:bg-primary-400",
	bdr: "border",
	errorSize: "text-xs",
	iconColor: "text-gray-100",
	iconSize: "text-xs",
	labelColor: "text-primary-500",
	labelSize: "text-xs md:text-sm",
	padding: "px-3 py-2",
	required: true,
	requiredColor: "text-red-500",
	rounded: "rounded",
	textSize: "text-xs"
}

export default File;