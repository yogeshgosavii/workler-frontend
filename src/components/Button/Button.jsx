import React from 'react';


function Button({
    className,
    children,
    ...props
    }) {

  return (
    <button disabled={true} className={`   py-2 px-7 rounded-md font-semibold  ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
