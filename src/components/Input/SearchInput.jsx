import React from 'react'

function SearchInput({
    placeholder,
    className,
    inputClassName,
    ref,
    onChange,
    onFocus,
    onBlur,
    ...props

}) {
  return (
    <div className={`border flex px-8 py-4 gap-5 rounded-xl ${className} ${props} ${ref}`}>
        <input className={`w-full ${inputClassName} outline-none`} onFocus={onFocus} onBlur={onBlur} onChange={onChange} placeholder={placeholder}/>
        <svg class="h-8 w-8 text-blue-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="11" cy="11" r="8" />  <line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
    </div>
  )
}

export default SearchInput