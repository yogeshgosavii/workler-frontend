import React from "react";

function OptionInput({
  name,
  placeholder,
  value,
  optionList,
  onChange,
  isRequired,
  className,
  promptMessage,
}) {
  const [message, setMessage] = useState(promptMessage);

  const handleChange = (e) => {
    onChange(e);
    if (isRequired && !e.target.value) {
      setMessage({ type: "error", text: "This is a required field" });
    } else {
      setMessage(null);
    }
  };

  return (
    <div className={` relative flex ${className}`}>
      <div>
        <select
          name={name}
          id={name}
          className={` block px-3 py-3 w-full font-normal bg-white rounded-sm border ${
            isRequired && !value ? "border-red-500" : ""
          } appearance-none focus:outline-none focus:ring-0 focus:${
            isRequired && !value ? "border-red-500" : "border-blue-500"
          } peer ${value ? "text-black" : "text-gray-500"}`}
          value={value}
          onClick={(e) => {
            e.preventDefault();
          }}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          {optionList.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label
          htmlFor={name}
          onClick={(e) => {
            document.getElementById(name).focus();
            e.stopPropagation();
          }}
          className={`flex min-w-32 absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform transition-all ${
            value
              ? "-translate-y-4 scale-90 top-2 z-10 w-fit"
              : "top-1/2 -translate-y-1/2"
          } peer-focus:-translate-y-4 peer-focus:w-fit peer-focus:scale-90 peer-focus:top-2 peer-focus:text-blue-600 start-1`}
        >
          {placeholder}
          {isRequired && <p className="text-red-500">*</p>}
        </label>
      </div>
      {promptMessage && (
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

export default OptionInput;
