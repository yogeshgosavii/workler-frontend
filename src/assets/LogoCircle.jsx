import React from 'react';
import { Link } from 'react-router-dom';

function LogoCircle({className}) {
  return (
    <>
        <Link to={"/"} className={`font-bold cursor-pointer p-2 px-3 w-fit aspect-square flex items-center justify-center text-blue-600 text-2xl text-center   rounded-full bg-blue-50 ${className}`}>W</Link>

    </>
    
  );
}

export default LogoCircle;
