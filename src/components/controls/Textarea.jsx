const Textarea = ({
  bg,
  bdr,
  bdrColor,
  color,
  disabled,
  error,
  errorSize,
  label,
  labelColor,
  labelSize,
  name,
  onChange,
  placeholder,
  placeholderColor,
  rounded,
  required,
  requiredColor,
  style,
  textSize,
  value,
  ...props
}) => {
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

  const textColor = disabled ? placeholderColor : color;

  return (
    <>
      {(label || badge || btn) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label
              className={`${_labelColor} block capitalize font-semibold ${labelSize}`}
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
        className={`${borderColor} ${bgColor} ${rounded} ${bdr} shadow-lg w-full`}
      >
        <textarea
          className={`${bgColor} ${textColor} ${textSize} ${rounded} apperance-none leading-tight px-3 py-2 resize w-full focus:outline-none focus:shadow-outline`}
          disabled={disabled}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          value={value}
          style={style}
          {...props}
        />
      </div>
      {error && (
        <p
          className={`font-primary font-semibold italic mt-1 text-red-500 ${errorSize}`}
        >
          {error}
        </p>
      )}
    </>
  );
};

Textarea.defaultProps = {
  bg: "bg-transparent",
  bdr: "border",
  color: "text-gray-600",
  errorSize: "text-xs",
  labelSize: "text-xs md:text-sm",
  placeholderColor: "placeholder-white text-white",
  required: true,
  requiredColor: "text-red-500",
  rounded: "rounded",
  textSize: "text-xs md:text-sm",
};

export default Textarea;
