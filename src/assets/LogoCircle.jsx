import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo_orange.png"

function LogoCircle({className}) {
  return (
    <>
        <Link to={"/"} className={`font-bold cursor-pointer  w-fit aspect-square flex items-center justify-center text-blue-600 text-2xl text-center   rounded-full size-10  ${className}`}>
        <img
        className=''
        src={logo}
        />
        </Link>

    </>
    
  );
}

export default LogoCircle;
