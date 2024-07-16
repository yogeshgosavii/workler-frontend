import React from 'react';
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <>
        <Link to={"/"} className='font-bold cursor-pointer text-blue-600 text-2xl px-4 py-1 rounded-lg text-center align-middle hidden sm:block bg-blue-50'>Workler</Link>
        <Link to={"/"} className='font-bold cursor-pointer h-14 w-14 aspect-square flex items-center justify-center text-blue-600 text-2xl px-4 text-center  sm:hidden bg-blue-50 rounded-full py-3'>W</Link>

    </>
    
  );
}

export default Logo;
