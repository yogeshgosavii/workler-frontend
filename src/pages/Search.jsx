import React, { useState, useEffect, useRef } from "react";
import searchService from "../services/searchService";
import UserImageInput from "../components/Input/UserImageInput";
import UserProfileView from "../components/UserProfileView";
import profileImageDefault from "../assets/user_male_icon.png";
import "../css/button.css";
import companyImageDefault from "../assets/companyDefaultImage.png";

import { Outlet, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "date-fns";
import { useSelector } from "react-redux";
import useJobApi from "../services/jobService";

function Search() {
  const [searchInputFocus, setSearchInputFocus] = useState(false);
  const [locationInputFocus, setLocationInputFocus] = useState(false);
  const [searchType, setSearchType] = useState("user");
  const [query, setQuery] = useState("");
  const userId = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [atTop, setAtTop] = useState(0);
  const profileRef = useRef();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedJobs, setSearchedJobs] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const jobService = useJobApi();

  useEffect(() => {
      document.title = "User Search";
    
   }, []);

  useEffect(() => {
    console.log(location.pathname);

    const handleScroll = () => {
      if (profileRef.current) {
        const currentScrollY = profileRef.current.scrollTop;
        setAtTop(currentScrollY);
      }
    };

    const profileElement = profileRef.current;
    if (profileElement) {
      profileElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (profileElement) {
        profileElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [userId]);

  const fetchData = async (searchQuery) => {
    setIsLoading(true);
    try {
      let userSearchResponse = null;
      let jobSearchResponse = null;

      try {
        userSearchResponse = await searchService.searchByUsername(searchQuery);
        console.log(userSearchResponse);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("User search not found.");
        } else {
          console.error("An error occurred during user search:", error);
        }
      }

      // try {
      //   jobSearchResponse = await searchService.secrchJobByKeyword(searchQuery);
      //   console.log(jobSearchResponse);
      // } catch (error) {
      //   if (error.response && error.response.status === 404) {
      //     console.warn("Job search not found.");
      //   } else {
      //     console.error("An error occurred during job search:", error);
      //   }
      // }

      setSearchedUsers(userSearchResponse || []);
      setSearchedJobs(jobSearchResponse || []);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setResults([]);
    setHasSearched(false);

    const handler = setTimeout(() => {
      if (query) {
        fetchData(query);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, searchType]);

  return (
    <div className="flex gap-4 justify-center w-full ">
      <div
        className={`${
          location.pathname.split("/").length > 2 && " hidden sm:block"
        } sm:px-0 w-full sm:max-w-lg `}
      >
        <div className=" sticky top-0 z-20 bg-white px-4 pt-5">
          <form
            onSubmit={(e) => {
              if (searchType != "user") {
                +navigate("/jobs/" + query);
              } else {
                e.preventDefault();
              }
            }}
            className="flex sticky top-0  shadow-md sm:shadow-lg w-full border rounded-xl gap-2 h-fit px-4 bg-white py-2.5"
          >
            <input
              autoFocus
              onFocus={() => setSearchInputFocus(true)}
              onBlur={() => setTimeout(() => setSearchInputFocus(false), 100)}
              className="outline-none w-full py-1"
              placeholder="Enter username, job title, or company"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg
              onClick={() => {
                // if(searchType != "user"){
                //   navigate("/jobs/"+query)
                // }
                // else{
                e.preventDefault();
                // }
              }}
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {/* <div className={`flex gap-4 ${user.account_type == "Employeer" && "py-1"} items-center`}>
             {user.account_type == "Candidate"  && <div className={` p-2  border rounded-full `}>
                {searchType == "user" ? (
                  <svg
                    onClick={() => {
                      setSearchType("job");
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className={`h-4 w-4 `}
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>
                ) : (
                  <svg
                    onClick={() => {
                      setSearchType("user");
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className={`h-4 w-4 `}
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
                    <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
                  </svg>
                )}
              </div>}
              <svg
              onClick={()=>{
                if(searchType != "user"){
                  navigate("/jobs/"+query)
                }
                else{
                  e.preventDefault()
                }
              }}
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div> */}
          </form>
          {/* Uncomment and modify this if you need the location input */}
          {/* {(searchInputFocus || locationInputFocus) && (
            <div className="transition-all -mt-px flex flex-col gap-2 w-full">
              <div className="border-t w-full"></div>
              <input
                placeholder={"Location"}
                className="shrink my-1.5 flex-grow outline-none"
                onFocus={() => setLocationInputFocus(true)}
                onBlur={() => setLocationInputFocus(false)}
              />
            </div>
          )} */}
        </div>
        {/* Display search results */}
        {query.length > 0 && (
          <div className="w-full mt-4 flex flex-col gap-4">
            {isLoading ? (
              // <p className="w-full text-center">
              //   Loading
              //   <svg
              //     className="inline w-8 h-7 my-1.5 text-transparent animate-spin fill-blue-500"
              //     viewBox="0 0 100 101"
              //     fill="none"
              //     xmlns="http://www.w3.org/2000/svg"
              //   >
              //     <path
              //       d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              //       fill="currentColor"
              //     />
              //     <path
              //       d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              //       fill="currentFill"
              //     />
              //   </svg>
              // </p>
              <div className="animate-pulse px-4 flex flex-col overflow-y-hidden gap-2 mt-2">
                <div className=" flex justify-between mb-5">
                  <div className="h-4 w-1/3 bg-gray-200 rounded-lg "></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
                </div>
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-[40px] bg-gray-200 w-[40px] rounded-full mb-2"></div>
                    <div className=" w-1/2 ml-2">
                      <div className="h-3 bg-gray-200 rounded-md mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded-md mb-2"></div>
                    </div>
                  </div>
                ))}
                <div className=" flex justify-between mb-5 mt-5">
                  <div className="h-4 w-1/3 bg-gray-200 rounded-lg "></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
                </div>
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center border p-4 rounded-lg bg-gray-50"
                  >
                    <div className="h-[40px] bg-gray-200 w-[40px] rounded-full mb-2"></div>
                    <div className=" w-1/2 ml-2">
                      <div className="h-3 bg-gray-200 rounded-md mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded-md mb-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              hasSearched && (
                <div className=" flex flex-col px-4 gap-6">
                  <div className="">
                    <div className="flex justify-between items-center mb-5">
                      <p className="text-2xl font-semibold ">Accounts</p>
                      {searchedUsers.length > 5 && (
                        <p
                          onClick={() => {
                            navigate("/jobs/" + query);
                          }}
                          className="text-blue-500 cursor-pointer"
                        >
                          See all users
                        </p>
                      )}
                    </div>
                    {searchedUsers.length > 0 ? (
                      <div >
                        {searchedUsers.map((user) => (
                          <div
                          
                          onClick={()=>{
                            navigate("/user/"+user._id)
                          }}
                          
                          className="flex gap-4 cursor-pointer">
                            <UserImageInput
                              image={user.profileImage.compressedImage[0]}
                              isEditable={false}
                            />
                            <div className="-mt-1">
                              <p className="font-medium text-lg">{user.username}</p>
                              {user.personal_details ?<p className="text-gray-400">{user.personal_details?.firstname} {" "}{user.personal_details?.lastname}</p>:<p className="text-gray-400">{user.company_details.company_name}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="-mt-2 text-gray-400"> No user found</p>
                    )}
                  </div>
                  {user.account_type == "Candidate" && (
                    <div>
                      <div className=" flex mt-5 mb-5 gap-4 justify-between">
                        <p className="text-2xl font-semibold">Jobs</p>
                        {searchedJobs.length > 5 && (
                          <p
                            onClick={() => {
                              navigate("/jobs/" + query);
                            }}
                            className="text-blue-500 cursor-pointer"
                          >
                            See all jobs
                          </p>
                        )}
                      </div>
                      {searchedJobs.length>0 ?<div className="flex flex-col gap-4 pb-20">
                        {searchedJobs.slice(0, 5).map((job) => (
                          <div
                          onClick={()=>{
                            navigate("/job/"+job._id)
                          }}
                           className="flex gap-4 p-4 border cursor-pointer bg-gray-50 rounded-lg">
                            <UserImageInput
                              isEditable={false}
                              image={
                                job.company_logo ||
                                (job.company_details &&
                                  job.user.profileImage.compressedImage[0]) ||
                                companyImageDefault
                              }
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = companyImageDefault;
                              }}
                            />
                            <div>
                              <p className="text-lg text-wrap font-medium">
                                {job.job_role}
                              </p>
                              <p className="text-gray-400 -mt-1">
                                {job.company_name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>:
                      <p className="text-gray-400 -mt-2">No jobs found</p>}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
      {/* <Outlet  /> */}
    </div>
  );
}

export default Search;
