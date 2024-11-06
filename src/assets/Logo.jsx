import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo_orange.png"


function Logo({className}) {
  return (
    <>
        <Link to={"/"} className={`font-bold cursor-pointer text-gray-800 border-2  border-gray-800 text-2xl px-4 py-1.5 rounded-lg text-center align-middle hidden sm:block bg-amber-400 ${className}`}><p className='-mt-1'>Workler</p></Link>
        <Link to={"/"} className={`font-bold cursor-pointer  w-fit aspect-square flex items-center justify-center text-blue-600 text-2xl text-center sm:hidden  rounded-full size-10 my-1  ${className}`}>
        <img
        className=''
        src={logo}
        />
        </Link>
    </>
    
  );
}

export default Logo;
