import React, { useEffect, useState } from 'react';
import SearchInput from './components/Input/SearchInput';
import Button from './Button/Button';

function MiddleContainer() {
    const professions = [
        "Accountant",
        "Actor",
        "Architect",
        "Artist",
        "Author",
        "Baker",
        "Barber",
        "Bartender",
        "Biologist",
        "Botanist",
        "Carpenter",
        "Chef",
        "Chiropractor",
        "Dentist",
        "Doctor",
        "Electrician",
        "Engineer",
        "Farmer",
        "Firefighter",
        "Fisherman",
        "Flight Attendant",
        "Gardener",
        "Graphic Designer",
        "Hairdresser",
        "Historian",
        "Journalist",
        "Lawyer",
        "Librarian",
        "Mathematician",
        "Mechanic",
        "Musician",
        "Nurse",
        "Painter",
        "Photographer",
        "Physicist",
        "Pilot",
        "Plumber",
        "Police Officer",
        "Professor",
        "Psychologist",
        "Scientist",
        "Sculptor",
        "Singer",
        "Surgeon",
        "Teacher",
        "Translator",
        "Veterinarian",
        "Waiter / Waitress",
        "Writer"
      ];
      
      const domains = [
        "Accounting",
        "Agriculture",
        "Architecture",
        "Art",
        "Astronomy",
        "Biology",
        "Chemistry",
        "Commerce",
        "Computer Science",
        "Dentistry",
        "Economics",
        "Education",
        "Engineering",
        "Environment",
        "Finance",
        "Geography",
        "Geology",
        "History",
        "Law",
        "Linguistics",
        "Literature",
        "Mathematics",
        "Medicine",
        "Music",
        "Nursing",
        "Philosophy",
        "Physics",
        "Political Science",
        "Psychology",
        "Sociology",
        "Statistics",
        "Theology",
        "Tourism",
        "Veterinary"
      ];

      const topCompanies = [
        {
            image : "https://driver-media-assets.swiggy.com/drivers/q_auto,f_auto,fl_lossy,c_fill/ride-with-us/icons/logo-home.png",
            name : "Swiggy",
            description : "Food delivery and online ordering platform."
        },
        {
            image : "https://apna.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fmumbai_apnatime_prod%2Fapna-home%2Fcompanies%2Fic-paytm.png&w=1920&q=75",
            name : "Paytm",
            description : "Digital payment and e-commerce facilitator."
        },
        {
            image : "https://apna.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fmumbai_apnatime_prod%2Fapna-home%2Fcompanies%2Fdunzo.png&w=1920&q=75",
            name : "Dunzo",
            description : "On-demand delivery service provider."
        },
        {
            image : "https://apna.co/_next/image?url=https%3A%2F%2Fapna-organization-logos.gumlet.io%2Fproduction%2F322333%3Fw%3D128&w=1920&q=75",
            name : "Zomato",
            description : "Online food delivery marketplace."
        },{
            image : "https://apna.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fmumbai_apnatime_prod%2Fapna-home%2Fcompanies%2Fzepto.png&w=1920&q=75",
            name: "Zepto",
            description : "Delivery and logistics services facilitator."
        },
      ]
    return (
        <div className='w-full px-5 sm:px-10 py-5'>
            <div className='mt-40'>
                <p className='text-blue-500 font-bold text-xl'>#BEST HELP</p>
                <p className=''>Search your dream job here</p>
                <p className='text-xl text-gray-400 font-semibold mt-2'>Lets get your career started right away</p>
                <SearchInput inputClassName={"placeholder:text-xl"} className={"mt-8 max-w-screen-md shadow-xl caret-blue-500"} placeholder={"Enter the job title or domain"}/>
            </div>
           <div className='mt-32'>
                <p className='text-3xl font-bold  flex '>Professions</p>
                <div className='flex mt-5 text-lg gap-5   overflow-scroll' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none', '::-webkit-scrollbar': { display: 'none' } }}>
                    {professions.map((profession, index) => (
                        <div key={index} className='bg-gray-200 border border-gray-300 hover:bg-gray-300 cursor-pointer text-nowrap w-full text-gray-500 px-6 py-1 rounded-full'>
                            {profession}
                        </div>
                    ))}
                </div>
                <p className='text-3xl font-bold  mt-8 flex '>Domains</p>
                <div className='flex mt-5 gap-5 text-lg  overflow-scroll' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none', '::-webkit-scrollbar': { display: 'none' } }}>
                    {domains.map((profession, index) => (
                        <div key={index} className='bg-gray-200 border border-gray-300 hover:bg-gray-300 cursor-pointer text-nowrap w-full text-gray-500 px-6 py-1 rounded-full'>
                            {profession}
                        </div>
                    ))}
                </div>
           </div>
           <div className='sm:text-center mt-24'>
            <p className='text-4xl font-bold'>Top Companies Listed</p>
            <div className=' mt-8 sm:mt-20 -ml-5 sm:-ml-10 -mr-5 sm:-mr-10  flex overflow-x-scroll gap-5 px-5 py-10 ' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none', '::-webkit-scrollbar': { display: 'none' } }}>
                {
                    topCompanies.map((topCompany)=>{
                       return(
                        <div className=' flex flex-col border justify-between p-8 rounded-lg transform ease-in-out hover:shadow-xl cursor-pointer min-w-72  aspect-auto  w-1/3'>
                            <div>
                                <img className='max-h-14 max-w-40' src={topCompany.image} alt={topCompany.name} />
                                <div className='text-left mt-6'>
                                    <div>
                                        <p className='text-xl font-semibold'>{topCompany.name}</p>
                                        <p className='text-gray-500 mt-2 leading-tight'>{topCompany.description}</p>
                                    </div>
                                </div>
                            </div>
                            <Button className={"mt-6 pr-3  w-fit flex justify-between items-center border gap-5 "}>
                                Apply
                                <svg class="h-8 w-8  text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polyline points="9 18 15 12 9 6" /></svg>
                            </Button>
                        </div>
                        )
                    })
                }
            </div>
           </div>
        </div>
    );
}

export default MiddleContainer;
