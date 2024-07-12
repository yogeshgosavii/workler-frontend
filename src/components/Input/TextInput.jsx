import React, { useState, useEffect } from "react";

function TextInput({
  name,
  placeholder,
  value,
  onChange,
  isRequired,
  className,
  promptMessage
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
    <div className={` ${className}`}>
      <div className="relative flex peer">
        <input
          type="text"
          name={name}
          id={name}
          className={`block px-3 py-3 w-full font-normal bg-white rounded-sm border ${
            isRequired && !value ? "border-red-500" : ""
          } appearance-none focus:outline-none focus:ring-0 focus:${
            isRequired && !value ? "border-red-500" : "border-blue-500"
          } peer`}
          placeholder=""
          value={value}
          onChange={handleChange}
          style={{
            "-webkit-autofill": "number",
            "-webkit-box-shadow": "0 0 0px 1000px white inset",
          }}
        />
        <label
          htmlFor={name}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(name).focus();
          }}
          className={`absolute duration-200 flex cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
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

export default TextInput;
