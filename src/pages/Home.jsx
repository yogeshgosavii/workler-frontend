import React, { useEffect, useRef, useState } from "react";
import SearchInput from "../components/Input/SearchInput";
import Button from "../components/Button/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import searchService from "../services/searchService";

function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);



  const divRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [jobList, setjobList] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const scrollTopValue = divRef.current.scrollTop;
        console.log("Scroll Top:", scrollTopValue);

        if (scrollTopValue <= 230) {
          setIsAtTop(true);
          console.log("At top");
        } else {
          setIsAtTop(false);
          console.log("Not at top");
        }
      }
    };

    const scrollableDiv = divRef.current;

    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await searchService.secrchJobByKeyword(searchText);
        console.log(jobs);
        setjobList(jobs);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      }
    };

    if (searchText) {
      fetchJobs();
    }
   
  }, [searchText]);

  return (
    <div className="w-full px-4 sm:px-8  h-full py-10 overflow-y-auto" ref={divRef}>
      {/* Header section */}
      <div className="mt-36 ">
        <p className="text-blue-500 font-bold text-xl">#BEST HELP</p>
        <p className="text-4xl md:text-5xl text-black font-bold mt-5 leading-[48px] md:leading-[55px]">
          Search your dream job here
        </p>
        <p className="text-xl text-gray-400 font-medium md:font-semibold mt-2">
          Let's get your career started right away
        </p>
      </div>

      {/* Sticky Search Input */}
      <form onSubmit={(e)=>{
        e.preventDefault()
        navigate("/jobs/"+searchText)
        console.log("Hello");
      }} className=" sticky -top-9 z-40">
      <SearchInput
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        onFocus = {()=>{setSearchFocus(true)}}
        onBlur = {()=>{setSearchFocus(false)}}
        inputClassName="placeholder:text-xl"
        className={`mt-8 sticky transition-all  border  max-w-screen-md bg-white ${
          isAtTop && "shadow-xl"
        } caret-blue-500 ${isAtTop ? "scale-[100%]" : "scale-[65%]"}`}
        placeholder="Enter the job title or domain"
      />
      <div className={`border w-full absolute max-h-60 overflow-y-auto rounded-md max-w-screen-md mt-5 bg-white z-40 p-4 flex flex-col  ${!searchFocus && "hidden"}`}>
        {jobList.map((job, index,arr) => (
          <div className={`py-2.5 ${(index!=arr.length-1) && "border-b"}`}>
            <p className="font-medium">{job.job_role}</p>
            <p className="text-gray-400">{job.company_name}</p>
          </div>
        ))}
      </div>
      </form>

      {/* Professions section */}
      {/* <div className='mt-32'>
                <p className='text-3xl font-bold'>Professions</p>
                <div className='flex mt-5 text-lg gap-5 overflow-x-scroll scrollbar-hide'>
                    {professions.map((profession, index) => (
                        <div key={index} className='bg-gray-200 border border-gray-300 hover:bg-gray-300 cursor-pointer text-nowrap w-full text-gray-500 px-6 py-1 rounded-full'>
                            {profession}
                        </div>
                    ))}
                </div>

                <p className='text-3xl font-bold mt-8'>Domains</p>
                <div className='flex mt-5 gap-5 text-lg overflow-x-scroll scrollbar-hide'>
                    {domains.map((domain, index) => (
                        <div key={index} className='bg-gray-200 border border-gray-300 hover:bg-gray-300 cursor-pointer text-nowrap w-full text-gray-500 px-6 py-1 rounded-full'>
                            {domain}
                        </div>
                    ))}
                </div>
            </div> */}

      {/* Top Companies section */}
      {/* <div className='sm:text-center mt-24'>
                <p className='text-4xl font-bold'>Top Companies Listed</p>
                <div className='mt-8 sm:mt-14 flex overflow-x-scroll gap-5 px-5 py-10 scrollbar-hide'>
                    {topCompanies.map((topCompany, index) => (
                        <div key={index} className='flex flex-col transition duration-300 ease-in-out transform hover:scale-110 border justify-between p-8 rounded-lg hover:shadow-xl cursor-pointer min-w-72 aspect-auto w-1/3'>
                            <div>
                                <img className='max-h-14 max-w-40' src={topCompany.image} alt={topCompany.name} />
                                <div className='text-left mt-6'>
                                    <p className='text-xl font-semibold'>{topCompany.name}</p>
                                    <p className='text-gray-500 mt-2 leading-tight'>{topCompany.description}</p>
                                </div>
                            </div>
                            <Button className="mt-6 pr-3 hover:bg-blue-50 hover:border-blue-500 text-blue-500 w-fit flex justify-between items-center border-2 gap-5">
                                Apply
                                <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </Button>
                        </div>
                    ))}
                </div>
            </div> */}

      <p
        className="text-2xl font-bold mt-24
            "
      >
        How it works
      </p>
      <div style={{scrollbarWidth:"0px",scroll}} className="overflow-x-auto  flex gap-4 mt-5">
      <style>
    {`
      div::-webkit-scrollbar {
        display: none; /* Hides scrollbar in WebKit browsers */
      }
    `}
  </style>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">
            Create an account
          </p>
          <p>Create an account with your details and motive</p>
          <p className="text-blue-500">Create account</p>
        </div>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">
            Explore content
          </p>
          <p>
            Explore jobs and create connections with people increase chances
          </p>
        </div>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">Posts</p>
          <p>
            Post jobs your hear about and about other achivements you achive
          </p>
        </div>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">Explorer</p>
          <p>You can also explorer basic features with creating an account</p>
        </div>
      </div>

      {/* <p
        className="text-2xl font-bold mt-16 
            "
      >
        How it works
      </p>
      <div className="overflow-x-auto flex gap-4 mt-5">
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">
            Create an account
          </p>
          <p>Create an account with your details and motive</p>
          <p className="text-blue-500">Create account</p>
        </div>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">
            Explore content
          </p>
          <p>
            Explore jobs and create connections with people increase chances
          </p>
        </div>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">Posts</p>
          <p>
            Post jobs your hear about and about other achivements you achive
          </p>
        </div>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">Explorer</p>
          <p>You can also explorer basic features with creating an account</p>
        </div>
      </div>
      <p
        className="text-2xl font-bold mt-16 
            "
      >
        How it works
      </p>
      <div className="overflow-x-auto flex gap-4 mt-5">
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">
            Create an account
          </p>
          <p>Create an account with your details and motive</p>
          <p className="text-blue-500">Create account</p>
        </div>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">
            Explore content
          </p>
          <p>
            Explore jobs and create connections with people increase chances
          </p>
        </div>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">Posts</p>
          <p>
            Post jobs your hear about and about other achivements you achive
          </p>
        </div>
        <div className="border min-w-52  sm:min-w-60 text-gray-400 p-4 rounded-lg">
          <p className="font-medium text-xl text-gray-500 mb-1">Explorer</p>
          <p>You can also explorer basic features with creating an account</p>
        </div>
      </div> */}
    </div>
  );
}

export default Home;
