import Button from "./Button";
import Input from "./Input";

const defaultButtonProps = {
	caps: true,
	padding: "px-4 py-[0.475rem]",
	rounded: "rounded-r-xl",
};
const defaultInputProps = {
	bg: "bg-white",
	bdr: "border",
	bdrColor: "border-primary-500",
	rounded: "rounded-l-lg",
	required: false
};

const InputButton = ({ buttonProps, inputProps }) => (
	<div className="flex items-end w-full">
		<div className="w-full">
			<Input {...defaultInputProps} {...inputProps} />
		</div>
		<div>
			<Button {...defaultButtonProps} {...buttonProps} />
		</div>
	</div>
);

export default InputButton;
