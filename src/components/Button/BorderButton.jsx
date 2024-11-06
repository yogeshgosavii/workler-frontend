import React from 'react'

function BorderedButton({
    className,
    children,
    bordercolor = "blue-600",
    ...props
}) {
  return (
    <button className={` text-gray-800 sm:px-5 font-medium py-1.5  rounded-md ${className}`} {...props}>
      {children}
    </button>
  )
}

export default BorderedButton