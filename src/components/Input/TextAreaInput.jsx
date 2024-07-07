import React from "react";

function TextAreaInput({name,placeholder,value,onChange,isRequired,className}) {
  return (
    <div className={`relative flex peer ${className}`}>
      <textarea
        type="textarea"
        name={name}
        id={name}
        className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
        placeholder=""
        value={value}
        onChange={onChange}
      />
      <label
        htmlXFor="project_description"
        onClick={(e) => {
          e.preventDefault();
          e.target.previousSibling.focus();
        }}
        className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {placeholder}{isRequired && <p className='text-red-500'>*</p>}
      </label>
    </div>
  );
}

export default TextAreaInput;
