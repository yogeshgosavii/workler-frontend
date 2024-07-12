import React from "react";

function DateInput({type,name,placeholder,minDate,maxDate,value,onChange,isRequired,className,promptMessage}) {
    const today = new Date();
const todayFormatted = today.toISOString().split("T")[0];
const [message, setMessage] = useState(null);


const handleChange = (e) => {
  onChange(e);
  if (isRequired && !e.target.value) {
    setMessage({ type: "error", text: "This is a required field" });
  } else {
    setMessage(null);
  }
};
  return (
    <div className={`relative flex w-fit ${className}`}>
      <input
        type={type}
        name={name}
        id={name}
        className={`block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer
          ${
          isRequired && !value ? "border-red-500" : ""
        } appearance-none focus:outline-none focus:ring-0 focus:${
          isRequired && !value ? "border-red-500" : "border-blue-500"
        } peer `}
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
        } `}
      >
        {placeholder}{isRequired && <p className='text-red-500'>*</p>}
      </label>
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

export default DateInput;
