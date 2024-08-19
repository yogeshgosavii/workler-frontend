import React, { useEffect, useRef, useState } from "react";
import authService from "../services/authService";
import UserImageInput from "./Input/UserImageInput";
import profileImageDefault from "../assets/user_male_icon.png";
import Qualification from "./profileTabs/Qualification";
import Home from "./profileTabs/Home";
import useProfileApi from "../services/profileService";
import useJobApi from "../services/jobService";
import Posts from "./profileTabs/Posts";
import { useParams } from "react-router-dom";
import About from "./profileTabs/About";
import Jobs from "./profileTabs/Jobs";

function UserProfileView() {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [qualification, setQualification] = useState();
  const [settings, setSettings] = useState(false);
  const [postData, setpostData] = useState();
  const [currentTab, setCurrentTab] = useState("Posts");
  const [tabIndex, setTabIndex] = useState(1);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState({ userDetails: true });
  const [atTop, setAtTop] = useState(0);
  const profileService = useProfileApi();
  const jobService = useJobApi()
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

    const fetchUserJobsPosts = async ()=>{
      setLoading((prev) => ({ ...prev, job: true }));
      try {
        const jobData =
          await jobService.job.getByUserIds(userId);
        console.log("jobData:", jobData);
        setJobData(jobData);
      } catch (error) {
        console.error("Failed to fetch qualification data", error);
      } finally {
        setLoading((prev) => ({ ...prev, job: false }));
      }
    }

    if (userId) {
      // Ensure userId exists before making requests
      fetchData();
      fetchQualificationData();
      fetchUserJobsPosts()
    }
  }, [userId]);

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
            isEditable ={false}
          />
        );
      case "About":
        return(
        <About
        isEditable ={false}
        userDetails={userDetails}
        />);
      case "Jobs":
        return (
          <Jobs
          
          jobData={jobData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={profileRef}
      className={`${
        !userId && "hidden"
      } overflow-y-auto w-full flex-1   flex-grow ${
        showProfileImage && "pointer-events"
      }`}
    >
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
                  <p className="text-xs text-gray-400 -mt-px">
                    Currently active
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-t sm:border-t-0 pt-8 pb-6 mt-10 sm:mt-0 flex-grow sm:border-x px-4 md:px-6 gap-3 bg-white justify-center flex-col">
            {loading.userDetails ? (
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
                          : userDetails.personal_details?.firstname +
                            " " +
                            userDetails.personal_details?.lastname}
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
                      {userDetails.followers ? userDetails.followers : 0}
                      <span className="  font-normal"> followers</span>{" "}
                      {userDetails.account_type == "Candidate" && (
                        <span>
                          ·{" "}
                          {userDetails.followings ? userDetails.followings : 0}{" "}
                          <span className="  font-normal">following</span>
                        </span>
                      )}
                    </p>
                  </div>
                  {userDetails.bio && (
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
                            <span className="font-extrabold ">{"·"}</span>
                          </span>
                        )}{" "}
                        {/* {latestEducation && (
                              <span>
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
            <button className="w-fit px-5 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5 border justify-center text-white bg-blue-500 sm:hover:bg-blue-600 py-1.5 rounded-full ">
              Make alie
            </button>
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
                    ? ["About", "Posts", "Jobs", "People"]
                    : ["Home","Posts", "Qualification"]),
                ].map((tab, index, arr) => (
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
                left: `${(100 / (userDetails?.account_type === "Employeer"?4:3)) * tabIndex}%`,
                transition: "left 0.2s ease-in-out",
              }}
              className={`w-1/${userDetails?.account_type === "Employeer"?"4":"3"} h-[2px] md:h-1 z-30 rounded-full bottom-0 left-0 bg-blue-500 absolute`}
            ></div>
        </div>

        <div>{renderTabContent()}</div>
    </div>
  );
}

export default UserProfileView;
