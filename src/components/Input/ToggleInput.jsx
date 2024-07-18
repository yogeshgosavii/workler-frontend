import React, { useState } from 'react';

function ToggleInput({
  name,
  placeholder,
  value,
  toggleList = [],
  onChange,
  isRequired,
  className,
}) {
  const [message, setMessage] = useState(null);
  const [selected, setSelected] = useState(value || toggleList[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChange = (item, index) => {
    setSelected(item);
    setSelectedIndex(index);

    onChange({ target: { name, value: item } }); // Pass `item` instead of `selected`
    
    if (isRequired && !item) {
      setMessage({ type: 'error', text: 'This is a required field' });
    } else {
      setMessage(null);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center relative">
        <div className="flex border bg-blue-50 rounded-xl border-blue-500 gap-4 px-2 py-1.5">
          {toggleList.map((item, index) => (
            <p
              key={index}
              onClick={() => handleChange(item, index)}
              className={`px-2 py-1 z-10 cursor-pointer ${
                selected === item ? 'font-medium text-white' : 'text-gray-500'
              }`}
              aria-selected={selected === item}
            >
              {item}
            </p>
          ))}
        </div>
        <p
          className={`bg-blue-500 px-2 ${selectedIndex ==1 &&"translate-x-[130px]"} py-1 h-8 rounded-lg absolute font-medium w-[130px] ml-2 text-white  transition-all duration-300`}
           
        >
        </p>
      </div>
      {message && (
        <p
          className={`w-fit ml-1 mt-0.5 text-xs mb-1 rounded-sm ${
            message.type === 'error' ? 'text-red-500' : 'text-green-500 bg-green-50'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

export default ToggleInput;
