import React, { useEffect, useState } from "react";
import { getAllPosts, getUserFollowingPosts } from "../services/postService";
import Posts from "../components/profileTabs/Posts";
import useJobApi from "../services/jobService";
import PostView from "../components/PostView";
import searchService from "../services/searchService";
import { getPreference } from "../services/preferenceService";
import companyDefaultImage from "./../assets/companyDefaultImage.png";

import { useSelector } from "react-redux";
import JobListItem from "../components/jobComponent/JobListItem";
import { useNavigate } from "react-router-dom";

function UserHome() {
  const [content, setContent] = useState([]);
  const [selectedType, setSelectedType] = useState(window.location.pathname?.split('/').filter(Boolean).pop());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [preferedJobs, setPreferedJobs] = useState([]);
  // const [preferences, setPreferences] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const jobService = useJobApi();
  useEffect(() => {
    document.title = "Home";
  }, []);

  

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const posts = await getUserFollowingPosts();

      try {
        if (selectedType === "posts") {
          setContent(posts.filter((post) => post.post_type !== "job"));
        } else if (selectedType === "job_posts") {
          // const jobPosts = await jobService.job.getAll();
          setContent(posts.filter((post) => post.post_type === "job"));
        } else if (selectedType === "prefered_jobs") {
            try {
              if (currentUser.account_type == "Candidate") {
                const preferences = await getPreference(currentUser._id);
                console.log(preferences);
                const response = preferences && await searchService.secrchJobByKeyword(
                  `${preferences.experienceLevel} ${preferences.jobType} ${preferences.location?.address} ${preferences.location?.state} ${preferences.location?.country}`
                );
                // if (existingPreferences) {
                //   setPreferences(existingPreferences);
                // }
                response && setPreferedJobs(response.jobs);

              }
            } catch (error) {
              console.error("Error fetching preferences:", error);
            }
          
          
        
          
        }
      } catch (error) {
        setError("Failed to load content ,Refresh and try again.");
        console.error("Error fetching content:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedType]);

  useEffect(() => {

    if(window.location.pathname?.split('/').filter(Boolean).pop() == "home"){
      navigate("posts")
      setSelectedType("posts")
    }

    
   
  }, [selectedType]);

  if (error)
    return (
      <div className="w-full text-center mt-10">
        {" "}
        <p className="max-w-xl pt-20 text-center sm:h-full h-fit px-6 md:px-6">
          <p className="text-2xl font-bold text-red-500">
            Failed to load content
          </p>
          <p className="mt-1 text-red-400">
            Refresh to load the content and try again to load content
          </p>
          <p
            onClick={() => {
              window.location.reload();
            }}
            className="text-blue-500 font-medium cursor-pointer"
          >
            Refresh
          </p>
        </p>
      </div>
    );

  return (
    <div className="w-full flex  flex-col bg-gray-50 h-full ">
      <div
        className={`  sm:px-10  fixed  flex gap-4 overflow-x-auto  sm:ml-1.5  w-full sm:w-[99%]  py-4  bg-transparent z-30 top-0  ${
          selectedPost && "hidden sm:block"
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        <div
          className={`absolute  right-0 inset-0 flex w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 -z-10 `}
        />

       {/* <div className = "flex px-4 overflow-x-auto gap-4"
       style={{ scrollbarWidth: "none" }}
       >
       {[
          "Posts",
          currentUser.account_type == "Candidate" && "Jobs Posts",
          currentUser.account_type == "Candidate" && "Preferred Jobs",
        ]
          .filter(Boolean)
          .map((type) => (
            <p
              key={type}
              onClick={() => {
                if(type == "Posts"){
                  setSelectedType("posts");

                }
                else if(type == "Jobs Posts"){

                }
              }}
              className={`${
                selectedType === type
                  ? "bg-gray-800 border-gray-800 text-white "
                  : "bg-white"
              } px-4 z-40 py-1  border cursor-pointer text-nowrap  rounded-lg font-medium`}
            >
              {type}
            </p>
          ))}
        </div> */}
         <div className="flex gap-4  px-4 sm:px-0 py-1">
          <p
            onClick={() =>{{ navigate("posts")
              setSelectedType("posts")
            }}}
            className={`px-3 py-1 cursor-pointer bg rounded-md font-medium border ${
              selectedType == "posts" ?
              "bg-gray-800 border-gray-800 text-white":"bg-white"
            }`}
          >
            Posts
          </p>
          <p
            onClick={() => {navigate("job_posts")
              setSelectedType("job_posts")

            }}
            className={`px-3 py-1 cursor-pointer rounded-md font-medium border ${
              selectedType == "job_posts" ?
              "bg-gray-800 border-gray-800 text-white":"bg-white"
            }`}
          >
            Job posts
          </p>
          <p
            onClick={() => {navigate("prefered_jobs")
              setSelectedType("prefered_jobs")
            }}
            className={`px-3 py-1 cursor-pointer rounded-md font-medium border ${
              selectedType == "prefered_jobs" ?
              "bg-gray-800 border-gray-800 text-white":"bg-white"
            }`}
          >
            Prefered jobs
          </p>
        </div>
      </div>
      <div className="flex overflow-y-auto  h-full flex-1 pt-10 justify-center  gap-4">
        {loading ? (
          <div className=" pb-14">
            <div class="grid min-h-[140px] w-full  h-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
              <svg
                class="text-transparent animate-spin"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
              >
                <path
                  d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                  stroke="currentColor"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-400"
                ></path>
              </svg>
            </div>
          </div>
        ) : selectedType == "prefered_jobs" ? (
          preferedJobs.length <= 0 ? (
            preferences ? (
              <p className="max-w-xl pt-20 text-center bg-gray-50 sm:h-full h-fit px-6 md:px-6">
                <p className="text-2xl font-bold text-gray-500">
                  No jobs listed based on your preferences
                </p>
                <p className="mt-1 text-gray-400">
                  Update your preferences to a basic level to see more job
                  listings here
                </p>
                <p
                  onClick={() => {
                    navigate("/profile/settings/preferences");
                  }}
                  className="text-blue-500 font-medium cursor-pointer"
                >
                  Create preferences
                </p>
              </p>
            ) : (
              <p className="max-w-xl pt-20 text-center bg-gray-50 sm:h-full h-fit px-6 md:px-6">
                <p className="text-2xl font-bold text-gray-500">
                  No preferences added
                </p>
                <p className="mt-1 text-gray-400">
                  Add your preferences so we can recommend jobs based on them
                </p>
                <p
                  onClick={() => {
                    navigate("/profile/settings/preferences");
                  }}
                  className="text-blue-500 font-medium cursor-pointer"
                >
                  Update preferences
                </p>
              </p>
            )
          ) : (
            <div
            style={{ scrollbarWidth: "none" }}
            className="w-full pt-10 sm:pt-14 sm:px-10 pb-10 overflow-x-hidden flex max-w-xl flex-col gap-5">
              {preferedJobs?.length>0 && preferedJobs?.map((job, index) => (
                <JobListItem
                  key={index}
                  job={job}
                  companyDefaultImage={companyDefaultImage}
                  className="border bg-white  sm:shadow-none hover:sm:shadow-xl  hover:scale-105"
                />
              ))}
            </div>
          )
        ) : (
          <div>
            <div
            className={`  w-full pt-8 sm:pt-5 mb-10  justify-center flex ${
              selectedPost && "hidden sm:block"
            }`}
          >
            <Posts
              isEditable={false}
              postData={content}
              className={"sm:max-w-lg w-full "}
              postPaddingbottom={"pb-10"}
              postClassName={"sm:shadow-lg   border-y sm:rounded-xl"}
              no_post_error={
                selectedType == "job_posts" ? (
                  <p className="max-w-xl pt-20 bg-gray-50 h-full text-center px-6 md:px-6">
                    <p className="text-2xl font-bold text-gray-500">
                      No Job Posts Available
                    </p>
                    <p className="mt-1 text-gray-400 ">
                      The job posts posted by the people you follow will be
                      shown here
                    </p>
                    <p
                      onClick={() => {
                        navigate("/jobs");
                      }}
                      className="text-blue-500 font-medium cursor-pointer"
                    >
                      Explore jobs
                    </p>
                  </p>
                ) : (
                  <p className="sm:max-w-xl pt-20   h-full bg-gray-50 text-center  px-6 md:px-6">
                    <p className="text-2xl font-bold text-gray-500">
                      No Posts To Show
                    </p>
                    <p className="mt-1 text-gray-400 ">
                      Posts by the accounts you follow will be shown here ,
                      explore more accounts to see more posts
                    </p>
                    <p
                      onClick={() => {
                        navigate("/search");
                      }}
                      className="text-blue-500 font-medium cursor-pointer"
                    >
                      Explore accounts
                    </p>
                  </p>
                )
              }
              columns={"grid-cols-1 "}
            />


            {/* <Posts
             isEditable={false}
            // setFormType={setFormType}
            postData={content}
            className={"pb-5 "}
            columns={"grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"}
            postClassName={" h-full"}
            // userDetails={userDetails}
            // setPostData={setPostData}
          /> */}
          </div>
         {content.length>0 && <p className="sm:max-w-xl pb-10  bg-gray-50 text-center  px-6 md:px-6">
                   
                    <p className="mt-1 text-gray-400 ">
                     To see more posts on your home page explore more accounts who are actively posting{" "}
                     <span
                      onClick={() => {
                        navigate("/search");
                      }}
                      className="text-blue-500 font-medium cursor-pointer"
                    >
                      Explore accounts
                    </span>
                    </p>
                   
                  </p>}
          </div>
        )}
        {/* {selectedPost && (
          <PostView
            className={"sticky top-0 max-w-lg"}
            post={selectedPost?.post}
            index={selectedPost?.index}
          />
        )} */}
      </div>
      
    </div>
  );
}

export default UserHome;
