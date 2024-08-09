import React, { useState, useRef } from "react";

function TextInput({
  name,
  placeholder,
  value,
  onChange,
  isRequired,
  className,
  promptMessage,
  onFocus,
  onBlur,
  inputProps,
}) {
  const [message, setMessage] = useState(promptMessage);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    onChange(e);
    if (isRequired && !e.target.value) {
      setMessage({ type: "error", text: "This is a required field" });
    } else {
      setMessage(null);
    }
  };

  return (
    <div className={className}>
      <div className="relative flex peer">
        <input
          autoFocus={inputProps.autoFocus}
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...inputProps}
          className={`block px-3 py-3 w-full font-normal bg-white rounded-sm border focus:border-blue-500
           appearance-none focus:outline-none peer`}
          placeholder=""
          ref={inputRef}
          style={{
            WebkitAutofill: "number",
            WebkitBoxShadow: "0 0 0px 1000px white inset",
          }}
        />
        <label
          htmlFor={name}
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          className={`absolute duration-200 flex cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
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
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

export default TextInput;
