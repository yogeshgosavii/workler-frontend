import React from "react";

function DateInput({type,name,placeholder,minDate,maxDate,value,onChange,isRequired,className}) {
    const today = new Date();
const todayFormatted = today.toISOString().split("T")[0];
  return (
    <div className={`relative flex w-fit ${className}`}>
      <input
        type={type}
        name={name}
        id={name}
        className={`block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer `}
        placeholder=""
        value={value}
        min={minDate}
        max={maxDate?maxDate:todayFormatted}
        onChange={onChange}
        
      />
      <label
        htmlFor={value}
        onClick={(e) => {
          document.getElementById(name).focus();
          e.stopPropagation();
        }}
        className={`absolute flex duration-200 min-w-28  cursor-text px-2 text-gray-400 bg-white font-normal transform transition-all  ${
          value
            ? "scale-90 min-w-fit max-w-fit  -translate-y-5 top-2 text-blue-500"
            : "-translate-y-1/2 scale-100 top-1/2"
        } z-10 peer-focus:px-2 peer-focus:w-fit peer-focus:text-blue-500 peer-focus:scale-90 peer-focus:-translate-y-5 peer-focus:top-2 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
      >
        {placeholder}{isRequired && <p className='text-red-500'>*</p>}
      </label>
    </div>
  );
}

export default DateInput;
