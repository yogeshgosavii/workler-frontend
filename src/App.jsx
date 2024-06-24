import React, { useState } from 'react';
import './App.css'; // Import Tailwind CSS
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const App = () => {
  
  return (
      <div className="flex h-screen flex-col justify-between text-gray-700   ">
        <Header/>
        <div className='flex-1 flex  px-5 mt-[80px] sm:px-10 py-5'>
          <Outlet/>
        </div>
        <Footer/>
      </div>
  );
};

export default App;
