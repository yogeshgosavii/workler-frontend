import React, { useEffect, useRef, useState, useCallback } from "react";
import SearchInput from "../components/Input/SearchInput";
import Button from "../components/Button/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import searchService from "../services/searchService";
import debounce from "lodash.debounce";
import Tabs from "../components/TabsComponent";
import useJobApi from "../services/jobService";
import UserImageInput from "../components/Input/UserImageInput";

function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const divRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [jobList, setJobList] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [latestJobs, setLatestJobs] = useState([]);
  const [topPayingJobs, setTopPayingJobs] = useState([]);
  const [variousLocatioJobs, setVariousLocatioJobs] = useState([]);
  const [currentTab, setcurrentTab] = useState("Latest Oportunities");
  const [bgblur, setBgblur] = useState(false);
  const [oportunities, setOportunities] = useState({});

  useEffect(() => {
    const fetchOportunities = async () => {
      const informationTechnology = await searchService.secrchJobByKeyword(
        "Information Technology"
      );
      setOportunities((prev) => ({
        ...prev,
        informationTechnology: informationTechnology.length,
      }));
      const businessFinance = await searchService.secrchJobByKeyword(
        "Business Finance"
      );
      setOportunities((prev) => ({
        ...prev,
        businessFinance: businessFinance.length,
      }));
      const humanResource = await searchService.secrchJobByKeyword(
        "Human Resource HR"
      );
      setOportunities((prev) => ({
        ...prev,
        humanResource: humanResource.length,
      }));
      const writingJournalist = await searchService.secrchJobByKeyword(
        "Writing Journalist"
      );
      setOportunities((prev) => ({
        ...prev,
        writingJournalist: writingJournalist.length,
      }));
      const marketingAdvertising = await searchService.secrchJobByKeyword(
        "Marketing Advertising"
      );
      setOportunities((prev) => ({
        ...prev,
        marketingAdvertising: marketingAdvertising.length,
      }));
      const engineeringTechnology = await searchService.secrchJobByKeyword(
        "Engineering Technology"
      );
      setOportunities((prev) => ({
        ...prev,
        engineeringTechnology: engineeringTechnology.length,
      }));
    };

    fetchOportunities();

    console.log(oportunities);
  }, []);
  const jobService = useJobApi();
  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const response = await jobService.job.getAll();

        // Filter jobs with salary info for "Latest Jobs" category
        const filteredJobs = response
          .filter((job) => job.min_salary || job.max_salary) // Include jobs with either min or max salary
          .slice(0, 6); // Limit to the first 6 jobs
        setLatestJobs(filteredJobs); // Set the latest jobs in state

        console.log("All Jobs:", response);
        console.log("Filtered Latest Jobs:", filteredJobs);

        // Filter for "Top Paying Jobs" category (assuming salaries are strings with "K" in them)
        const topPayingFilteredJobs = response
          .filter(
            (job) =>
              (job.min_salary && job.min_salary > 100000) ||
              (job.max_salary && job.max_salary > 100000)
          ) // High-paying jobs with "K"
          .slice(0, 6); // Limit to the first 6 jobs
        setTopPayingJobs(topPayingFilteredJobs); // Set top-paying jobs in state

        console.log("Filtered Top Paying Jobs:", topPayingFilteredJobs);

        const variousLocationFilteredJobs = response
          .filter((job) => job.location && job.location.country) // High-paying jobs with "K"
          .slice(0, 6); // Limit to the first 6 jobs
        setVariousLocatioJobs(variousLocationFilteredJobs); // Set top-paying jobs in state

        console.log("Filtered Various Location Jobs:", variousLocatioJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchLatestJobs();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleScroll = useCallback(() => {
    if (divRef.current) {
      const scrollTopValue = divRef.current.scrollTop;
      setIsAtTop(scrollTopValue <= 220);
    }
  }, []);

  useEffect(() => {
    const scrollableDiv = divRef.current;
    scrollableDiv?.addEventListener("scroll", handleScroll);
    return () => scrollableDiv?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const fetchJobs = useCallback(
    debounce(async (text) => {
      setIsLoading(true);
      try {
        const jobs = await searchService.secrchJobByKeyword(text);
        setJobList(jobs);
        setErrorMessage(""); // Clear any previous error
      } catch (error) {
        console.error("Error fetching jobs: ", error);
        setErrorMessage("Failed to fetch jobs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchText) {
      fetchJobs(searchText);
    } else {
      setJobList([]);
    }
  }, [searchText, fetchJobs]);

  return (
    <div
      className="w-full px-4 sm:px-8 h-full bg-slate-50 py-10 text-center   overflow-y-auto items-center"
      style={
        {
          // background: "linear-gradient(to bottom, #fef2f2, #eff6ff)" // Very light pastel gradient
        }
      }
      ref={divRef}
    >
      {searchFocus && (
        <div
        onClick={()=>setSearchFocus(false)}
          className={`blur-lg backdrop-blur-sm z-20 transition-all ${
            searchFocus ? "opacity-100" : "opacity-0"
          }  h-screen w-screen -mt-10 -ml-8 absolute`}
        ></div>
      )}
      {/* Header Section */}
      <div className="pt-16 mb-10 px-4">
        <p className="text-4xl md:text-5xl text-black font-bold mt-5 leading-tight">
          Search your dream job here
        </p>
        <p className=" text-lg sm:text-2xl text-gray-400  mt-2">
          Let's get your career started right away
        </p>
      </div>
      {/* Sticky Search Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/jobs/" + searchText);
        }}
        className="sticky flex items-center  w-full pointer-events-none bg-transparent justify-center -top-8 z-40"
      >
        <div className={`relative   ${isAtTop && "w-full"}  lg:w-full flex justify-center`}>
          <SearchInput
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            // onBlur={() => setSearchFocus(false)}
            inputClassName={`placeholder:text-lg transition-all ${
              !isAtTop ? "hidden lg:block" : ""
            }`}
            className={`sticky top-5 transition-all w-full max-w-screen-sm   md:max-w-screen-md border bg-white ${
              isAtTop
                ? "shadow-xl rounded-2xl py-3 px-5 w-full"
                : "sm:scale-x-90 rounded-full lg:rounded-2xl sm:scale-y-90 scale-95 py-3 px-3 lg:px-5 w-fit"
            }`}
            placeholder="Enter the job title or domain"
          />
          {searchFocus &&jobList.length > 0 && (
            <div
              role="listbox"
              aria-expanded="true"
              className="border w-full absolute max-h-60 overflow-y-auto rounded-2xl max-w-screen-md mt-20 shadow-2xl overflow-hidden bg-white z-40 p-4 flex flex-col"
            >
              {jobList.map((job, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    navigate("/job/" + job._id);
                  }}
                  role="option"
                  tabIndex={0}
                  className="py-2.5 border-b cursor-pointer"
                >
                  <p className="font-medium">{job.job_role}</p>
                  <p className="text-gray-400">{job.company_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* {isLoading && <p className="text-gray-500">Loading jobs...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
      {/* How It Works Section */}
      <p className="text-2xl font-bold mt-20">Top Picks Just for You</p>
      <p className=" mt-2 leading-tight text-gray-400">
        Carefully selected job opportunities tailored to your interests
      </p>
      <div className="flex justify-center mt-7">
        <Tabs setTab={setcurrentTab} tab={currentTab} />
      </div>
      <div className="w-full flex justify-center ">
        {currentTab == "Latest Oportunities" && (
          <div
            className=" flex sm:grid gap-5 overflow-x-auto w-full mt-16 sm:border sm:p-5 sm:bg-gray-100 sm:shadow-inner sm:rounded-3xl max-w-screen-lg  grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            style={{
              scrollbarWidth: "none",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {latestJobs?.slice(0, 6).map((job) => (
              <div
              onClick={()=>{
                navigate("job/"+job._id)
              }}
                style={{
                  scrollSnapAlign: "center", // This makes each item snap to the center of the viewport
                }}
                className="bg-white cursor-pointer w-full min-w-full  border sm:shadow-lg text-sm flex overflow-hidden flex-col justify-between  rounded-3xl p-7 "
              >
                <div className="flex gap-4  items-center  text-left ">
                  <UserImageInput
                    imageHeight={60}
                    image={job.conpany_logo}
                    isEditable={false}
                  />
                  <div className="">
                    <p className="font-semibold text-xl text-wrap leading-tight line-clamp-2 sm:line-clamp-2">
                      {job.job_role}
                    </p>
                    <p className="text-gray-400 truncate line-clamp-1">
                      {job.company_name}
                    </p>
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col  items-center  justify-between gap-4 mt-4">
                  <div className="flex gap-2 w-full  bg-amber-100 font-medium  justify-center text-center px-6 py-2.5 rounded-xl text-amber-600   text-lg items-center">
                    View job
                  </div>
                  {/* {job.location && <div className="bg-gray-50 px-4 py-3 rounded-full font-medium text-gray-500">
                    <p>
                      {" "}
                      {job.location?.city ||
                        job.location?.state ||
                        job.location?.country ||
                        job.location?.address}
                    </p>
                  </div>} */}
                  {/* <button className="bg-[#F7AA43] w-full lg:w-fit px-5 font-medium text-white text-lg py-2 rounded-xl">
                    Apply
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTab == "Top Paying" && (
          <div
            className=" flex sm:grid gap-5 overflow-x-auto w-full mt-16 sm:border sm:p-5 sm:bg-gray-100 sm:shadow-inner sm:rounded-3xl max-w-screen-lg  grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            style={{
              scrollbarWidth: "none",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {topPayingJobs.map((job) => (
              <div
              onClick={()=>{
                navigate("job/"+job._id)
              }}
                style={{
                  scrollSnapAlign: "center", // This makes each item snap to the center of the viewport
                }}
                className="bg-white cursor-pointer w-full min-w-full  border sm:shadow-lg text-sm flex overflow-hidden flex-col justify-between  rounded-3xl p-7 "
              >
                <div className="flex gap-4  items-center  text-left ">
                  <UserImageInput
                    imageHeight={60}
                    image={job.conpany_logo}
                    isEditable={false}
                  />
                  <div className="">
                    <p className="font-semibold text-xl text-wrap leading-tight line-clamp-2 sm:line-clamp-2">
                      {job.job_role}
                    </p>
                    <p className="text-gray-400 truncate line-clamp-1">
                      {job.company_name}
                    </p>
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col items-center  justify-between gap-4 mt-4">
                  <div className="flex gap-2 w-full  bg-purple-100  justify-center text-center px-6 py-3 rounded-xl text-purple-700   font-medium text-lg items-center">
                    {job.currency_type == "$" || job.currency_type == "USD" ? (
                      <svg
                        class="h-6 w-6  "
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : job.currency_type == "₹" ? (
                      <svg
                        className="h-7 w-7  "
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      job.currency_type
                    )}
                    <p className="text-nowrap truncate text-center  sm:text-base  ">
                      {job.min_salary || job.max_salary
                        ? ` ${
                            job.min_salary > 1000
                              ? job.min_salary / 1000 + "K"
                              : job.min_salary
                          }  - ${
                            job.max_salary > 1000
                              ? job.max_salary / 1000 + "K"
                              : job.max_salary
                          }`
                        : "Not disclosed"}
                      {(job.min_salary || job.max_salary) &&
                        job.salary_type && (
                          <span className="text-gray-400 truncate   text-wrap  font-normal ml-2">
                            per {job.salary_type}
                          </span>
                        )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {currentTab == "Various Locations" && (
          <div
            className=" flex sm:grid gap-5 overflow-x-auto w-full mt-16 sm:border sm:p-5 sm:bg-gray-100 sm:shadow-inner sm:rounded-3xl max-w-screen-lg  grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            style={{
              scrollbarWidth: "none",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {variousLocatioJobs.map((job) => (
              <div
               onClick={()=>{
                navigate("job/"+job._id)
              }}
                style={{
                  scrollSnapAlign: "center", // This makes each item snap to the center of the viewport
                }}
                className="bg-white cursor-pointer w-full min-w-full  border sm:shadow-lg text-sm flex overflow-hidden flex-col justify-between  rounded-3xl p-7 "
              >
                <div className="flex gap-4  items-center  text-left ">
                  <UserImageInput
                    imageHeight={60}
                    image={job.conpany_logo}
                    isEditable={false}
                  />
                  <div className="">
                    <p className="font-semibold text-xl text-wrap leading-tight line-clamp-2 sm:line-clamp-2">
                      {job.job_role}
                    </p>
                    <p className="text-gray-400 truncate line-clamp-1">
                      {job.company_name}
                    </p>
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col items-center  justify-between gap-4 mt-4">
                  <div className="flex gap-2 w-full  bg-gray-100  justify-center text-center px-6 py-2.5 rounded-xl text-gray-700   font-medium text-lg items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        clip-rule="evenodd"
                      />
                    </svg>

                    <p className="text-wrap">{job.location?.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <p className=" text-blue-500 mt-5 font-medium text-lg">See all</p> */}

      <p className="text-3xl mt-20 font-bold">Job Categories</p>
      <p className="text-gray-400 mt-2">
        Explore various job categories available on the portal and find
        opportunities that match your interests.
      </p>
      <div className="flex w-full justify-center">
        <div
          className=" flex sm:grid gap-5 overflow-x-auto w-full mt-16   max-w-screen-lg  grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          style={{
            scrollbarWidth: "none",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {[
            {
              category: "Information Technology",
              roles:
                "Web Developer, Database Administrator, Network Engineer, Cybersecurity Analyst",
              opportunities: oportunities.informationTechnology,
            },
            {
              category: "Business and Accounting",
              roles:
                "Accountant, Financial Analyst, Business Development Manager, Tax Advisor",
              opportunities: oportunities.businessFinance,
            },
            {
              category: "Engineering and Technology",
              roles:
                "Software Engineer, Civil Engineer, Mechanical Engineer, IT Support Specialist",
              opportunities: oportunities.engineeringTechnology,
            },
            {
              category: "Human Resources (HR)",
              roles:
                "HR Manager, Recruiter, Talent Acquisition Specialist, Payroll Specialist",
              opportunities: oportunities.humanResource,
            },
            {
              category: "Marketing and Advertising",
              roles:
                "Marketing Manager, Social Media Specialist, Content Writer, Market Research Analyst",
              opportunities: oportunities.marketingAdvertising,
            },
            {
              category: "Writing and Journalism",
              roles: "Journalist, Editor, Copywriter, Technical Writer",
              opportunities: oportunities.writingJournalist,
            },
          ].map((job, index) => (
            <div
              key={index}
              style={{
                scrollSnapAlign: "start",
              }}
              className="border border-gray-300 mb-5 shadow-lg cursor-pointer text-start w-full rounded-xl bg-white p-6"
            >
              <p className="font-medium text-lg">{job.category}</p>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="truncate">{job.roles}</span>
                <span className="text-blue-500 flex gap-1 pl-2 font-medium">
                  {job.opportunities}
                  <svg
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-2xl w-full  font-semibold mt-20">
        How It Actually Works ?
      </p>
      <p className="text-gray-400 mt-2">
        A simple, step-by-step process to help you land your ideal job with
        ease.
      </p>

      <div
        className="gap-6 mt-4 px-2   flex lg:justify-center overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {[
          {
            title: "Create an account",
            description: "Create an account with your details and motive",
            linkText: "Create account",
            link :"/signup",
            logo: (
              <div className="p-4 w-fit text-blue-500 flex items-center rounded-full bg-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className=" size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </div>
            ),
          },
          {
            title: "Explore content",
            description:
              "Explore jobs and create connections with people to increase chances",
            logo: (
              <div className="p-4 w-fit text-indigo-500 flex items-center rounded-full bg-indigo-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
            ),
          },
          {
            title: "Posts",
            description: "Post jobs you hear about and create connections",
            logo: (
              <div className="p-4 w-fit text-purple-500 flex items-center rounded-full bg-purple-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-8"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                    clip-rule="evenodd"
                  />
                  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                </svg>
              </div>
            ),
          },
          {
            title: "Job Search",
            description:
              "Find your dream job from the best listed jobs suitable for you",
            logo: (
              <div className="p-4 w-fit text-yellow-500 flex items-center rounded-full bg-yellow-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-8"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                    clip-rule="evenodd"
                  />
                  <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                </svg>
              </div>
            ),
          },
        ].map((step, index) => (
          <div
            key={index}
            style={{
              scrollSnapAlign: "center", // This makes each item snap to the center of the viewport
            }}
            className="border bg-white shadow-lg my-5 min-w-full sm:min-w-60 flex flex-col sm:max-w-60 p-6 rounded-xl text-gray-400"
          >
            <div className="flex justify-center">{step.logo}</div>
            <div className="mt-3 text-center">
              <p className="font-medium text-xl text-gray-500 mb-1">
                {step.title}
              </p>
              <p>{step.description}</p>
              {step.linkText && (
                <p onClick={()=>{navigate(step.link)}} className="text-blue-500 cursor-pointer font-medium">{step.linkText}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
