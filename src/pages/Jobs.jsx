import React, { useEffect, useRef, useState } from "react";
import JobList from "../components/jobComponent/JobList";
import JobFilter from "../components/jobComponent/JobFilter";
import News from "../components/jobComponent/News";
import SearchInput from "../components/Input/SearchInput";
import searchService from "../services/searchService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Jobs() {
  const { jobQuery } = useParams(); // Grabbing job query from params
  const searchRef = useRef(null);
  const [searchText, setSearchText] = useState(jobQuery || ""); // Initialize from params
  const [submitText, setSubmitText] = useState(jobQuery || "");
  const [jobList, setJobList] = useState([]);
  const [submitJobList, setSubmitJobList] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fetch jobs based on search text
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await searchService.secrchJobByKeyword(searchText);
        setJobList(jobs);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      }
    };
    if (searchText) {
      fetchJobs();
    }
  }, [searchText]);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await searchService.secrchJobByKeyword(searchText);
        setSubmitJobList(jobs);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      }
    };
    if (searchText) {
      fetchJobs();
    }
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    navigate("/jobs/" + searchText); // Navigate to the URL with search text
    // setSubmitText(searchText);
  };

  return (
    <div className={`flex flex-col  w-full  gap-10`}>
      {searchFocus && (
        <div className="bg-black z-10 opacity-30 h-full sm:-ml-6 w-full absolute"></div>
      )}

      {/* Search Input Section */}
      <div className="fixed z-40">
        <form
          onSubmit={handleSearchSubmit}
          className={`flex w-screen justify-center sm:justify-start py-3 ${isAuthenticated ?"bg-white":"bg-transparent"} px-4 sm:px-0 ${!isAuthenticated ?"sm:ml-36":"ml-0"}   left-0 relative -mt-5`}
        >
          <SearchInput
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            ref={searchRef}
            inputClassName="placeholder:text-xl"
            className={`sticky transition-all  sm:max-w-[250px] flex items-center md:max-w-[350px] lg:max-w-md z-10 bg-white w-full ${!isAuthenticated && "w-[61%]"} caret-blue-500 h-12  `}
            placeholder="Enter the job title or domain"
          />
          <div
            className={`border max-w-[90%] absolute rounded-md w-full sm:max-w-md mx-10 mt-20 bg-white z-40 p-4 flex flex-col ${
              !searchFocus && "hidden"
            }`}
          >
            {jobList.map((job, index,arr) => (
              <div key={index} className={`py-2.5 ${index!= arr.length-1 && "border-b"}`}>
                <p className="font-medium">{job.job_role}</p>
                <p className="text-gray-400">{job.company_name}</p>
              </div>
            ))}
          </div>
        </form>
      </div>

      {/* Main Content Section */}
      <div className="flex gap-6 ">
        {/* Left Sidebar (JobFilter) */}
        <div className={`flex justify-center px-4 sm:px-0 w-full ${isAuthenticated?" pt-16":"pt-16 sm:pt-24"} pb-10 sm:gap-10`}>
          <div className={` pb-10 fixed max-h-[85%] w-full sm:w-fit overflow-y-auto  ${isAuthenticated ? "sm:left-24 top-[45px] sm:top-16 ":"left-0 sm:left-8 top-[52px] sm:top-24"} pt-5 `}>
            <JobFilter />
          </div>
          <JobList jobs={submitJobList} />
        </div>

        {/* Right News Section */}
        <div className={`hidden md:block ${!isAuthenticated && "mt-24"}`}>
          <News />
        </div>
      </div>
    </div>
  );
}

export default Jobs;
