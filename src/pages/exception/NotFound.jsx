// src/components/NotFound.js

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <img width={"1000px"} className='' src={"https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"}/>
      <p className="text-lg text-gray-600 font-medium">Page Not Found</p>
      <Link to="/" className="mt-2 font-medium text-blue-500">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
