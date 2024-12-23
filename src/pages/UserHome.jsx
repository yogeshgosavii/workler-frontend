import React, { useEffect, useRef, useState } from "react";
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
import newsService from "../services/newsService";

function UserHome() {
  const [content, setContent] = useState([]);
  const [selectedType, setSelectedType] = useState(
    window.location.pathname?.split("/").filter(Boolean).pop()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [preferedJobs, setPreferedJobs] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [news, setNews] = useState([]);
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let autoScroll;

    if (!isPaused) {
      autoScroll = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, clientWidth, scrollWidth } =
            scrollContainerRef.current;

          const newScrollLeft =
            scrollLeft + clientWidth >= scrollWidth
              ? 0 // Loop back to start
              : scrollLeft + clientWidth;

          scrollContainerRef.current.scrollTo({
            left: newScrollLeft,
            behavior: "smooth",
          });
        }
      }, 10000); // Adjust the interval as needed (e.g., every 3 seconds)
    }

    return () => clearInterval(autoScroll);
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
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
          setContent(posts);
        } else if (selectedType === "prefered_jobs") {
          try {
            if (currentUser.account_type == "Candidate") {
              const userPreferences = await getPreference(currentUser._id);
              console.log(userPreferences);
              const response =
                userPreferences &&
                (await searchService.secrchJobByKeyword(
                  `${userPreferences.roles} ${userPreferences.experienceLevel} ${userPreferences.jobType} ${userPreferences.location?.address} ${userPreferences.location?.state} ${userPreferences.location?.country} `
                ));
              // if (existingPreferences) {
              setPreferences(preferences);
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
    const fetchNews = async () => {
      try {
        const news = await newsService.fetchLatestNews();
        setNews(news);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }; // Fetch news data from the API
    fetchNews();
  }, []);

  useEffect(() => {
    if (window.location.pathname?.split("/").filter(Boolean).pop() == "home") {
      navigate("posts");
      setSelectedType("posts");
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
    <div className="w-full flex sm:px-6    bg-gray-50 h-full gap-20 justify-center ">
      <div className="w-full flex flex-col max-w-lg   h-full">
        <div
          className={`    flex gap-4 border-b overflow-x-auto border bg-white   w-full   py-4  bg-transparent z-30 top-0  ${
            selectedPost && "hidden sm:block"
          }`}
          // style={{ scrollbarWidth: "none" }}
        >
          <div className={``} />
          <div className="flex gap-4   py-1">
            <p
              onClick={() => {
                {
                  navigate("posts");
                  setSelectedType("posts");
                }
              }}
              className={`px-3 py-1 cursor-pointer bg rounded-lg font-medium border ${
                selectedType == "posts"
                  ? "bg-gray-800 border-gray-800 text-white"
                  : "bg-white"
              }`}
            >
              Posts
            </p>

            {currentUser.account_type == "Candidate" && (
              <p
                onClick={() => {
                  navigate("prefered_jobs");
                  setSelectedType("prefered_jobs");
                }}
                className={`px-3 py-1 cursor-pointer rounded-lg font-medium border ${
                  selectedType == "prefered_jobs"
                    ? "bg-gray-800 border-gray-800 text-white"
                    : "bg-white"
                }`}
              >
                Prefered jobs
              </p>
            )}
            <p
              onClick={() => {
                navigate("news");
                setSelectedType("news");
              }}
              className={`px-3 py-1 sm:hidden  cursor-pointer  rounded-lg font-medium border ${
                selectedType == "news"
                  ? "bg-gray-800 border-gray-800 text-white"
                  : "bg-white"
              }`}
            >
              News
            </p>
          </div>
        </div>
        <div className="flex overflow-y-auto h-full flex-1 justify-center  gap-4">
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
                <p className="max-w-xl pt-20 text-center  sm:h-full h-fit px-6 md:px-6">
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
                className="w-full pt-10 sm:pt-14  pb-10 overflow-x-hidden max-w-2xl flex flex-col gap-8"
              >
                {preferedJobs?.length > 0 &&
                  preferedJobs?.map((job, index) => (
                    <JobListItem
                      key={index}
                      job={job}
                      companyDefaultImage={companyDefaultImage}
                      className="border bg-white   sm:shadow-none   "
                    />
                  ))}
              </div>
            )
          ) : selectedType == "news" ? (
            <div
              className="overflow-y-auto w-full sm:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {news.length > 0 ? (
                <div
                  className="flex flex-col  overflow-x-auto h-full snap-y snap-mandatory"
                  // ref={scrollContainerRef}
                  style={{ scrollbarWidth: "none" }}
                  // onMouseEnter={handleMouseEnter}
                  // onMouseLeave={handleMouseLeave}
                >
                  {news
                    .filter(
                      (newsItem) =>
                        newsItem.source.name !== "[Removed]" ||
                        newsItem.urlImage != null
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 flex items-end h-1/4  relative bg-gray-100 transition-all  min-h-full overflow-hidden snap-center group"
                      >
                        {/* Background Image */}
                        <img
                          className="object-cover group-hover:object-contain object-top bg-black absolute inset-0 w-full h-full z-10"
                          src={item.urlToImage}
                          alt={item.title}
                        />
                        <div className="absolute bottom-0 top-0 h-full z-20 w-full bg-gradient-to-t from-black to-transparent"></div>

                        {/* Foreground Text */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-14 group-hover:translate-y-0 transition-all">
                          <p className="font-bold leading-tight text-xl  line-clamp-2 text-white">
                            {item.title}
                          </p>
                          <p className="text-white leading-tight line-clamp-2 mt-0.5">
                            <span>{item.source.name}</span> {"  "}
                            <span className="font-bold px-0.5">·</span>
                            {"  "} <span>{item.author}</span>
                          </p>
                          <p className="text-xs text-gray-200  mt-2 transition-all line-clamp-3">
                            {item.content || item.description}
                          </p>
                          <p
                            onClick={() => {
                              window.open(item.url, "_blank");
                            }}
                            className="  justify-self-end items-center flex gap-5 text-white hover:text-black hover:bg-white px-4 py-2  opacity-0  group-hover:opacity-100 w-fit font-medium mt-4 cursor-pointer"
                          >
                            Visit page{" "}
                            <svg
                              onClick={() => {
                                window.history.back();
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="size-5 rotate-180 mt-0.5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                              />
                            </svg>
                          </p>
                        </div>

                        {/* Hover Overlay */}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-2xl text-gray-400 font-bold">
                    No news right now
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <div
                style={{ scrollbarWidth: "none" }}
                className={`  w-full pt-8 sm:pt-5 mb-10  overflow-y-auto   justify-center flex ${
                  selectedPost && "hidden sm:block"
                }`}
              >
                <Posts
                  isEditable={false}
                  postData={content}
                  // className={" w-full "}
                  // postPaddingbottom={"pb-10"}
                  // postClassName={"   border-y bg-white"}
                  style={{ scrollbarWidth: "none" }}
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
                      <p className="sm:max-w-xl pt-20   h-full  text-center  px-6 md:px-6">
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
              {content.length > 0 && (
                <p className="sm:max-w-xl pb-10   text-center  px-6 md:px-6">
                  <p className="mt-1 text-gray-400 ">
                    To see more posts on your home page explore more accounts
                    who are actively posting{" "}
                    <span
                      onClick={() => {
                        navigate("/search");
                      }}
                      className="text-blue-500 font-medium cursor-pointer"
                    >
                      Explore accounts
                    </span>
                  </p>
                </p>
              )}
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
      <div className="w-full border  hidden lg:block mr-10 p-6 pb-6 max-w-md h-fit bg-white mt-8 overflow-hidden relative">
        <div className="flex justify-between mb-6">
          <p className="text-2xl font-bold">Latest News</p>
        </div>
        {news.length <= 0 ? (
          <div className="mt-4">
            <p className="text-2xl text-gray-400 font-bold">
              No news right now
            </p>
            <p className="leading-tight text-gray-400 text-sm mt-1">
              The latest news of your interest will be shown here as they are
              readily available.
            </p>
          </div>
        ) : (
          <div
            className="flex gap-6 overflow-x-auto h-72 snap-x snap-mandatory"
            ref={scrollContainerRef}
            style={{ scrollbarWidth: "none" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {news
              .filter(
                (newsItem) =>
                  newsItem.source.name !== "[Removed]" ||
                  newsItem.urlImage != null
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-end  relative bg-gray-100 transition-all w-4/5 min-h-full overflow-hidden snap-center group"
                >
                  {/* Background Image */}
                  <img
                    className="object-cover absolute inset-0 w-full h-full z-10"
                    src={item.urlToImage}
                    alt={item.title}
                  />
                  <div className="absolute bottom-0 top-0 h-full z-20 w-full bg-gradient-to-t from-black to-transparent"></div>

                  {/* Foreground Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-14 group-hover:translate-y-0 transition-all">
                    <p className="font-bold leading-tight text-xl  line-clamp-2 text-white">
                      {item.title}
                    </p>
                    <p className="text-white leading-tight line-clamp-2 mt-0.5">
                      <span>{item.source.name}</span> {"  "}
                      <span className="font-bold px-0.5">·</span>
                      {"  "} <span>{item.author}</span>
                    </p>
                    <p className="text-xs text-gray-200  mt-2 transition-all line-clamp-3 group-hover:line-clamp-4">
                      {item.content || item.description}
                    </p>
                    <p
                      onClick={() => {
                        window.open(item.url, "_blank");
                      }}
                      className="border border-white justify-self-end text-white hover:text-black hover:bg-white px-4 py-2  opacity-0  group-hover:opacity-100 w-fit font-medium mt-4 cursor-pointer"
                    >
                      Visit page
                    </p>
                  </div>

                  {/* Hover Overlay */}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserHome;
