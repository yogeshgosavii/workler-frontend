import React from 'react';
import { Link } from 'react-router-dom';

function Logo({className}) {
  return (
    <>
        <Link to={"/"} className={`font-bold cursor-pointer text-blue-600 text-2xl px-4 py-1 rounded-lg text-center align-middle hidden sm:block bg-blue-50 ${className}`}>Workler</Link>
        <Link to={"/"} className={`font-bold cursor-pointer p-2 px-3  aspect-square flex items-center justify-center text-blue-600 text-2xl text-center  sm:hidden rounded-full bg-blue-50`}>W</Link>

    </>
    
  );
}

export default Logo;
