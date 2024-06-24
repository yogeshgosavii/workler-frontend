import React from 'react'
import companyDefaultImage from '../assets/companyDefaultImage.png'

function CompanyDetails({companyName,reviewsCount,stars,tags,logo}) {
  return (
    <div className='flex border gap-5 px-4 py-3 cursor-pointer rounded-xl'>
        <img
        className={`h-20 max-w-20 rounded-lg  px-2 py-3`}
        alt="companyLogo"
        src={logo != null ? logo : companyDefaultImage}
        onError={(e) => {
            e.target.onerror = null; 
            e.target.src = companyDefaultImage; 
        }}
        />        
        <div>
            <p className='text-xl font-bold text-black '>{companyName}</p>
            <div className='flex text-sm items-center font-medium mt-2'>
                <svg class="h-4 w-4 text-yellow-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill='currentColor' stroke-linecap="round" stroke-linejoin="round">  <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" /></svg>
                <p className='mr-3 ml-2'>{stars}</p>
                <p className='border-l pl-3'>{reviewsCount} Reviews</p>
            </div>
            <div className='flex gap-3 mt-3'>
                {
                    tags.map((tag)=>{
                        return(
                            <p className=' cursor-pointer rounded-full px-3 text-sm py-0.5 border hover:bg-gray-100 text-gray-500'>{tag}</p>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default CompanyDetails