import React, { useEffect, useRef, useState } from "react";
import JobList from "../components/jobComponent/JobList";
import JobFilter from "../components/jobComponent/JobFilter";
import News from "../components/jobComponent/News";
import SearchInput from "../components/Input/SearchInput";
import searchService from "../services/searchService";
import { useParams } from "react-router-dom";

function Jobs({searchInputValue = useParams.jobQuery}) {
  const divRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [searchText, setSearchText] = useState(searchInputValue);
  const [jobList, setjobList] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const scrollTopValue = divRef.current.scrollTop;
        console.log("Scroll Top:", scrollTopValue);

        if (scrollTopValue <= 0) {
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
    <div className="flex flex-col overflow-y-auto w-full  gap-10">
      {searchFocus &&<div className="bg-black opacity-30 h-full w-full absolute">

      </div>}
      <div className="fixed z-40">
        <div className=" flex  w-screen sm:ml-8 px-10 justify-center sm:justify-start  left-0 relative mt-[3px]">
          <SearchInput
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onFocus={() => {
              setSearchFocus(true);
            }}
            onBlur={() => {
              setSearchFocus(false);
            }}
            inputClassName="placeholder:text-xl"
            className={` sticky transition-all  w-full  sm:max-w-sm  z-40  bg-white  caret-blue-500 scale-[65%]`}
            placeholder="Enter the job title or domain"
          />
          <div
            className={`border max-w-[90%] absolute rounded-md  w-full sm:max-w-md mx-10 mt-20 bg-white z-40 p-4 flex flex-col  ${
              !searchFocus && "hidden"
            }`}
          >
            {jobList.map((job, index, arr) => (
              <div
                className={`py-2.5 ${index != arr.length - 1 && "border-b"}`}
              >
                <p className="font-medium">{job.job_role}</p>
                <p className="text-gray-400">{job.company_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full mt-10 gap-10">
        <JobFilter />
        <JobList />
      </div>
      {/* <div className='hidden  md:block'>
          <News/>
        </div> */}
    </div>
  );
}

export default Jobs;
