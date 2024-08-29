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
  const [loading, setLoading] = useState({ userDetails: true });
  const [selectedJob, setSelectedJob] = useState("");
  const [approached, setApproached] = useState(null);
  const [atTop, setAtTop] = useState(0);
  const profileService = useProfileApi();
  const jobService = useJobApi();
  const currentUserDetails = useSelector((state) => state.auth.user);
  const [currentUserJobData, setcurrentUserJobData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [saved, setSaved] = useState(
    currentUserDetails?.saved_profies?.some((candidate) => candidate == userId)
  );
  const profileRef = useRef();
  console.log(userId);

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, userDetails: true }));
      try {
        const response = await authService.fetchUserDetailsById(userId);
        console.log("response:", response);
        setUserDetails(response);
        setpostData(response.posts);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      } finally {
        setLoading((prev) => ({ ...prev, userDetails: false }));
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

    const fetchQualificationData = async () => {
      setLoading((prev) => ({ ...prev, qualification: true }));
      try {
        const qualificationData =
          await profileService.qualification.getQualificationById(userId);
        console.log("qualification:", qualificationData);
        setQualification(qualificationData);
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

    if (userId) {
      fetchJobData();

      // Ensure userId exists before making requests
      fetchData();
      if (
        currentUserDetails?.accountType == "Employeer" &&
        userDetails?.accountType == "Candidate"
      ) {
        checkApproached();
        fetchQualificationData();
        fetchUserJobsPosts();
      }

      if (
        currentUserDetails?.accountType == "Candidate" &&
        userDetails?.accountType == "Employeer"
      ) {
      }
    }
  }, [userId]);

  const saveProfie = async () => {
    try {
      setSaved(true);
      const response = await authService.updateUserDetails({
        ...currentUserDetails,
        saved_profies: [...(currentUserDetails.saved_profies || []), userId],
      });
      if (response) {
        dispatch(
          updateUserDetails({
            saved_profies: [
              ...(currentUserDetails.saved_profies || []),
              userId,
            ],
          })
        );
      }
    } catch (error) {
      console.error("Failed to save candidate", error);
    }
  };

  const createApproach = async (jobId) => {
    try {
      setApproached(true);
      setApproaching(false);
      const response = await approachService.createApproach({
        user: userId,
        job: jobId,
        employeer: currentUserDetails._id,
      });
      console.log(response);
    } catch (error) {}
  };

  const unsaveProfie = async () => {
    try {
      console.log();

      setSaved(false);
      const response = await authService.updateUserDetails({
        ...currentUserDetails,
        saved_profies: currentUserDetails.saved_profies.filter(
          (candidate) => candidate._id == userId
        ),
      });
      if (response) {
        dispatch(
          updateUserDetails({
            saved_profies: currentUserDetails.saved_profies.filter(
              (candidate) => candidate._id == userId
            ),
          })
        );
      }
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
    if (loading.userDetails) {
      return <div>Loading...</div>;
    }

    switch (currentTab) {
      case "Home":
        return (
          <Home
            user={userDetails}
            isEditable={false}
            loading={loading}
            setCurrentTab={setCurrentTab}
          />
        );
      case "Qualification":
        return (
          <Qualification
            isEditable={false}
            loading={loading}
            educationData={qualification.education}
            skillData={qualification.skills}
            workExperienceData={qualification.workExperience}
            projectData={qualification.projectDetails}
          />
        );
      case "Posts":
        return (
          <Posts
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
          <div  className="px-4  py-4">
          <p className="font-medium text-sm mb-2">Recently posted jobs</p>
            {currentUserJobData?.map((job, index) => (
              <div
                onClick={() => {navigate(`/search/job/${job._id}`)}}
                className={`flex py-2 items-start  justify-between ${
                  index < currentUserJobData.length - 1
                    ? "border-b cursor-pointer"
                    : ""
                } `}
                key={job.id}
              >
                <div className="flex gap-2 ">
                  <UserImageInput
                    image={job.company_Logo}
                    isEditable={false}
                    imageHeight={40}
                  />
                  <div className="-mt-1">
                    <p className="text-lg font-semibold">{job.job_role}</p>
                    <p className="text-xs text-gray-800 text-wrap">
                      {job.location.address}
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

  if(selectedJob){
    return(
      <div className="w-full md:w-2/3 overflow-y-auto z-40 bg-white">
      <JobProfileView crossButton={true} onBack={handleBackButton} jobId={selectedJob}/>
    </div>
    )
  }
  return (
    <div
      ref={profileRef}
      className={`${!userId && "hidden"}  w-full flex-1 transition-all ${
        approaching ? "overflow-y-hidden" : "overflow-y-auto"
      }   flex-grow ${showProfileImage && "pointer-events"}`}
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
                  createApproach(job._id);
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
          className="h-screen  w-full top-0 bg-white opacity-85 z-50 fixed"
        ></div>
      )}
      <div className="flex relative  flex-wrap">
        <div
          className={` w-full border-t  fixed sm:sticky  sm:border-x  z-20 top-0   px-4 py-4 bg-white flex `}
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
            <div className="flex flex-col justify-center">
              <p className="text-xl font-semibold">
                {atTop > 100 ? userDetails?.username : "Profile"}
              </p>
              <div className="flex gap-1 mt-0.5 items-center">
                <span className="h-2 w-2 rounded-full shadow-lg bg-green-500"></span>
                <p className="text-xs text-gray-400 -mt-px">Currently active</p>
              </div>
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
                  <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded-md mt-2"></div>
              <div className="h-3 bg-gray-200 rounded-md mt-1"></div>
              <div className="flex  items-center mt-4">
                <div className="h-5 bg-gray-200 w-5 rounded-full"></div>
                <div className="h-3 w-32 bg-gray-200 rounded-md ml-2"></div>
              </div>
              <div className="flex  items-center mt-1">
                <div className="h-5 bg-gray-200 w-5 rounded-full"></div>
                <div className="h-3 w-32 bg-gray-200 rounded-md ml-2"></div>
              </div>

              <div className="flex mt-4">
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
                    {userDetails?.followers ? userDetails?.followers : 0}
                    <span className="  font-normal"> followers</span>{" "}
                    {userDetails?.account_type == "Candidate" && (
                      <span>
                        ·{" "}
                        {userDetails?.followings ? userDetails?.followings : 0}{" "}
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
                      {userDetails.personal_details.working_at && (
                        <span>
                          Works at {userDetails.personal_details.working_at}{" "}
                          <span className="font-extrabold "></span>
                        </span>
                      )}{" "}
                      {/* {latestEducation && (
                              <span>
                              {"·"}
                                {" "}
                                Completed {latestEducation.course} from{" "}
                                {latestEducation.university}
                              </span>
                            )} */}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {!loading.userDetails && approached != null && (
            <p className="  text-sm flex items-center rounded-md w-fit border-yellow-600 text-yellow-600 bg-yellow-50 px-2 py-1">
              Approached for {approached?.job?.job_role}
              {/* <p className="text-sm text-gray-400 truncate line-clamp-2 text-wrap">{approached?.job?.description}</p> */}
            </p>
          )}
          {!loading.userDetails && (
            <div className="flex gap-4">
              {(currentUserDetails.account_type == "Candidate" ||
                currentUserDetails.account_type == "Explorer" ||
                currentUserDetails.account_type ==
                  userDetails?.account_type) && (
                <button
                  // href={jobDetails?.job_url}
                  className="w-fit px-5 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-white bg-blue-500 sm:hover:bg-blue-600 py-1 rounded-full "
                >
                  {userDetails?.account_type == "Employeer"
                    ? "Follow"
                    : "Create alie"}
                </button>
              )}

              {currentUserDetails.account_type == "Employeer" &&
                !approached &&
                !loading.checkApproached && (
                  <button
                    // href={jobDetails?.job_url}
                    onClick={() => {
                      setApproaching((prev) => !prev);
                    }}
                    className="w-fit px-5 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-white bg-blue-500 sm:hover:bg-blue-600 py-1 rounded-full "
                  >
                    Approach
                  </button>
                )}
              {currentUserDetails.account_type == "Employeer" &&
                !loading.userDetails &&
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
                    className="w-fit px-5 py-1 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-blue-500 border-2 border-blue-500  sm:hover:bg-blue-50   rounded-full"
                  >
                    Save Profile
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`md:border-t sticky md:top-0 top-12  bg-white md:mb-4 z-20 transition-all ease-in-out `}
      >
        <div
          style={{
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
          className={`flex-grow z-20  max-w-full overflow-x-auto border-b sm:border-x ${
            atTop > 340 ? "" : ""
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
  );
}

export default UserProfileView;
