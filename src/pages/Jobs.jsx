import React, { useEffect, useRef, useState } from "react";
import JobList from "../components/jobComponent/JobList";
import JobFilter from "../components/jobComponent/JobFilter";
import News from "../components/jobComponent/News";
import SearchInput from "../components/Input/SearchInput";
import searchService from "../services/searchService";
import { useNavigate, useParams } from "react-router-dom";

function Jobs() {
  const { jobQuery } = useParams(); // Grabbing job query from params
  const searchRef = useRef(null);
  const [searchText, setSearchText] = useState(jobQuery || ""); // Initialize from params
  const [submitText, setSubmitText] = useState(jobQuery || "");
  const [jobList, setJobList] = useState([]);
  const [submitJobList, setSubmitJobList] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex flex-col  w-full gap-10">
      {searchFocus && (
        <div className="bg-black opacity-30 h-full sm:-ml-6 w-full absolute"></div>
      )}

      {/* Search Input Section */}
      <div className="fixed z-40">
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-screen sm:ml-8 px-10 justify-center sm:justify-start left-0 relative -mt-4"
        >
          <SearchInput
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            ref={searchRef}
            inputClassName="placeholder:text-xl"
            className="sticky transition-all w-full sm:max-w-md z-40 bg-white caret-blue-500 scale-[65%]"
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
      <div className="flex gap-6">
        {/* Left Sidebar (JobFilter) */}
        <div className="flex justify-center px-4 sm:px-0 w-full pt-20 sm:pt-24 pb-10 sm:gap-10">
          <div className=" pb-10 fixed max-h-[85%] w-full sm:w-fit overflow-y-auto  sm:left-5 top-[58px] sm:top-24 pt-4">
            <JobFilter />
          </div>
          <JobList jobs={submitJobList} />
        </div>

        {/* Right News Section */}
        <div className="hidden md:block">
          <News />
        </div>
      </div>
    </div>
  );
}

export default Jobs;
