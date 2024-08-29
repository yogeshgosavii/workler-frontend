import React, { useState, useRef } from 'react';
import Button from '../components/Button/Button';

function CompanyFilter() {
    const [currentSelectedFilter, setcurrentSelectedFilter] = useState(null);
    const [filters, setFilters] = useState([
        {
            filterName : "Company Type",
            filterList: [
            { name: "Foreign MNC", selected: false, opportunities: 120 },
            { name: "Indian MNC", selected: false, opportunities: 400 },
            { name: "Govt/PUS", selected: false, opportunities: 200 },
            { name: "MNC", selected: false, opportunities: 600 },
            { name: "Others", selected: false, opportunities: 20 }
            ],
        },
        {
            filterName : "Location",
            filterList : [
                { name: "Bangalore", selected: false, opportunities: 300 },
                { name: "Mumbai", selected: false, opportunities: 250 },
                { name: "Delhi", selected: false, opportunities: 180 }
            ]
        },
        {
            filterName : "Industry",
            filterList : [
                { name: "Technology", selected: false, opportunities: 700 },
                { name: "Finance", selected: false, opportunities: 500 },
                { name: "Healthcare", selected: false, opportunities: 300 }
            ]
        }
    ]);

    const [showFilter, setShowFilter] = useState(false);
    const filtersRef = useRef(null);

    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

    const clearFilters = ()=>{
        const currentfilters = [...filters]
        currentfilters.map((filter)=>{
            filter.filterList.map((filterItem)=>{
                filterItem.selected = false
            })
        })
        setFilters(currentfilters)
    }

    const handleCheckboxChange = (filterName, index) => {
        const updatedFilters = [...filters];
        const filterToUpdate = updatedFilters.find(filter => filter.filterName === filterName);
        console.log(filterToUpdate,index);
        if (filterToUpdate) {
            filterToUpdate.filterList[index].selected = !filterToUpdate.filterList[index].selected;
        }
        setFilters(updatedFilters);
    };

    return (
        <div>
            <div className='flex gap-3 items-center sm:hidden'>
                <svg onClick={toggleFilter} className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <div className='flex gap-3 max-w-72 overflow-auto' style={{ scrollbarWidth: "none" }}>
                    {
                        filters.map((filter)=>{
                            return(
                                <p onClick={()=>{setcurrentSelectedFilter(filter);toggleFilter()}} className='border rounded-full px-2 py-1 w-fit text-nowrap'>{filter.filterName}</p>
                            )
                        })
                    }
                </div>
            </div>
            <div className=''>
                <div className='border sticky top-24 bottom-0 hidden sm:block rounded-lg min-w-60 px-6 py-8' ref={filtersRef}>
                    <p className='border-b pb-5 text-lg font-semibold'>Filters</p>
                    {
                        filters.map((filter)=>{
                           return(
                            <div className='mt-5 pb-8 border-b'>
                                <p className='text-lg font-semibold'>{filter.filterName}</p>
                                <div className='space-y-2 mt-5'>
                                    {filter.filterList.map((filterItem, index) => (
                                        <div key={index} className='flex gap-3'>
                                          <input
                                            id={`${filter.filterName}-${index}`}
                                            type='checkbox'
                                            onChange={() => handleCheckboxChange(filter.filterName, index)} // Pass filterName instead of filterItem
                                            checked={filterItem.selected}
                                            />
                                            <label htmlFor={`${filterItem+index}`} className='font-medium text-nowrap'>{filterItem.name}</label>
                                            <p className='text-gray-400'>({filterItem.opportunities})</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                           )
                        })
                    }
                   
                </div>
            </div>
            <div className="sm:hidden ">
                
                {showFilter && (
                    <div onClick={toggleFilter} className="fixed bottom-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
                )}
                <div className={`fixed bottom-0 left-0 w-full h-3/4 bg-white shadow-md transition-transform transform ${showFilter ? 'translate-y-0' : 'translate-y-full'} z-20`}>
                    <div className='flex px-5 border-b py-4 justify-between items-center'>
                        <p className=' text-xl font-semibold'>Filters</p>
                        <Button onClick={clearFilters} className={"bg-blue-500 text-white"}>Clear filter</Button>
                    </div>
                    <div className='flex h-full'>
                        <div className='border-r h-full'>
                        {
                            filters.map((filter)=>{
                                return(
                                    <p onClick={()=>{setcurrentSelectedFilter(filter)}} className={`px-5 py-3 ${filter.filterName == currentSelectedFilter?.filterName?"bg-gray-100":null}`}>{filter.filterName}</p>
                                )
                            })
                        }
                        </div>
                        <div className='space-y-2 mt-5'>
                            {currentSelectedFilter?.filterList.map((filter, index) => (
                                <div key={index} className='flex gap-3 w-full pl-5'>
                                    <input
                                        id={`${filter.filterName}-${index}`}
                                        type='checkbox'
                                        onChange={() => handleCheckboxChange(currentSelectedFilter.filterName, index)} // Pass filter name instead of the filter object
                                        checked={filter.selected}
                                    />
                                        <label htmlFor={`${currentSelectedFilter.filterName}-${index}`} className='font-medium text-nowrap'>{filter.name}</label>
                                    <p className='text-gray-400'>({filter.opportunities})</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyFilter;
