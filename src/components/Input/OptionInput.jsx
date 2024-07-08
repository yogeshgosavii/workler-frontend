import React from 'react'

function OptionInput({ name, placeholder,value, optionList, onChange,isRequired ,className }) {
  return (
    <div className={` relative flex ${className}`}>
          <select
            name={name}
            id={name}
            className={`mt-1 border bg-white outline-none focus:border-blue-500 p-2 block w-full text-gray-900 py-3 rounded-sm peer ${
              value ? "text-black" : "text-gray-500"
            }`}
            value={value}
            onClick={(e)=>{e.preventDefault()}}
            onChange={onChange}
          >
            <option value="">Select an option</option>
            {optionList.map((option) => (
              <option  value={option}>
                {option}
              </option>
            ))}
          </select>
          <label
            htmlFor={name}
            onClick={(e) => {
              document.getElementById(name).focus();
              e.stopPropagation()
            }}
            className={`flex w-40 absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform transition-all ${
              value
                ? "-translate-y-4 scale-90 top-2 z-10 w-fit"
                : "top-1/2 -translate-y-1/2"
            } peer-focus:-translate-y-4 peer-focus:w-fit peer-focus:scale-90 peer-focus:top-2 peer-focus:text-blue-600 start-1`}
          >
            {placeholder}{isRequired && <p className='text-red-500'>*</p>}
          </label>
        </div>
  )
}

export default OptionInput