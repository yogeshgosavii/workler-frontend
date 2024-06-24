import React from 'react'

function BorderedButton({
    className,
    children,
    bordercolor = "blue-600",
    ...props
}) {
  return (
    <button className={` border-blue-500 hover:text-blue-600 text-blue-500 sm:px-5 font-semibold py-1.5  rounded-md ${className}`} {...props}>
      {children}
    </button>
  )
}

export default BorderedButton