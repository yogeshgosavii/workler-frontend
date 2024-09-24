import React from 'react';
import { Link } from 'react-router-dom';

function LogoCircle() {
  return (
    <>
        <Link to={"/"} className='font-bold cursor-pointer p-2 px-3  aspect-square flex items-center justify-center text-blue-600 text-2xl text-center  sm:hidden rounded-full bg-blue-50'>W</Link>

    </>
    
  );
}

export default LogoCircle;
