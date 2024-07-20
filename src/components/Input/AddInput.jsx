import React, { useState } from 'react';

function AddInput({ name, placeholder, value, onChange, handleAdd, handleDelete, data = [], isRequired, className,promtMessage }) {
  const [message, setMessage] = useState(promtMessage);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          name={name}
          id={name}
          className={`block px-3 py-3 w-full font-normal bg-white rounded-sm border  appearance-none focus:outline-none focus:ring-0 focus:border-blue-500
           peer`}          
           placeholder=""
          value={value}
          onChange={onChange}
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
          className="absolute flex duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {placeholder}{isRequired && <p className='text-red-500'>*</p>}
        </label>
        <button
          type="button"
          className="absolute right-0 h-full font-medium   text-blue-500  px-6"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      {data.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {data.map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-50 border border-blue-500 text-blue-500 rounded px-3 py-1"
            >
              <span>{tech}</span>
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => handleDelete(tech)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
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

export default AddInput;
