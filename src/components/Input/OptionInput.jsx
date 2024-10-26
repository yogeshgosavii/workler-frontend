import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function OptionInput({
  name,
  placeholder,
  value,
  options,
  optionClassName,
  initialValue = "",
  onChange,
  isRequired,
  className,
  promptMessage,
}) {
  const [message, setMessage] = useState(promptMessage);
  const [currentValue, setCurrentValue] = useState(value || initialValue); // Set initial value if provided

  useEffect(() => {
    setCurrentValue(value || initialValue); // Sync with external value prop
  }, [value, initialValue]);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setCurrentValue(selectedValue);
    onChange(e);

    // Update the message based on the selected value
    if (isRequired && !selectedValue) {
      setMessage({ type: "error", text: "This is a required field" });
    } else {
      setMessage(null); // Reset message when value is valid
    }
  };

  return (
    <div className={className}>
      <div className="relative flex h-full">
        <select
          name={name}
          id={name}
          className={`block px-3 py-3 w-full ${optionClassName} font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500
           peer ${currentValue ? "text-black" : "text-gray-500"}`}
          value={currentValue || ""}
          onChange={handleChange}
          aria-required={isRequired} // Accessibility
          aria-invalid={message?.type === "error"} // Accessibility
        >
          <option value="" disabled={!currentValue}>
            {initialValue}
          </option>
          {options?.map((option) => (
            <option key={option?.value || option} value={option?.value || option}>
              {option?.name || option}
            </option>
          ))}
        </select>
        <label
          htmlFor={name}
          className={`flex ml-px min-w-32 absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform transition-all ${
            currentValue
              ? "-translate-y-5 scale-90 top-2 z-10 min-w-fit"
              : "top-1/2 -translate-y-1/2"
          } peer-focus:-translate-y-5 peer-focus:min-w-fit peer-focus:scale-90 peer-focus:top-2 peer-focus:text-blue-600`}
          onClick={(e) => {
            document.getElementById(name).focus();
            e.stopPropagation();
          }}
        >
          {placeholder}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      </div>
      {message && (
        <p
          className={`w-fit ml-1 mt-0.5 text-xs mb-1 rounded-sm ${
            message.type === "error"
              ? "text-red-500"
              : "text-green-500 bg-green-50"
          } `}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

// Prop validation
OptionInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.string,
      name: PropTypes.string,
    }),
  ])).isRequired,
  optionClassName: PropTypes.string,
  initialValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  promptMessage: PropTypes.string,
};

export default OptionInput;
