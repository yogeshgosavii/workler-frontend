import React, { useState } from 'react';

function JobFilter() {
    // State for company type filter
    const [companyTypeFilter, setCompanyTypeFilter] = useState([
        {
            name: "Foreign MNC",
            selected: false,
            opportunities: 120
        },
        {
            name: "Indian MNC",
            selected: false,
            opportunities: 400
        },
        {
            name: "Govt/PUS",
            selected: false,
            opportunities: 200
        },
        {
            name: "MNC",
            selected: false,
            opportunities: 600
        },
        {
            name: "Others",
            selected: false,
            opportunities: 20
        },
    ]);

    // State for location filter
    const [locationFilter, setLocationFilter] = useState([
        {
            name: "Bangalore",
            selected: false,
            opportunities: 300
        },
        {
            name: "Mumbai",
            selected: false,
            opportunities: 250
        },
        {
            name: "Delhi",
            selected: false,
            opportunities: 180
        },
        // Add more locations as needed
    ]);

    // State for experience filter
    const [experienceFilter, setExperienceFilter] = useState([
        {
            name: "0-2 years",
            selected: false,
            opportunities: 400
        },
        {
            name: "2-5 years",
            selected: false,
            opportunities: 600
        },
        {
            name: "5+ years",
            selected: false,
            opportunities: 800
        },
        // Add more experience ranges as needed
    ]);

    // State for industry filter
    const [industryFilter, setIndustryFilter] = useState([
        {
            name: "Technology",
            selected: false,
            opportunities: 700
        },
        {
            name: "Finance",
            selected: false,
            opportunities: 500
        },
        {
            name: "Healthcare",
            selected: false,
            opportunities: 300
        },
        // Add more industries as needed
    ]);

    return (
        <div className='border sticky top-24 hidden h-fit sm:block rounded-lg  px-6 py-8'>
            <p className='border-b pb-5 text-lg font-semibold'>Filters</p>
            {/* Company type filter */}
            <div className='mt-5 pb-8 border-b'>
                <p className='text-lg font-semibold '>Company type</p>
                <div className='space-y-2 mt-5'>
                    {companyTypeFilter.map((companyType, index) => (
                        <div key={index} className='flex gap-3'>
                            <input
                                id={index}
                                type='checkbox'
                                onChange={() => {
                                    const updatedCompanyTypeFilter = [...companyTypeFilter];
                                    updatedCompanyTypeFilter[index].selected = !updatedCompanyTypeFilter[index].selected;
                                    setCompanyTypeFilter(updatedCompanyTypeFilter);
                                }}
                                checked={companyType.selected}
                            />
                            <label htmlFor={index} className='font-medium text-nowrap'>{companyType.name}</label>
                            <p className='text-gray-400'>({companyType.opportunities})</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Location filter */}
            <div className='mt-8 pb-8 border-b'>
                <p className='text-lg font-semibold'>Location</p>
                <div className='space-y-2 mt-5'>
                    {locationFilter.map((location, index) => (
                        <div key={index} className='flex gap-3'>
                            <input
                                type='checkbox'
                                onChange={() => {
                                    const updatedLocationFilter = [...locationFilter];
                                    updatedLocationFilter[index].selected = !updatedLocationFilter[index].selected;
                                    setLocationFilter(updatedLocationFilter);
                                }}
                                checked={location.selected}
                            />
                            <p className='font-medium'>{location.name}</p>
                            <p className='text-gray-400'>({location.opportunities})</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Experience filter */}
            <div className='mt-8 pb-8 border-b'>
                <p className='text-lg font-semibold'>Experience</p>
                <div className='space-y-2 mt-5'>
                    {experienceFilter.map((experience, index) => (
                        <div key={index} className='flex gap-3'>
                            <input
                                type='checkbox'
                                onChange={() => {
                                    const updatedExperienceFilter = [...experienceFilter];
                                    updatedExperienceFilter[index].selected = !updatedExperienceFilter[index].selected;
                                    setExperienceFilter(updatedExperienceFilter);
                                }}
                                checked={experience.selected}
                            />
                            <p className='font-medium'>{experience.name}</p>
                            <p className='text-gray-400'>({experience.opportunities})</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Industry filter */}
            <div className='mt-8'>
                <p className='text-lg font-semibold'>Industry</p>
                <div className='space-y-2 mt-5'>
                    {industryFilter.map((industry, index) => (
                        <div key={index} className='flex gap-3'>
                            <input
                                type='checkbox'
                                onChange={() => {
                                    const updatedIndustryFilter = [...industryFilter];
                                    updatedIndustryFilter[index].selected = !updatedIndustryFilter[index].selected;
                                    setIndustryFilter(updatedIndustryFilter);
                                }}
                                checked={industry.selected}
                            />
                            <p className='font-medium'>{industry.name}</p>
                            <p className='text-gray-400'>({industry.opportunities})</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default JobFilter;
