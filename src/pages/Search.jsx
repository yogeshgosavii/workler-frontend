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
import { getPostByKeyWord } from "../services/postService";
import Posts from "../components/profileTabs/Posts";

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
  const [selectedType, setSelectedType] = useState("Accounts");
  const [atTop, setAtTop] = useState(0);
  const profileRef = useRef();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedJobs, setSearchedJobs] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const jobService = useJobApi();

  useEffect(() => {
    document.title = "User Search";
  }, []);

  useEffect(() => {
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
      let postSearchResponse = null;

      try {
        userSearchResponse = await searchService.searchUserByKeyword(
          searchQuery
        );
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("User search not found.");
        } else {
          console.error("An error occurred during user search:", error);
        }
      }

      try {
        postSearchResponse = await getPostByKeyWord(searchQuery);
        console.log("posts", postSearchResponse);
        setSearchedPosts(postSearchResponse || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("User search not found.");
        } else {
          console.error("An error occurred during user search:", error);
        }
      }
      try {
        jobSearchResponse = await searchService.secrchJobByKeyword(
          searchQuery,
          1,
          3
        );
        // setSearchedJobs(jobSearchResponse.jobs || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("Job search not found.");
        } else {
          console.error("An error occurred during job search:", error);
        }
      }

      setSearchedUsers(userSearchResponse || []);
      setSearchedJobs(jobSearchResponse.jobs || []);
      setHasSearched(true);
    } finally {
      setHasSearched(true);

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
    <div className="flex gap-4 bg-white min-h-dvh justify-center w-full ">
      <div
        className={`${
          location.pathname.split("/").length > 2 && " hidden sm:block"
        } sm:px-0 w-full sm:max-w-lg `}
      >
        <div className=" sticky top-0 z-30 bg-white py-2 sm:pt-4">
          <form
            onSubmit={(e) => {
              if (searchType != "user") {
                +navigate("/jobs/" + query);
              } else {
                e.preventDefault();
              }
            }}
            className="flex sticky top-0   w-full border-b sm:border sm:rounded-xl shadow-sm sm:shadow-none gap-2 h-fit px-4 bg-white py-2.5 pb-3 sm:pb-2.5"
          >
            <input
              autoFocus
              type="search"
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
          </form>
        </div>

        {/* Display search results */}
        {query.length>0 && <div className="flex gap-4 border-b sticky top-[70px] pt-2 pb-4   z-20 bg-white  px-4 sm:px-0  py-1">
          <p
            onClick={() => {
              {
                setSelectedType("Accounts");
              }
            }}
            className={`px-3 py-1 cursor-pointer rounded-lg font-medium border ${
              selectedType == "Accounts"
                ? "bg-gray-800 border-gray-800 text-white"
                : "bg-white"
            }`}
          >
            Accounts
          </p>
          <p
            onClick={() => {
              {
                setSelectedType("Posts");
              }
            }}
            className={`px-3 py-1 cursor-pointer rounded-lg font-medium border ${
              selectedType == "Posts"
                ? "bg-gray-800 border-gray-800 text-white"
                : "bg-white"
            }`}
          >
            Posts
          </p>
          {user.account_type == "Candidate" && (
            <p
              onClick={() => {
                setSelectedType("Jobs");
              }}
              className={`px-3 py-1 cursor-pointer rounded-lg font-medium border ${
                selectedType == "Jobs"
                  ? "bg-gray-800 border-gray-800 text-white"
                  : "bg-white"
              }`}
            >
              Jobs
            </p>
          )}
        </div>}
        {query.length > 0 && (
          <div className="w-full mt-5  flex flex-col gap-4">
            {isLoading ? (
              <div className="animate-pulse px-4 sm:px-0 flex flex-col overflow-y-hidden gap-2 mt-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center">
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
                <div className="flex flex-col  sm:px-0 gap-6">
                  {selectedType == "Accounts" && (
                    <div className="">
                      {searchedUsers.length > 0 ? (
                        <div className="flex flex-col px-4 sm:px-0 gap-4">
                          {searchedUsers.map((user) => (
                            <div
                              onClick={() => {
                                navigate("/user/" + user._id);
                              }}
                              className="flex gap-4 cursor-pointer items-center"
                            >
                              <UserImageInput
                                imageHeight={45}
                                image={user.profileImage?.compressedImage[0]}
                                isEditable={false}
                              />
                              <div className=" -mt-1">
                                <p className="font-medium text-lg">
                                  {user.username}
                                </p>
                                {user.personal_details ? (
                                  <p className="text-gray-400">
                                    {user.personal_details?.firstname}{" "}
                                    {user.personal_details?.lastname}
                                  </p>
                                ) : (
                                  <p className="text-gray-400">
                                    {user.company_details.company_name}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="">
                          <p className="text-xl text-gray-500 font-semibold">
                            {" "}
                            No results found
                          </p>
                          <p className="text-gray-400 font-normal mt-1 leading-5">
                            No result found , Be more specfic or check for typos
                            and try again{" "}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedType == "Posts" && (
                    <Posts
                      isEditable={false}
                      postData={searchedPosts}
                      className={"gap-5"}
                      postClassName={"border"}
                    />
                  )}
                  {user.account_type == "Candidate" &&
                    selectedType == "Jobs" && (
                      <div>
                        {searchedJobs.length > 0 ? (
                          <div className="flex flex-col px-4 sm:px-0 pb-20">
                            {searchedJobs.slice(0, 5).map((job, index, arr) => (
                              <div
                                onClick={() => {
                                  navigate("/job/" + job._id);
                                }}
                                className={`flex gap-4 ${
                                  index !== arr.length - 1 && "border-b"
                                } py-4 cursor-pointer `}
                              >
                                <UserImageInput
                                  isEditable={false}
                                  image={
                                    job.company_logo ||
                                    (job.company_details &&
                                      job.user.profileImage
                                        ?.compressedImage[0]) ||
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
                            <p
                              onClick={() => {
                                window.open(`/jobs/${query}?`, "_blank");
                              }}
                              className="w-full text-center mt-2 font-medium bg-blue-50 border border-blue-500 rounded-md text-blue-500 py-2.5 text-lg"
                            >
                              See all
                            </p>
                          </div>
                        ) : (
                          <div className="px-4 sm:px-0">
                            <p className="text-xl font-bold text-gray-500">
                              {" "}
                              No results found
                            </p>
                            <p className="text-gray-400 leading-5 mt-1 ">
                              No result found , Be more specfic or check for
                              typos and try again{" "}
                            </p>
                          </div>
                        )}
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
