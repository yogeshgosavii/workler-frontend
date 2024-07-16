import React, { useState } from "react";

function PasswordInput({
  name,
  placeholder,
  value,
  onChange,
  isRequired,
  className,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        id={name}
        className="block px-3 py-3 pr-[75px] w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
        placeholder=""
        value={value}
        onChange={onChange}
        style={{
          WebkitAutofill: "number",
          WebkitBoxShadow: "0 0 0px 1000px white inset",
        }}
      />
      <label
        htmlFor={name}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(name).focus();
        }}
        className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {placeholder}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        onClick={() => setShowPassword(!showPassword)}
        className="text-gray-300 z-10 absolute w-14 flex items-center justify-center border-l h-9 cursor-pointer my-1 right-2 pl-1.5"
      >
        {showPassword ? (
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default PasswordInput;
