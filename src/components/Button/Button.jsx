import React from 'react';

function Button({
    className = '',
    children,
    onClick,
    disabled = false,
    ...props
}) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`py-2 px-7 rounded-md font-semibold ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
