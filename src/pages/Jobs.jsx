import React, { useEffect, useRef, useState } from "react";
import JobList from "../components/jobComponent/JobList";
import JobFilter from "../components/jobComponent/JobFilter";
import News from "../components/jobComponent/News";
import SearchInput from "../components/Input/SearchInput";
import searchService from "../services/searchService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useJobApi from "../services/jobService";

function Jobs() {
  const { jobQuery } = useParams(); // Grabbing job query from params
  const searchRef = useRef(null);
  const [searchText, setSearchText] = useState(jobQuery || ""); // Initialize from params
  const [submitText, setSubmitText] = useState(jobQuery || "");
  const [jobList, setJobList] = useState([]);
  const [submitJobList, setSubmitJobList] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setfilters] = useState("");
  const navigate = useNavigate();
  const jobService = useJobApi();
  const [jobsRefersh, setJobsRefersh] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fetch jobs based on search text
  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     setLoading(true)
  //     try {
  //       const jobs = await searchService.secrchJobByKeyword(searchText);
  //       setJobList(jobs);
  //     } catch (error) {
  //       console.error("Error fetching jobs: ", error);
  //     }
  //     finally{
  //       setLoading(false)
  //     }
  //   };
  //   if (searchText) {
  //     fetchJobs();
  //   }
  // }, [searchText]);
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        if (searchText) {
          const jobs = await searchService.secrchJobByKeyword(searchText+" "+filters);
          setSubmitJobList(jobs);
        } else {
          const jobs = await jobService.job.getAll();
          console.log("logo", jobs[0].company_logo);

          setSubmitJobList(jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [filters]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    navigate("/jobs/" + searchText); // Navigate to the URL with search text
    // setSubmitText(searchText);
  };

  const joblistSkeleton = () => {
    return (
      <div className=" flex flex-col gap-6 w-full mb-10 animate-pulse">
        {[1,2,3].map((job) => (
          <div className="py-6 border-y sm:border sm:rounded-xl">
            <div className="px-6 flex gap-2">
              <div className="h-14 w-16 rounded-md bg-gray-100"></div>
              <div className=" w-full justify-center flex flex-col gap-2">
                <div className="h-5 w-1/2 bg-gray-100 rounded-full"></div>
                <div className="h-4 w-1/3 bg-gray-100 rounded-full"></div>
              </div>
            </div>
            <div className="flex w-full gap-3 mt-5 px-6">
              <div className="h-6 w-1/4 bg-gray-100 rounded-md "></div>
              <div className="h-6 w-1/4 bg-gray-100 rounded-md "></div>
            </div>
            <div className=" w-full border-t mt-5"></div>
            <div className="mt-6 flex px-6 justify-between">
              <div className="h-7 w-1/3 bg-gray-100 rounded-full"></div>
              <div className="h-8 w-8 rounded-full bg-gray-100"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex flex-col bg-gray-50  w-full  gap-10`}>
      {searchFocus && (
        <div className={`bg-black z-10 opacity-30 h-full ${isAuthenticated &&"sm:-ml-20"} w-full absolute`}></div>
      )}

      {/* Search Input Section */}
      <div className="fixed  z-40">
        <form
          onSubmit={handleSearchSubmit}
          className={`flex w-screen  ${
            !isAuthenticated && "sm:max-w-lg"
          }   justify-center  sm:justify-start py-3  ${
            isAuthenticated ? "  bg-gray-50" : "bg-transparent"
          } px-4 sm:px-0 ${
            !isAuthenticated ? "sm:ml-44" : "sm:ml-8 ml-0"
          }   left-0 relative `}
        >
          <SearchInput
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            ref={searchRef}
            inputClassName=""
            className={`sticky px-4 rounded-xl transition-all ${isAuthenticated &&"sm:shadow-md "} sm:ml-0   sm:max-w-[250px] flex items-center md:max-w-[350px] lg:max-w-md z-10 bg-white w-full ${
              !isAuthenticated ? "w-[100%] mt-1" : ""
            } caret-blue-500 h-12  `}
            placeholder="Enter the job title or domain"
          />
          {/* <div
            className={`border max-w-[90%] absolute rounded-md w-full sm:max-w-md mx-10 mt-20 bg-white z-40  flex flex-col ${
              !searchFocus && "hidden"
            }`}
          >
            {jobList.map((job, index, arr) => (
              <div
                key={index}
                className={`py-2.5 ${index != arr.length - 1 && "border-b"}`}
              >
                <p className="font-medium">{job.job_role}</p>
                <p className="text-gray-400">{job.company_name}</p>
              </div>
            ))}
          </div> */}
        </form>
      </div>

      {/* Main Content Section */}
      {/* <p className="mt-40 text-xl text-black z-40">loagin</p> */}
      <div className="flex gap-6 ">
        {/* Left Sidebar (JobFilter) */}
        <div
          className={`flex justify-center overflow-x-hidden  mr- sm:mr-6 md:mr-0 sm:px-0 w-full mt-4 ${
            isAuthenticated ? " pt-16" : " sm:ml-9 pt-16 sm:pt-24"
          } sm:pr-10 pb-10 sm:gap-10`}
        >
          <div
            style={{ scrollbarWidth: "none" }}
            className={` pb-10 fixed max-h-[85%] w-full sm:w-fit overflow-y-auto z-20  ${
              isAuthenticated
                ? "sm:left-24 top-[45px] sm:top-16 "
                : "left-0 sm:left-8 top-[40px] sm:top-24"
            } pt-4 `}
          >
            <JobFilter filterText={filters} setfilterText={setfilters} />
          </div>

          {loading ? (
            <div className=" sm:ml-[321px] mt-20 sm:mt-0 w-full">{joblistSkeleton()}</div>
          ) : (
            <JobList jobs={submitJobList} />
          )}
        </div>

        {/* Right News Section */}
        <div
          className={`hidden lg:block mr-6 mt-5 ${!isAuthenticated && "mt-24"}`}
        >
          <News />
        </div>
      </div>
    </div>
  );
}

export default Jobs;
