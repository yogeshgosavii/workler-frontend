import React, { useEffect, useRef, useState } from "react";
import authService from "../services/authService";
import UserImageInput from "./Input/UserImageInput";
import profileImageDefault from "../assets/user_male_icon.png";
import Qualification from "./profileTabs/Qualification";
import Home from "./profileTabs/Home";
import useProfileApi from "../services/profileService";
import useJobApi from "../services/jobService";
import Posts from "./profileTabs/Posts";
import { useNavigate, useParams } from "react-router-dom";
import About from "./profileTabs/About";
import UserPostedJobs from "./profileTabs/UserPostedJobs";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../features/auth/authSlice";
import approachService from "../services/approachService";
import { formatDistanceToNow } from "date-fns";
import JobProfileView from "./JobProfileView";
import applicationService from "../services/applicationService";
import { getPostByUserId } from "../services/postService";
import followService from "../services/followService";
import savedService from "../services/savedService";
import companyDefaultImage from "../assets/companyDefaultImage.png";

function UserProfileView({ userId = useParams().userId }) {
  // const { userId } = useParams();

  const [userDetails, setUserDetails] = useState(null);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [qualification, setQualification] = useState();
  const [settings, setSettings] = useState(false);
  const [postData, setpostData] = useState();
  const [approaching, setApproaching] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState({ userDetails: false, posts: true });
  const [selectedJob, setSelectedJob] = useState("");
  const [approached, setApproached] = useState(null);
  const [applications, setapplications] = useState([]);
  const [atTop, setAtTop] = useState(0);
  const profileService = useProfileApi();
  const jobService = useJobApi();
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(true);
  const currentUserDetails = useSelector((state) => state.auth.user);
  const [currentUserJobData, setcurrentUserJobData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [worksAt, setWorksAt] = useState("");
  const [latestEducation, setLatestEducation] = useState("");
  const [savedCheckLoading, setSavedCheckLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(
    currentUserDetails ? "Posts" : "Home"
  );
  const [tabIndex, setTabIndex] = useState(currentUserDetails ? 1 : 0);

  // const handleBackButton = () => {
  //   console.log("Hello");

  //   if (selectedJob!=("" || null)) {
  //     setSelectedJob(null);
  //     console.log("Step 1");

  //   } else {
  //     console.log("Step 2");

  //     window.history.back();  // Perform the default system back action
  //   }
  // };

  // useEffect(() => {
  //   const handlePopState = (event) => {
  //     handleBackButton();
  //   };

  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [selectedJob]);

  const [saved, setSaved] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, userDetails: true }));
      try {
        const response = await authService.fetchUserDetailsById(userId);
        console.log(response);

        setUserDetails(response);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      } finally {
        setLoading((prev) => ({ ...prev, userDetails: false }));
      }
    };

    const fetchPostData = async () => {
      try {
        const response = await getPostByUserId(userId);
        setpostData(response);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      } finally {
        setLoading((prev) => ({ ...prev, posts: false }));
      }
    };

    const fetchJobData = async () => {
      setLoading((prev) => ({ ...prev, jobData: true }));
      try {
        const response = await jobService.job.getByUserIds(userId);
        console.log("job", response);

        setcurrentUserJobData(response);
      } catch (error) {
        console.error("Failed to fetch job details", error);
      } finally {
        setLoading((prev) => ({ ...prev, jobData: false }));
      }
    };

    // const fetchFollowers = async () => {
    //   setLoading((prev) => ({ ...prev, followersData: true }));
    //   try {
    //     const response = await followService.getFollowers(userDetails?._id);
    //     console.log(response);

    //     // setFollowers(response);
    //     setIsFollowing(
    //       response.some((follow) => follow.user._id === currentUserDetails._id)
    //     );
    //     setFollowLoading(false);
    //   } catch (error) {
    //     console.error("Failed to fetch follow details", error);
    //   } finally {
    //     setLoading((prev) => ({ ...prev, followersData: false }));
    //     setFollowLoading(false);

    //   }
    // };
    fetchJobData();

    if (userId) {
      fetchData();
      fetchPostData();
      // fetchFollowers();

      if (
        currentUserDetails?.accountType == "Candidate" &&
        userDetails?.accountType == "Employeer"
      ) {
        fetchJobData();
      }
    } else {
      // if (!loading.userDetails) {
      //   navigate("/not-found", { replace: true });
      // }
    }
  }, [userId]);

  useEffect(() => {
    if (userDetails) {
      document.title = userDetails?.username;
      // const favicon = document.querySelector("link[rel='icon']");
      // if (favicon) {
      //   favicon.href = userDetails.profileImage?.originalImage || "/default-icon.png"; // Replace with a default icon URL or user-provided image
      // } else {
      //   // If no favicon tag exists, create one
      //   const newFavicon = document.createElement("link");
      //   newFavicon.rel = "icon";
      //   newFavicon.href = userDetails.profileImage.originalImage || "/default-icon.png";
      //   document.head.appendChild(newFavicon);
      // }
    }

    const fetchConnections = async () => {
      try {
        const followingResponse = await followService.getFollowing(
          userDetails._id
        );

        const followerResponse = await followService.getFollowers(userId);

        console.log("follow", followerResponse);

        setFollowers(followerResponse);
        setFollowings(followingResponse.length);

        setIsFollowing(
          followerResponse.some(
            (follow) => follow.user?._id === currentUserDetails._id
          )
        );
        setFollowLoading(false);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    if (userDetails) {
      fetchConnections();
    }
  }, [userDetails]);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading((prev) => ({ ...prev, applications: true }));
      const applications = await applicationService.getEmployeerApplications(
        currentUserDetails._id
      );
      setapplications(applications);
      setLoading((prev) => ({ ...prev, applications: false }));
    };
    const fetchQualificationData = async () => {
      setLoading((prev) => ({ ...prev, qualification: true }));
      try {
        const qualificationData =
          await profileService.qualification.getQualificationById(userId);
        setQualification(qualificationData);

        qualificationData.workExperience.map((item) => {
          if (item.joiningDate && !item.leavingDate) {
            setWorksAt(item);
          }
        });
        const latestEducationData = qualificationData.education.reduce(
          (closest, item) => {
            const itemDate = new Date(item.end_month);
            const closestDate = new Date(closest.end_month);

            return Math.abs(itemDate - currentDate) <
              Math.abs(closestDate - currentDate)
              ? item
              : closest;
          }
        );

        setLatestEducation(latestEducationData);
      } catch (error) {
        console.error("Failed to fetch qualification data", error);
      } finally {
        setLoading((prev) => ({ ...prev, qualification: false }));
      }
    };

    const fetchUserJobsPosts = async () => {
      setLoading((prev) => ({ ...prev, jobPost: true }));
      try {
        const jobData = await jobService.job.getByUserIds(userId);
        setJobData(jobData);
      } catch (error) {
        console.error("Failed to fetch qualification data", error);
      } finally {
        setLoading((prev) => ({ ...prev, jobPost: false }));
      }
    };

    const checkSaved = async () => {
      setLoading((prev) => ({ ...prev, checkSaved: true }));
      try {
        const saveData = await savedService.checkSaved({
          userId: currentUserDetails?._id,
          saved_content: userDetails?._id,
        });

        setSaved(saveData.exists);
      } catch (error) {
        console.error("Failed to fetch saved data", error);
      } finally {
        setSavedCheckLoading(false);
        setLoading((prev) => ({ ...prev, checkSaved: false }));
      }
    };

    const checkApproached = async () => {
      setLoading((prev) => ({ ...prev, checkApproached: true }));
      try {
        const response = await approachService.checkApproach({
          userId: userId,
          employeerId: currentUserDetails._id,
        });
        setApproached(response.data[0]);
        setLoading((prev) => ({ ...prev, checkApproached: false }));
      } catch (error) {}
    };
    checkSaved();

    if (
      currentUserDetails?.account_type == "Employeer" &&
      userDetails?.account_type == "Candidate"
    ) {
      checkApproached();
      fetchUserJobsPosts();
      fetchApplications();
    } else if (userDetails?.account_type != "Employeer") {
      fetchQualificationData();
    }
    // fetchQualificationData();
  }, [userDetails]);

  const saveProfie = async () => {
    try {
      setSaved(true);
      const response = await savedService.save({
        contentType: "profile",
        user: currentUserDetails._id,
        saved_content: userDetails._id,
      });
      // if (response) {
      //   dispatch(
      //     updateUserDetails({
      //       saved_profies: [
      //         ...(currentUserDetails.saved_profies || []),
      //         userId,
      //       ],
      //     })
      //   );
      // }
    } catch (error) {
      console.error("Failed to save candidate", error);
    }
  };

  const createApproach = async (job) => {
    try {
      setApproaching(false);

      if (
        approached &&
        approached.user == userDetails._id &&
        approached.job._id == job._id
      ) {
        const response = await approachService.updateStatus({
          id: approached._id,
          status: "approached",
        });

        setApproached(response);
      } else {
        const response = await approachService.createApproach({
          user: userId,
          job: job._id,
          employeer: currentUserDetails._id,
        });
        setApproached(response);
      }
    } catch (error) {}
  };

  const unsaveProfie = async () => {
    try {
      setSaved(false);
      const response = await savedService.unsave(userDetails._id);
    } catch (error) {
      console.error("Failed to unsave candidate", error);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (profileRef.current) {
        const currentScrollY = profileRef.current.scrollTop;

        setAtTop(currentScrollY); // Allow for a small range near the top
      }
    };

    const profileElement = profileRef.current;
    if (profileElement) {
      profileElement.addEventListener("scroll", handleScroll);
    }

    // Cleanup the event listener on unmount
    return () => {
      if (profileElement) {
        profileElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const renderTabContent = () => {
    if (loading.userDetails || loading.posts) {
      return (
        <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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
      );
    }

    switch (currentTab) {
      case "Home":
        return (
          <Home
            user={userDetails}
            isEditable={false}
            loading={loading}
            postData={postData}
            setCurrentTab={setCurrentTab}
          />
        );
      case "Qualification":
        return (
          <Qualification
            isEditable={false}
            loading={loading}
            user={userDetails}
            educationData={qualification?.education}
            skillData={qualification?.skills}
            workExperienceData={qualification?.workExperience}
            projectData={qualification?.projectDetails}
          />
        );
      case "Posts":
        return (
          <Posts
            className={"pb-8 "}
            columns={"grid-cols-1  2xl:grid-cols-3"}
            postClassName={"w-full"}
            postData={postData}
            setPostData={setpostData}
            userDetails={userDetails}
            isEditable={false}
          />
        );
      case "About":
        return <About isEditable={false} userDetails={userDetails} />;
      case "Jobs":
        return currentUserJobData?.length > 0 ? (
          <div className="px-4  py-4 bg-white sm:border sm:rounded-b-3xl">
            <p className="font-medium text-sm mb-2">Recently posted jobs</p>
            {currentUserJobData?.map((job, index) => (
              <div
                onClick={() => {
                  navigate(`/job/${job._id}`);
                }}
                className={`flex py-2 items-start   justify-between ${
                  index < currentUserJobData.length - 1
                    ? "border-b cursor-pointer"
                    : ""
                } `}
                key={job.id}
              >
                <div className="flex gap-3 ">
                  <UserImageInput
                    image={
                      userDetails.profileImage.compressedImage ||
                      companyDefaultImage
                    }
                    isEditable={false}
                    imageHeight={40}
                  />
                  <div className="-mt-1">
                    <p className="text-lg font-semibold">{job.job_role}</p>
                    <p className="text-sm text-gray-600 text-wrap -mt-px">
                      {job?.location?.address}
                    </p>
                    {/* {job.updatedAt ? (
                      <p className="text-sm -mt-0.5 text-gray-400">
                        {formatDistanceToNow(
                          new Date(job.updatedAt || job.job_post_date),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>
                    ) : (
                      <p className="text-xs mt-0.5 text-gray-400">
                        Posted{" "}
                        {formatDistanceToNow(
                          new Date(job.createdAt || job.job_post_date),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>
                    )} */}
                    <p className="text-xs text-gray-400">
                      {/* Posted on{" "} */}
                      {new Date(job.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {/* at{" "}
              <span>
                {new Date(job.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span> */}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="max-w-xl pt-12 text-center sm:h-full h-fit px-6 md:px-6">
            <p className="text-2xl font-bold text-gray-500">
              No Jobs Posted Yet
            </p>
            <p className="mt-1 text-gray-400">
              Job posted by this account will appear here once they submit it
            </p>
            {/* <p onClick={()=>{navigate("/jobs")}} className="text-blue-500 font-medium cursor-pointer">Explore Jobs</p> */}
          </p>
        );
      default:
        return null;
    }
  };

  if (selectedJob) {
    return (
      <div className="w-full md:w-2/3 overflow-y-auto z-40 bg-white">
        <JobProfileView
          crossButton={true}
          onBack={handleBackButton}
          jobId={selectedJob}
        />
      </div>
    );
  }
  const follow = async () => {
    setFollowLoading(true);
    const followResponse = await followService.createFollow({
      user: currentUserDetails._id,
      following: userId,
    });
    setIsFollowing(true);
    setFollowers((prev) => [...prev, followResponse]);
    setFollowLoading(false);
  };
  const unfollow = async () => {
    setFollowLoading(true);
    setLoading(true);
    const unfollowResponse = await followService.unfollow(
      currentUserDetails._id,
      userId
    );
    setIsFollowing(false);
    setFollowers(
      followers.filter((follow) => follow.user._id != currentUserDetails._id)
    );
    setLoading(false);
    setFollowLoading(false);
  };
  return (
    <div className=" flex gap-8 sm:p-10 sm:py-6 bg-gray-50 h-full  w-full justify-center">
      {(showProfileImage || approaching) && (
        <div
          onClick={() => {
            setShowProfileImage(false);
            setApproaching(false);
          }}
          className={`h-screen  w-full top-0 absolute inset-0  bg-background/95  backdrop-blur supports-[backdrop-filter]:bg-background/60      z-50  `}
        ></div>
      )}
      {approaching && currentUserJobData && (
        <div
          className={`absolute  shadow-xl flex flex-col  gap-4 px-4 md:px-6 py-4 w-full transition-all ${
            !approaching ? "" : "translate-y-0"
          } z-50 sm:top-1/4 md:left-auto left-0 md:max-w-2xl sm:h-fit sm:max-h-82 overflow-y-auto h-full   sm:border  bg-white`}
        >
          <div className="flex justify-between gap-4">
            <p className="mb-5 text-lg font-medium"> Jobs listed</p>
            <svg
              onClick={() => {
                setApproaching(false);
              }}
              className="h-6 w-6 text-gray-800 pointer-events-auto transition-all duration-500 ease-in-out transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
                className="transition-all duration-500 ease-in-out"
              />
            </svg>
          </div>
          {currentUserJobData.length <= 0 && (
            <p className="max-w-xl pt-20 text-center sm:h-full h-fit px-6 md:px-6">
              <p className="text-2xl font-bold text-gray-500">
                No Job Posted Yet
              </p>
              <p className="mt-1 text-gray-400">
                Post a job first to approach candidates.
              </p>
            </p>
          )}
          {/* {currentUserJobData.map((job) => (
              <div className="border bg-gray-50 flex flex-col gap-2 p-3 rounded-lg">
                <p className="font-medium text-lg">{job.job_role}</p>
                <p className="truncate line-clamp-3 text-wrap">
                  {job.description}
                </p>
                {job.skills_required && (
                  <p className="flex gap-2 text-sm md:text-xs ">
                    {job.skills_required.map((skill) => (
                      <span className="bg-purple-100 text-purple-500 px-2 py-1 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </p>
                )}
                <button
                  onClick={() => {
                    createApproach(job);
                  }}
                  className="px-6 py-1 pb-1.5 mt-2 bg-gray-800 text-white font-medium rounded-full w-fit"
                >
                  Approach
                </button>
              </div>
            ))} */}
        </div>
      )}
      <div
        ref={profileRef}
        style={{
          scrollbarWidth: "none",
        }}
        className={`${!currentUserDetails && "sm:mt-14 lg:mt-0"} ${
          !userId && "hidden"
        } sm:max-w-xl w-full flex-1 transition-all  ${
          approaching ? "overflow-y-hidden" : "overflow-y-auto"
        }  flex-grow  ${showProfileImage && "pointer-events"}`}
      >
        <div className="flex relative  flex-wrap">
          <div
            className={` w-full border-t  fixed sm:sticky  sm:border-x  z-20 top-0   px-4 sm:px-6 py-4 sm:py-6 gap-2 bg-white flex justify-between items-center`}
          >
            <div className="flex gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-8 shrink-0 -ml-2.5"
                onClick={() => {
                  window.history.back();
                }}
              >
                <path
                  fill-rule="evenodd"
                  d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                  clip-rule="evenodd"
                />
              </svg>
              {true && (
                <div className="flex w-full items-center gap-4">
                  {atTop >= 100 && (
                    <UserImageInput
                      isEditable={false}
                      image={
                        userDetails?.profileImage?.compressedImage ||
                        profileImageDefault
                      }
                      imageHeight="40"
                    />
                  )}
                  <div className="flex flex-col -mt-1 justify-center">
                    <p className="text-xl  font-semibold text-wrap w-full truncate break-words max-w-40 overflow-hidden line-clamp-1"> 
                      {atTop > 100 ? (
                        userDetails?.username
                      ) : (
                        <p className="text-2xl py-[5px]">Profile</p>
                      )}
                    </p>
                    {/* <div className="flex gap-1 mt-0.5 items-center">
                  <span className="h-2 w-2 rounded-full shadow-lg bg-green-500"></span>
                  <p className="text-xs text-gray-400 -mt-px">
                    Currently active
                  </p>
                </div> */}
                  </div>
                </div>
              )}
            </div>
            <p onClick= {()=>{navigate("/login")}} className="h-full flex items-center bg-gray-800 border px-4 py-[5px] rounded-md font-medium sm:hidden text-white border-gray-800">Login</p>
          </div>
          <div className="flex border-t sm:border-t-0 pt-8 pb-6 mt-10 sm:mt-0 flex-grow sm:border-x px-4 md:px-6 gap-3 bg-white justify-center flex-col">
            {loading.userDetails ? (
              <div className="animate-pulse mt-2">
                <div className="flex  items-center">
                  <div className="h-[70px] bg-gray-200 w-[70px] rounded-full mb-2"></div>
                  <div className=" w-32 ml-2">
                    <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md mb-2 w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded-md mt-2"></div>
                <div className="h-3 bg-gray-200 rounded-md mt-2"></div>
                <div className="h-3 bg-gray-200 rounded-md mt-2 w-1/2"></div>
                {/* <div className="flex  items-center mt-4">
                <div className="h-5 bg-gray-200 w-5 rounded-full"></div>
                <div className="h-3 w-32 bg-gray-200 rounded-md ml-2"></div>
              </div>
              <div className="flex  items-center mt-1">
                <div className="h-5 bg-gray-200 w-5 rounded-full"></div>
                <div className="h-3 w-32 bg-gray-200 rounded-md ml-2"></div>
              </div> */}

                <div className="flex mt-5">
                  <div className="h-3 w-20 bg-gray-200 rounded-md "></div>
                  <div className="h-3 w-20 bg-gray-200 rounded-md ml-2"></div>
                </div>
              </div>
            ) : (
              userDetails && (
                <div className="mt-2 flex relative  flex-col ">
                  <div className="flex mb-4 mt-1  w-full gap-4  items-center">
                    <UserImageInput
                      onClick={() => {
                        setShowProfileImage(true);
                      }}
                      imageBorder={showProfileImage ? "none" : "2"}
                      className={`transition-all ease-in-out absolute  blur-none  duration-300 ${
                        showProfileImage
                          ? " ml-[40%] md:ml-[45%]  z-50 translate-y-[200%] scale-[3.5] "
                          : ""
                      }`}
                      imageClassName={showProfileImage ? "shadow-3xl" : ""}
                      isEditable={false}
                      image={
                        userDetails?.profileImage?.originalImage ||
                        userDetails?.profileImage ||
                        profileImageDefault
                      }
                      imageHeight="70"
                    />
                    <div className="flex w-full ml-20  justify-between items-center">
                      <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                          {userDetails?.account_type == "Employeer"
                            ? userDetails.company_details?.company_name
                            : userDetails?.personal_details?.firstname +
                              " " +
                              userDetails?.personal_details?.lastname}
                        </h1>
                        <div className="flex  gap-2">
                          <p className="text-lg font-light sm:font-normal sm:text-xl text-gray-</span>600">
                            {userDetails?.username || "Username"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="order-3 flex flex-col gap-2">
                    <div
                      onClick={() => {
                        if (currentUserDetails) {
                          navigate("/connections/" + userDetails._id);
                        }
                      }}
                      className="flex mt-2 order-1 text-gray-400 items-end font-medium text-sm "
                    >
                      <p>
                        {/* <span>{userDetails.location?.address} · </span> */}
                        {followers.length}
                        <span className="  font-normal">
                          {" "}
                          {followers > 1 ? "followers" : "follower"}
                        </span>{" "}
                        {userDetails?.account_type == "Candidate" && (
                          <span>
                            · {followings || 0}{" "}
                            <span className="  font-normal">following</span>
                          </span>
                        )}
                      </p>
                    </div>
                    {
                      userDetails?.bio && (
                        <div onClick={() => setFormType("userDetails")}>
                          {userDetails.bio}
                        </div>
                      )
                      // : (
                      //   <div
                      //     onClick={() => setFormType("userDetails")}
                      //     className=" text-sm font-normal text-gray-300 px-2 py-1 rounded-lg border w-fit  border-dashed"
                      //   >
                      //     Add a bio +
                      //   </div>
                      // )
                    }
                    {userDetails.account_type == "Candidate" && (
                      <div className="order-2 text-sm -mt-1">
                        <p className=" text-wrap truncate">
                          {worksAt && (
                            <span>
                              Works at {worksAt}{" "}
                              <span className="font-extrabold "></span>
                            </span>
                          )}{" "}
                          {latestEducation && (
                            <span>
                              {worksAt && "·"} Completed{" "}
                              {latestEducation.course} from{" "}
                              {latestEducation.university}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
            {!loading.userDetails && approached != null && (
              <p
                className={`  text-sm flex items-center rounded-md w-fit ${
                  approached.status == "declined"
                    ? "text-red-500"
                    : "border-yellow-600 text-yellow-600 bg-yellow-50"
                } px-2 py-1`}
              >
                Approached {approached?.status == "declined" && "declined"} for{" "}
                <span className=" mx-1"> {approached?.job?.job_role}</span>
                {"   "} role
                {/* <p className="text-sm text-gray-400 truncate line-clamp-2 text-wrap">{approached?.job?.description}</p> */}
              </p>
            )}
            {applications?.map((application) => {
              return (
                application.user._id == userDetails._id && (
                  <p className="text-sm bg-blue-50 px-4 py-1 rounded-md text-gray-800 w-fit">
                    Applied for{" "}
                    <span className="font-medium">
                      {application.job.job_role}
                    </span>{" "}
                    role
                  </p>
                )
              );
            })}
            {!loading.userDetails && currentUserDetails && userDetails && (
              <div className="flex gap-4 flex-wrap justify-between  items-center">
                <div className="flex gap-4">
                  {currentUserDetails._id != userDetails._id &&
                    (currentUserDetails.account_type == "Candidate" ||
                      currentUserDetails.account_type == "Explorer" ||
                      currentUserDetails.account_type == "Employeer" ||
                      currentUserDetails.account_type ==
                        userDetails?.account_type) &&
                    (isFollowing ? (
                      <button
                        // href={jobDetails?.job_url}
                        onClick={() => {
                          unfollow();
                        }}
                        className="w-fit flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium   items-center justify-center  border-gray-800 text-gray-800 border-2 py-1.5 rounded-full "
                      >
                        {followLoading ? (
                          <svg
                            className="inline mx-[8px] w-7 h-7 text-transparent animate-spin fill-gray-800"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          <p className="mx-5">Following</p>
                        )}
                      </button>
                    ) : (
                      <button
                        // href={jobDetails?.job_url}
                        disabled={followLoading}
                        onClick={() => {
                          follow();
                        }}
                        className="w-fit  flex h-fit cursor-pointer md:order-2 disabled:bg-gray-600 text-center order-last gap-2 font-medium   items-center justify-center text-white bg-gray-800 sm:hover:bg-blue-600 py-1.5 rounded-full "
                      >
                        {followLoading ? (
                          <svg
                            className="inline mx-[8px] w-7 h-7 text-transparent animate-spin fill-white"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          <p className="mx-5">Follow</p>
                        )}
                      </button>
                    ))}
                  {currentUserDetails._id != userDetails._id &&
                    currentUserDetails.account_type === "Employeer" &&
                    userDetails?.account_type === "Candidate" &&
                    (approached?.status === "declined" || !approached) &&
                    !loading.checkApproached &&
                    !applications?.some(
                      (application) => application.user._id === userDetails._id
                    ) && (
                      <button
                        onClick={() => {
                          setApproaching((prev) => !prev);
                        }}
                        className="w-fit px-5 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium  items-center justify-center text-white bg-gray-800 sm:hover:bg-blue-600 py-1.5 rounded-full"
                      >
                        Approach
                      </button>
                    )}
                </div>
                {/* {applications?.map(
                application =>{
                  return(
                      <p>Applied for {application.job.job_role}</p>
                    )
                  )
                }
                  
              )} */}
                {/* {applications.map((application) => {
                if (application.user._id == userDetails._id) {
                  return <p>Applied for {application.job.job_role}</p>;
                }
              })} */}
                {/* {!loading.userDetails && currentUserDetails._id != userDetails._id  &&
                  (saved ? (
                    <button
                      onClick={() => unsaveProfie()}
                      className="w-fit px-5 border-2 py-1 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-gray-500  bg-gray-100 sm:hover:bg-gray-200  rounded-full"
                    >
                      Unsave
                    </button>
                  ) : (
                    <button
                      onClick={() => saveProfie()}
                      className="w-fit px-5 py-1 text-nowrap flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-gray-800 border-2 border-gray-800    rounded-full"
                    >
                      Save
                    </button>
                  ))} */}
                {!loading.userDetails &&
                  currentUserDetails._id != userDetails._id &&
                  (savedCheckLoading ? (
                    <svg
                      className=" h-14 w-[60px] rounded-lg  px-2.5 p-3 text-transparent animate-spin fill-blue-500 "
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : saved ? (
                    <svg
                      onClick={(e) => {
                        unsaveProfie();
                        e.stopPropagation();
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      className=" size-12 rounded-lg fill-gray-800 px-2.5 p-3 self-start unliked-animation"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                    </svg>
                  ) : (
                    <svg
                      onClick={(e) => {
                        saveProfie();
                        e.stopPropagation();
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      className=" size-12 rounded-lg  fill-gray-800  px-2.5 p-3 self-start liked-animation"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    </svg>
                  ))}
              </div>
            )}
          </div>
        </div>
        {!currentUserDetails &&
          userDetails?.account_type !== "Employeer" &&
          userDetails && (
            <div
              className={`sticky md:top-0 top-16 bg-white md:mb-4 z-20 transition-all ease-in-out`}
            >
              <div
                style={{
                  overflowX: "auto",
                  scrollbarWidth: "none",
                }}
                className={`flex-grow z-20 absolute max-w-full overflow-x-auto border-b sm:border-x ${
                  atTop > 340 ? "sm:border-t" : ""
                } w-full sticky top-16 sm:top-0 gap-3 bg-white text-gray-800 font-medium flex`}
              >
                <div className="flex w-full pt-1">
                  {[
                    currentUserDetails?._id === userDetails?._id
                      ? "Posts"
                      : null,
                    ...(userDetails?.account_type === "Employeer"
                      ? ["About"]
                      : ["Home", "Qualification"]),
                  ]
                    .filter(Boolean)
                    .map((tab, index, arr) => (
                      <p
                        key={tab}
                        onClick={() => {
                          setCurrentTab(tab);
                          setTabIndex(index);
                        }}
                        className={`text-base md:text-lg mb-1 truncate font-medium md:font-semibold cursor-pointer ${
                          tab === currentTab ? "z-20 text-gray-800" : ""
                        } text-center py-2`}
                        style={{
                          width: `${100 / arr.length}%`,
                        }}
                      >
                        {tab}
                      </p>
                    ))}
                </div>
              </div>
              <div
                style={{
                  left: `${
                    (100 /
                      (userDetails?.account_type === "Employeer"
                        ? currentUserDetails
                          ? 2
                          : 1
                        : currentUserDetails
                        ? 3
                        : 2)) *
                    tabIndex
                  }%`,
                  transition: "left 0.2s ease-in-out",
                }}
                className={`w-1/${
                  userDetails?.account_type === "Employeer"
                    ? currentUserDetails
                      ? "2"
                      : "1"
                    : currentUserDetails
                    ? "3"
                    : "2"
                } h-[2px] md:h-1 z-30 rounded-full bottom-0 left-0 bg-gray-800 absolute`}
              ></div>
            </div>
          )}

        <div className="">{renderTabContent()}</div>
      </div>
      {/* <div className="hidden sticky top-20 w-full max-w-lg flex-col gap-5 xl:flex">
        <div className="border bg-white p-4">
          <p className="text-xl font-semibold mb-5">Releated Accounts</p>
          <div className="flex gap-5 justify-between items-center">
            <div className="flex gap-2">
              <UserImageInput isEditable={false} />
              <div className="">
                <p className="text-lg font-medium">Yogesh Gosavi</p>
                <p className="text-gray-400">yogesh_gosavii</p>
              </div>
            </div>
            <p className="bg-gray-800 h-fit rounded-full text-white font-medium px-3 py-1">
              Follow
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default UserProfileView;
