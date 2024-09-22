import React from 'react';
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <>
        <Link to={"/"} className='font-bold cursor-pointer text-blue-600 text-2xl px-4 py-1 rounded-lg text-center align-middle hidden sm:block bg-blue-50'>Workler</Link>
        <Link to={"/"} className='font-bold cursor-pointer h-12  w-12   aspect-square flex items-center justify-center text-blue-600 text-2xl text-center  sm:hidden rounded-full bg-blue-50'>W</Link>

    </>
    
  );
}

export default Logo;
