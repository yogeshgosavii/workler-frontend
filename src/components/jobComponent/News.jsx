import React from 'react';
import { useSelector } from 'react-redux';

function News() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className={`max-w-64 lg:max-w-full  rounded-lg border bg-white shadow-lg  sticky ${isAuthenticated?"top-20":"top-28" }`} >
      <div className=' px-6 py-4 cursor-pointer'>
        <p className='text-blue-500 font-bold text-lg'>Wrokler Ads</p>
        <p className='font-semibold mt-2'>Board to show ads on workler platform</p>
        <p className='text-sm text-gray-400'>To show ads on the workler ad board reach out at below to get started</p>
        <p onClick={()=>{window.open("mailto:yogeshgosavif8@gmail.com")}} className='text-blue-500 font-medium mt-1 text-sm hover:text-blue-600'>Reach out</p>
      </div>
    </div>
  );
}

export default News;
