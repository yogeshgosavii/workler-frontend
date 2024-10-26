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
import Jobs from "./profileTabs/Jobs";
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
  const [currentTab, setCurrentTab] = useState("Posts");
  const [tabIndex, setTabIndex] = useState(1);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState({ userDetails: true ,posts:true});
  const [selectedJob, setSelectedJob] = useState("");
  const [approached, setApproached] = useState(null);
  const [applications, setapplications] = useState([]);
  const [atTop, setAtTop] = useState(0);
  const profileService = useProfileApi();
  const jobService = useJobApi();
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUserDetails = useSelector((state) => state.auth.user);
  const [currentUserJobData, setcurrentUserJobData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [worksAt, setWorksAt] = useState("");
  const [latestEducation, setLatestEducation] = useState("");

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

  console.log("details", currentUserDetails, userId);
  const [saved, setSaved] = useState(false);
  const profileRef = useRef();
  console.log(userId);

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, userDetails: true }));
      try {
        const response = await authService.fetchUserDetailsById(userId);
        console.log("response:", response);
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
        console.log("userPosts:", response);
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
        console.log("job details:", response);
        setcurrentUserJobData(response);
        console.log("jobdata", response);
      } catch (error) {
        console.error("Failed to fetch job details", error);
      } finally {
        setLoading((prev) => ({ ...prev, jobData: false }));
      }
    };

    const fetchFollowers = async () => {
      setLoading((prev) => ({ ...prev, followersData: true }));
      try {
        const response = await followService.getFollowers(userId);
        setFollowers(response);
        setIsFollowing(
          response.some((follow) => follow.following._id === userId)
        );
        console.log("followData", response);
      } catch (error) {
        console.error("Failed to fetch follow details", error);
      } finally {
        setLoading((prev) => ({ ...prev, followersData: false }));
      }
    };

    if (userId) {
      fetchJobData();
      fetchData();
      fetchPostData();
      fetchFollowers();

      console.log(currentUserDetails, userDetails);

      if (
        currentUserDetails?.accountType == "Candidate" &&
        userDetails?.accountType == "Employeer"
      ) {
      }
    }
  }, [userId]);

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
        console.log("qualification:", qualificationData);
        setQualification(qualificationData);

        qualificationData.workExperience.map((item) => {
          if (item.joiningDate && !item.leavingDate) {
            setWorksAt(item);
          }
        });
        const latestEducationData = qualificationData.education.reduce((closest, item) => {
          const itemDate = new Date(item.end_month);
          const closestDate = new Date(closest.end_month);
  
          return Math.abs(itemDate - currentDate) <
            Math.abs(closestDate - currentDate)
            ? item
            : closest;
        });

        setLatestEducation(latestEducationData)
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
        console.log("jobData:", jobData);
        setJobData(jobData);
      } catch (error) {
        console.error("Failed to fetch qualification data", error);
      } finally {
        setLoading((prev) => ({ ...prev, jobPost: false }));
      }
    };

    const checkSaved = async () => {
      console.log("Hello");

      setLoading((prev) => ({ ...prev, checkSaved: true }));
      try {
        const saveData = await savedService.checkSaved({
          userId: currentUserDetails._id,
          saved_content: userDetails._id,
        });
        console.log("saved:", saveData);
        setSaved(saveData.exists);
      } catch (error) {
        console.error("Failed to fetch saved data", error);
      } finally {
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
        console.log("approached", response);
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
    }
    else if( currentUserDetails?.account_type == "Candidate" &&
      userDetails?.account_type == "Candidate"){
      fetchQualificationData();

    }
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
      console.log(response);
    } catch (error) {
      console.error("Failed to save candidate", error);
    }
  };

  const createApproach = async (job) => {
    try {
      console.log(job);

      setApproaching(false);
      console.log(approached);

      if (approached &&(approached.user == userDetails._id && approached.job._id == job._id)) {
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

      console.log(response);
    } catch (error) {}
  };

  const unsaveProfie = async () => {
    try {
      console.log();

      setSaved(false);
      const response = await savedService.unsave(userDetails._id);
      console.log(response);
      
    } catch (error) {
      console.error("Failed to unsave candidate", error);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (profileRef.current) {
        const currentScrollY = profileRef.current.scrollTop;
        console.log("Hello");

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
    if (loading.userDetails ||loading.posts) {
      return  <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
      <svg
        class="text-white animate-spin"
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
    </div>;
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
          columns={"grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3"}
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
        return (
          <div className="px-4  py-4">
            <p className="font-medium text-sm mb-2">Recently posted jobs</p>
            {currentUserJobData?.map((job, index) => (
              <div
                onClick={() => {
                  navigate(`/job/${job._id}`);
                }}
                className={`flex py-2 items-start  justify-between ${
                  index < currentUserJobData.length - 1
                    ? "border-b cursor-pointer"
                    : ""
                } `}
                key={job.id}
              >
                <div className="flex gap-2 ">
                  <UserImageInput
                    image={userDetails.profileImage.compressedImage ||companyDefaultImage}
                    isEditable={false}
                    imageHeight={40}
                  />
                  <div className="-mt-1">
                    <p className="text-lg font-semibold">{job.job_role}</p>
                    <p className="text-xs text-gray-800 text-wrap">
                      {job?.location?.address}
                    </p>
                    {job.updatedAt ? (
                      <p className="text-xs mt-0.5 text-gray-400">
                        Updated{" "}
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
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    const followResponse = await followService.createFollow({
      user: currentUserDetails._id,
      following: userId,
    });
    setIsFollowing(true);
    setFollowers((prev) => [...prev, followResponse]);
    console.log(followResponse);
  };
  const unfollow = async () => {
    const unfollowResponse = await followService.unfollow(
      currentUserDetails._id,
      userId
    );
    setIsFollowing(false);
    setFollowers(
      followers.filter((follow) => follow.user._id != currentUserDetails._id)
    );
    console.log(unfollowResponse);
  };
  return (
    <div className=" flex gap-8 sm:p-10 sm:py-6 bg-gray-50  w-full justify-center">
      <div
        ref={profileRef}
        style={{
          scrollbarWidth:"none"
        }}
        className={`${
          !userId && "hidden"
        }  w-full flex-1 transition-all  ${
          approaching ? "overflow-y-hidden" : "overflow-y-auto"
        }  flex-grow sm:rounded-3xl ${showProfileImage && "pointer-events"}`}
      >
        {approaching && currentUserJobData && (
          <div
            className={`absolute sm:w-[50%] flex flex-col gap-4 px-4 md:px-6 py-4 w-full md:w-[53%] transition-all ${
              !approaching ? "translate-y-full" : "translate-y-0"
            } h-full z-30 -mt-5  border  bg-white`}
          >
            <div className="flex justify-between gap-4">
              <p className="mb-5 text-lg">
                {" "}
                Approch the user for one the following job
              </p>
              <svg
                onClick={() => {
                  setApproaching(false);
                }}
                className="h-8 w-8 text-gray-800 pointer-events-auto transition-all duration-500 ease-in-out transform"
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
            {currentUserJobData.map((job) => (
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
                  className="px-6 py-1 pb-1.5 mt-2 bg-blue-500 text-white font-medium rounded-full w-fit"
                >
                  Approach
                </button>
              </div>
            ))}
          </div>
        )}
        {showProfileImage && (
          <div
            onClick={() => setShowProfileImage(false)}
            className="h-screen -ml-[34px] w-full top-0 bg-white opacity-85 z-50 fixed"
          ></div>
        )}
        <div className="flex relative  flex-wrap">
          <div
            className={` w-full border-t sm:rounded-t-3xl  fixed sm:sticky  sm:border-x  z-20 top-0   px-4 sm:px-6 py-4 sm:py-6 bg-white flex `}
          >
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
                <p className="sm:text-2xl  font-semibold">
                  {atTop > 100 ? userDetails?.username : "Profile"}
                </p>
                {/* <div className="flex gap-1 mt-0.5 items-center">
                  <span className="h-2 w-2 rounded-full shadow-lg bg-green-500"></span>
                  <p className="text-xs text-gray-400 -mt-px">
                    Currently active
                  </p>
                </div> */}
              </div>
            </div>
          </div>
          <div className="flex border-t sm:border-t-0 pt-8 pb-6 mt-10 sm:mt-0 flex-grow sm:border-x px-4 md:px-6 gap-3 bg-white justify-center flex-col">
            {loading.userDetails || !userDetails ? (
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
                        <p className="text-lg font-light sm:font-normal sm:text-xl text-gray-600">
                          {userDetails?.username || "Username"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-3 flex flex-col gap-2">
                  <div className="flex mt-2  order-1 text-gray-400 items-end font-medium text-sm ">
                    <p>
                      {/* <span>{userDetails.location?.address} · </span> */}
                      {followers.length > 0 ? followers.length : 0}
                      <span className="  font-normal">
                        {" "}
                        {followers > 1 ? "followers" : "follower"}
                      </span>{" "}
                      {userDetails?.account_type == "Candidate" && (
                        <span>
                          ·{" "}
                          {userDetails?.followings
                            ? userDetails?.followings
                            : 0}{" "}
                          <span className="  font-normal">following</span>
                        </span>
                      )}
                    </p>
                  </div>
                  {
                    userDetails.bio && (
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
                              {worksAt && "·"}
                                {" "}
                                Completed {latestEducation.course} from{" "}
                                {latestEducation.university}
                              </span>
                            )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
                <span className="font-medium ml-1">
                  {" "}
                  {approached?.job?.job_role}
                </span>
                {/* <p className="text-sm text-gray-400 truncate line-clamp-2 text-wrap">{approached?.job?.description}</p> */}
              </p>
            )}
            {applications?.map((application) => {
              return (
                application.user._id == userDetails._id && (
                  <p className="text-sm bg-blue-50 px-4 py-1 rounded-md text-blue-500 w-fit">
                    Applied for{" "}
                    <span className="font-medium">
                      {application.job.job_role}
                    </span>
                  </p>
                )
              );
            })}
            {!loading.userDetails && (
              <div className="flex gap-4 flex-wrap">
                {(currentUserDetails.account_type == "Candidate" ||
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
                      className="w-fit px-5 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center  border-blue-500 text-blue-500 border-2 py-1 rounded-full "
                    >
                    Following
                    </button>
                  ) : (
                    <button
                      // href={jobDetails?.job_url}
                      onClick={() => {
                        follow();
                      }}
                      className="w-fit px-5 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-white bg-blue-500 sm:hover:bg-blue-600 py-1 rounded-full "
                    >
                     Follow
                    </button>
                  ))}

                {currentUserDetails.account_type === "Employeer" &&
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
                      className="w-fit px-5 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5 items-center justify-center text-white bg-blue-500 sm:hover:bg-blue-600 py-1 rounded-full"
                    >
                      Approach
                    </button>
                  )}
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
                {!loading.userDetails &&
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
                      className="w-fit px-5 py-1 text-nowrap flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-blue-500 border-2 border-blue-500  sm:hover:bg-blue-50   rounded-full"
                    >
                      Save 
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div
          className={`md:border-t sticky md:-top-px top-16 -mt-px  bg-white md:mb-4 z-20 transition-all ease-in-out `}
        >
          <div
            style={{
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
            className={`flex-grow z-20  max-w-full overflow-x-auto border-b  ${
              atTop > 340 ? "rounded-t-3xl sm:border" : "sm:border-x "
            } w-full   sm:top-0 gap-3 bg-white font-medium flex`}
          >
            <div className="flex w-full pt-1">
              {[
                ...(userDetails?.account_type === "Employeer"
                  ? [
                      "About",
                      "Posts",
                      currentUserDetails.account_type != "Employeer"
                        ? "Jobs"
                        : null,
                      "People",
                    ]
                  : ["Home", "Posts", "Qualification"]),
              ]
                .filter(Boolean)
                .map((tab, index, arr) => (
                  <p
                    key={tab}
                    onClick={() => {
                      setCurrentTab(tab);
                      setTabIndex(index);
                    }}
                    className={` text-base  md:text-lg mb-1 truncate font-medium md:font-semibold cursor-pointer ${
                      tab === currentTab ? "z-20 text-blue-500" : ""
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
                    ? currentUserDetails?.account_type === "Employeer"
                      ? 3
                      : 4
                    : 3)) *
                tabIndex
              }%`,
              transition: "left 0.2s ease-in-out",
            }}
            className={`w-1/${
              userDetails?.account_type === "Employeer"
                ? currentUserDetails?.account_type === "Employeer"
                  ? "3"
                  : "4"
                : "3"
            } h-[2px] md:h-1 z-30 rounded-full bottom-0 left-0 bg-blue-500 absolute`}
          ></div>
        </div>

        <div>{renderTabContent()}</div>
      </div>
      <div className="hidden sticky top-20 w-full max-w-lg flex-col gap-5 xl:flex">
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
            <p className="bg-blue-500 h-fit rounded-full text-white font-medium px-3 py-1">
              Follow
            </p>
          </div>
        </div>
       
      </div>
    </div>
  );
}

export default UserProfileView;
