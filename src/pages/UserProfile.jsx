import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import profileImageDefault from "../assets/user_male_icon.png";
import EducationForm from "../components/Forms/EducationForm";
import WorkExperienceForm from "../components/Forms/WorkExperienceForm";
import ProjectForm from "../components/Forms/ProjectForm";
import SkillForm from "../components/Forms/SkillForm";
import PersonalDetailsForm from "../components/Forms/PersonalDetailsForm";
import JobForm from "../components/Forms/JobForm";
import EducationUpdateForm from "../components/Forms/EducationUpdateForm";
import SkillUpdateForm from "../components/Forms/SkillUpdateForm";
import WorkExperienceUpdateForm from "../components/Forms/WorkExperienceUpdateForm"; // Assuming you have this form
import { format, formatDate } from "date-fns";
import useProfileApi from "../services/profileService"; // Adjust the import path
import { logout } from "../features/auth/authSlice";
import useJobApi from "../services/jobService"; // Adjust the import path

import { useNavigate, useLocation, Outlet } from "react-router-dom";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ProjectUpdateForm from "../components/Forms/ProjectUpdateForm";
import UserDetailsForm from "../components/Forms/UserDetailsForm";
import UserImageInput from "../components/Input/UserImageInput";
import authService from "../services/authService";
import JobUpdateForm from "../components/Forms/JobUpdateForm";
import TextInput from "../components/Input/TextInput";
import Button from "../components/Button/Button";
import { useDispatch } from "react-redux";
import About from "../components/profileTabs/About";
import Posts from "../components/profileTabs/Posts";
import Qualification from "../components/profileTabs/Qualification";
import Home from "../components/profileTabs/Home";
import UserPostedJobs from "../components/profileTabs/UserPostedJobs";
import PostForm from "../components/Forms/PostForm";
import { getUserPosts } from "../services/postService";
import FreezeScroll from "../components/FreezeScroll";
import followService from "../services/followService";

// Register necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const UserProfile = () => {
  const [formType, setFormType] = useState(null);
  const [updateFormType, setupdateFormType] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [educationData, setEducationData] = useState([]);
  const [latestEducation, setlatestEducation] = useState(null);
  const [personalData, setPersonalData] = useState(null);
  const [skillData, setSkillData] = useState([]);
  const [workExperienceData, setWorkExperienceData] = useState([]);
  const [worksAt, setworksAt] = useState(null);
  const [projectData, setprojectData] = useState([]);
  const [userDetails, setuserDetails] = useState([] || user);
  const [postData, setPostData] = useState([]);
  const [tabIndex, settabIndex] = useState(1);
  const [followers, setFollowers] = useState(0);
  const [followings, setfollowings] = useState(0);
  const [currentTab, setCurrentTab] = useState("Posts");

  const [jobData, setjobData] = useState();
  const profileApi = useProfileApi();
  const jobApi = useJobApi();

  useEffect(() => {
    document.title = "User Profile";
  }, []);
  const [pageLoading, setpageLoading] = useState(false);
  const [settings, setsettings] = useState(false);
  const [showProfileImage, setshowProfileImage] = useState(false);
  const [descriptionInput, setdescriptionInput] = useState(false);
  const [descriptionInputText, setdescriptionInputText] = useState("");
  const dispatch = useDispatch();

  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      setScrollDirection("down");
    } else if (currentScrollY < lastScrollY) {
      setScrollDirection("up");
    }

    setAtTop(currentScrollY);

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const [loading, setLoading] = useState({
    education: true,
    skills: true,
    workExperience: true,
    projects: true,
    personalDetails: true,
    userDetails: true,
    posts: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, userDetails: true }));

      try {
        const data = await authService.fetchUserDetails();
        console.log(data);
        setuserDetails(data);
        setdescriptionInputText(data.description);
      } catch (error) {
        console.error("Error fetching userDetails data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, userDetails: false }));
      }
    };

    const fetchConnections = async () => {
      try {
        const followingResponse = await followService.getFollowing(user._id);
        console.log("follow", followingResponse);

        setfollowings(followingResponse.length);

        const followerResponse = await followService.getFollowers(user._id);
        setFollowers(followerResponse.length);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchData();
    fetchConnections();
  }, []);

  const [updateForm, setUpdateForm] = useState({
    education: false,
    skills: false,
    workExperience: false,
    projects: false,
    personalDetails: false,
  });
  const [updateData, setUpdateData] = useState({
    education: null,
    skills: null,
    workExperience: null,
    projects: null,
    personalDetails: null,
    job: null,
  });

  const fetchJobData = useCallback(async () => {
    try {
      const data = await jobApi.job.getByUserIds(user._id);

      setjobData(data || []);
    } catch (error) {
      console.error("Error fetching education data:", error);
    } finally {
    }
  }, []);

  const fetchPostData = useCallback(async () => {
    try {
      const data = await getUserPosts();
      setPostData(data);
    } catch (error) {
      console.error("Error fetching education data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, posts: false }));
    }
  }, []);

  const fetchEducationData = useCallback(async () => {
    try {
      const data = await profileApi.education.getAll();
      setEducationData(data);

      if (data.length === 0) {
        return;
      }
      const currentDate = new Date();
      const latestEducationData = data.reduce((closest, item) => {
        const itemDate = new Date(item.end_month);
        const closestDate = new Date(closest.end_month);

        return Math.abs(itemDate - currentDate) <
          Math.abs(closestDate - currentDate)
          ? item
          : closest;
      });

      setlatestEducation(latestEducationData);
    } catch (error) {
      console.error("Error fetching education data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, education: false }));
    }
  }, [profileApi.education, userDetails]);

  const fetchProjectData = useCallback(async () => {
    try {
      const data = await profileApi.projectDetails.getAll();
      setprojectData(data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  }, [profileApi.projectDetails, userDetails]);

  const fetchSkillData = useCallback(async () => {
    try {
      const data = await profileApi.skills.getAll();
      setSkillData(data);
    } catch (error) {
      console.error("Error fetching skill data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, skills: false }));
    }
  }, [profileApi.skills, userDetails]);

  const fetchWorkExperienceData = useCallback(async () => {
    try {
      const data = await profileApi.workExperience.getAll();
      setWorkExperienceData(data);
      data.map((item) => {
        if (item.joiningDate && !item.leavingDate) {
          setworksAt(item);
        }
      });
    } catch (error) {
      console.error("Error fetching work experience data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, workExperience: false }));
    }
  }, [profileApi.workExperience, userDetails]);

  const fetchUserDetails = useCallback(
    async () => {
      setLoading((prev) => ({ ...prev, userDetails: true })); // Set loading state for userDetails to true

      try {
        const data = await authService.fetchUserDetails(); // Fetch userDetails details
        setuserDetails(data); // Update userDetails state with fetched data
        setdescriptionInput(data.description); // Update descriptionInputText state with description from fetched data
      } catch (error) {
        console.error("Error fetching userDetails data:", error); // Log any errors
      } finally {
        setLoading((prev) => ({ ...prev, userDetails: false })); // Set loading state for userDetails to false
      }
    },
    authService.fetchUserDetails,
    userDetails
  );

  useEffect(() => {
    setpageLoading(true);
    fetchEducationData();
    fetchSkillData();
    fetchWorkExperienceData();
    fetchProjectData();
    fetchUserDetails();
    fetchJobData();
    fetchPostData();
    setpageLoading(false);
  }, []);

  const FormComponents = useMemo(
    () => ({
      education: EducationForm,
      personalDetails: PersonalDetailsForm,
      work_experience: WorkExperienceForm,
      projects: ProjectForm,
      skills: SkillForm,
      userDetails: UserDetailsForm,
      job: JobForm,
      post: PostForm,
    }),
    []
  );
  const UpdateFormComponents = useMemo(
    () => ({
      education: EducationUpdateForm,
      workExperience: WorkExperienceUpdateForm,
      projects: ProjectUpdateForm,
      skills: SkillUpdateForm,
      personalDetails: PersonalDetailsForm,
      job: JobUpdateForm,
    }),
    []
  );

  const addDescription = async () => {
    try {
      const response = await authService.updateUserDetails({
        ...userDetails,
        description: descriptionInputText,
      });
      setdescriptionInputText(response.description);
      setuserDetails(response);
      setdescriptionInput(false);
    } catch {
      throw "Error: description error";
    }
  };

  // const handleDrop = (e, id) => {
  //   e.preventDefault();
  //   const draggedItemId = e.dataTransfer.getData("id");
  //   const draggedIndex = userDetailsList.findIndex(
  //     (item) => item.id === draggedItemId
  //   );
  //   const targetIndex = userDetailsList.findIndex((item) => item.id === id);

  //   if (
  //     draggedIndex !== -1 &&
  //     targetIndex !== -1 &&
  //     draggedIndex !== targetIndex
  //   ) {
  //     const updatedList = [...userDetailsList];
  //     const [draggedItem] = updatedList.splice(draggedIndex, 1);
  //     updatedList.splice(targetIndex, 0, draggedItem);
  //   }
  // };

  useEffect(() => {
    // Function to handle popstate event
    const handlePopState = (event) => {
      setsettings(false);
      if (event.state && event.state.formType) {
        setFormType(event.state.formType);
      } else {
        setFormType(null);
      }
    };

    // Add event listener for popstate
    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.formType) {
        setFormType(event.state.formType);
      } else {
        setFormType(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleBackNavigation = () => {
    if (formType || updateFormType) {
      // Clear the selected job and prevent the back navigation
      setFormType(null);
      setupdateFormType(null);
      window.history.pushState(null, null, window.location.pathname);
    } else {
      // If no job is selected, allow the default behavior
      window.history.back();
    }
  };

  // useEffect(() => {
  //   const handlePopState = (event) => {
  //     handleBackNavigation();
  //   };

  //   // Add event listener for popstate
  //   window.addEventListener("popstate", handlePopState);
  //   console.log("Hello");

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [formType,updateFormType]);

  const handleClose = () => {
    setFormType(null);
    setupdateFormType(null);
  };

  // useEffect(() => {
  //   if (formType) {
  //     window.history.pushState({ formType }, "", `profile/${formType}`);
  //   } else {
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   }
  // }, [formType]);

  useEffect(() => {
    // Function to handle popstate event
    const handlePopState = (event) => {
      if (!settings) {
        if (event.state && event.state.updateFormType) {
          setupdateFormType(event.state.updateFormType);
        } else {
          setupdateFormType(null);
        }
      } else {
        setsettings(false);
      }
    };

    // Add event listener for popstate
    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [settings]); // Add settings to the dependency array

  const handleUpdateFormClose = () => {
    setupdateFormType(null);
    // Replace the current history state to remove the formType
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // useEffect(() => {
  //   if (updateFormType) {
  //     // Push new state into history with formType
  //     window.history.pushState(
  //       { updateFormType },
  //       "",
  //       `profile/${updateFormType}`
  //     );
  //   } else {
  //     // Replace state if no formType is present
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   }
  // }, [updateFormType]);

  const renderTabContent = () => {
    if (loading.userDetails || loading.posts) {
      return (
        <div class="grid min-h-[140px]  w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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
            userDetails={userDetails}
            loading={loading}
            user={userDetails}
            setcurrentTab={setCurrentTab}
            isEditable={true}
            postData={postData.slice(0, 2)}
            setupdateFormType={setupdateFormType}
            setUpdateData={setUpdateData}
          />
        );
      case "Qualification":
        return (
          <Qualification
            className={" pb-4"}
            setSkillData={setSkillData}
            skillData={skillData}
            educationData={educationData}
            setEducationData={setEducationData}
            workExperienceData={workExperienceData}
            setWorkExperienceData={setWorkExperienceData}
            projectData={projectData}
            userDetails={userDetails}
            setProjectData={setprojectData}
            loading={loading}
            setFormType={setFormType}
            setUpdateFormType={setupdateFormType}
            setUpdateForm={setUpdateForm}
            setUpdateData={setUpdateData}
          />
        );
      case "Posts":
        return (
          <Posts
            setFormType={setFormType}
            postData={postData}
            className={"pb-5 h-full "}
            columns={"grid-cols-1  2xl:grid-cols-3"}
            postClassName={" h-full"}
            userDetails={userDetails}
            setPostData={setPostData}
          />
        );
      case "About":
        return (
          <About
            setUpdateData={setUpdateData}
            setUpdateForm={setUpdateForm}
            setupdateFormType={setupdateFormType}
            setdescriptionInput={setdescriptionInput}
            descriptionInput={descriptionInput}
            setdescriptionInputText={setdescriptionInputText}
            descriptionInputText={descriptionInputText}
            userDetails={userDetails}
            addDescription={addDescription}
          />
        );
      case "Jobs":
        return (
          <UserPostedJobs
            setFormType={setFormType}
            setUpdateData={setUpdateData}
            setupdateFormType={setupdateFormType}
            jobData={jobData}
            isEditable={true}
            user={userDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FreezeScroll
      freezeScroll={
        formType ||
        updateFormType ||
        settings ||
        showProfileImage ||
        location.pathname === "/profile/settings" ||
        location.pathname === "/profile/settings/preferences" ||
        location.pathname === "/profile/settings/account-settings" ||
        location.pathname === "/profile/settings/saveds" ||
        location.pathname === "/profile/post"
      }
      className={`  flex bg-gray-50 text-gray-800 min-h-screen  justify-center  gap-5`}
    >
      {pageLoading ? (
        <div>Loading...</div>
      ) : (
        <div
          className={`w-screen flex-1 flex gap-10 justify-center  ${
            settings ? "pointer-events-none " : "pointer-events-auto"
          }`}
        >
          {formType && (
            <div className="relative ">
              <div
                onClick={handleClose}
                className="fixed inset-0 z-40  flex justify-center items-center  w-full top-0  bg-background/95 left-10  backdrop-blur supports-[backdrop-filter]:bg-background/60    "
              ></div>
              <div
                className="fixed z-50 w-full border  h-full shadow-2xl top-0 right-0  sm:max-w-lg mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {React.createElement(FormComponents[formType], {
                  onClose: handleClose,
                  setData:
                    formType === "skills"
                      ? setSkillData
                      : formType === "education"
                      ? setEducationData
                      : formType === "work_experience"
                      ? setWorkExperienceData
                      : formType === "personalDetails"
                      ? setPersonalData
                      : formType === "userDetails"
                      ? setuserDetails
                      : formType === "job"
                      ? setjobData
                      : formType == "post"
                      ? setPostData
                      : null,
                  data:
                    formType === "skills"
                      ? skillData
                      : formType === "education"
                      ? educationData
                      : formType === "work_experience"
                      ? workExperienceData
                      : formType === "personalDetails"
                      ? personalData
                      : formType === "userDetails"
                      ? userDetails
                      : formType == "job"
                      ? jobData
                      : formType == "post"
                      ? setPostData
                      : null,
                })}
              </div>
            </div>
          )}

          {updateFormType ? (
            <div className="relative ">
              <div
                onClick={handleClose}
                className="fixed inset-0 z-40  flex justify-center items-center  w-full top-0  bg-background/95 left-10  backdrop-blur supports-[backdrop-filter]:bg-background/60    "
              ></div>

              <div
                className="fixed z-50 w-full border h-full shadow-2xl top-0 right-0  sm:max-w-lg mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {React.createElement(UpdateFormComponents[updateFormType], {
                  onClose: handleUpdateFormClose,
                  data: updateData[updateFormType],
                  setData:
                    updateFormType === "skills"
                      ? setSkillData
                      : updateFormType === "education"
                      ? setEducationData
                      : updateFormType === "workExperience"
                      ? setWorkExperienceData
                      : updateFormType === "projects"
                      ? setprojectData
                      : updateFormType === "job"
                      ? setjobData
                      : updateFormType === "personalDetails"
                      ? setuserDetails
                      : null,
                })}
              </div>
            </div>
          ) : null}
          {/* Profile page */}
          <div className="flex max-h-screen gap-5 sm:px-6 overflow-y-scroll justify-self-center w-full justify-center  ">
            <div
              className={` w-full  sm:max-w-2xl   ${
                (formType || settings || showProfileImage || updateFormType) &&
                "fixed"
              }   md:flex-row transition-all sm:p-6 duration-300 relative  flex-1 h-full `}
            >
              {showProfileImage && (
                <div
                  onClick={() => {
                    setshowProfileImage(false);
                  }}
                  className={`h-screen  w-full top-0 absolute inset-0  bg-background/95  backdrop-blur supports-[backdrop-filter]:bg-background/60    max-w-3xl  z-50  `}
                ></div>
              )}
              <div className="flex gap-4  max-h-min flex-wrap ">
                <div
                  className={`w-full sm:hidden ${
                    formType || updateFormType ? "hidden" : ""
                  } fixed  z-20 md:min-w-[57.6%]  md:border-x md:mt-5 top-0 mb-4 px-4 py-4 bg-white flex justify-between`}
                >
                  <div className="flex items-center gap-4">
                    <svg
                      onClick={() => {
                        window.history.back();
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6 -mt-1"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                      />
                    </svg>
                    {atTop >= 100 && (
                      <UserImageInput
                        isEditable={false}
                        image={
                          userDetails.profileImage?.compressedImage ||
                          userDetails?.profileImage ||
                          profileImageDefault
                        }
                        imageHeight="40"
                      />
                    )}
                    <div className="flex flex-col justify-center">
                      <p className="text-xl font-semibold -mt-0.5">
                        {atTop >= 100 ? (
                          userDetails.username
                        ) : (
                          <p className="text-2xl -mt-px py-[5px]">Profile</p>
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
                  <svg
                    className="h-8 w-8 text-gray-800 pointer-events-auto transition-all duration-500 ease-in-out transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => {
                      setsettings(!settings);
                      if (!settings) {
                        navigate("settings");
                      } else {
                        navigate("/profile");
                      }
                    }}
                  >
                    {location.pathname === "/profile/settings" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                        className="transition-all duration-500 ease-in-out"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                        className="transition-all duration-500 ease-in-out"
                      />
                    )}
                  </svg>
                </div>
                <div className="flex border-t pt-8 pb-6 mt-10 sm:mt-0   flex-grow  sm:border-x  px-4 md:px-6 gap-3 bg-white justify-center flex-col">
                  <div className="w-full hidden sm:flex mb-4 bg-white justify-between ">
                    <div className="flex gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-8 -ml-2.5"
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
                      <p className="text-2xl font-semibold">Profile</p>
                    </div>
                    <svg
                      className="h-8 w-8 text-gray-800 pointer-events-auto transition-all duration-500 ease-in-out transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      onClick={() => {
                        setsettings(!settings);
                        if (!settings) {
                          navigate("settings");
                        } else {
                          navigate("/profile");
                        }
                      }}
                    >
                      {location.pathname === "/profile/settings" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                          className="transition-all duration-500 ease-in-out"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16m-7 6h7"
                          className="transition-all duration-500 ease-in-out"
                        />
                      )}
                    </svg>
                  </div>
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
                    <div className="mt-2 flex relative  flex-col ">
                      <div className="flex mb-4 mt-3  w-full gap-4  items-center">
                        <UserImageInput
                          onClick={() => {
                            if (userDetails?.profileImage) {
                              setshowProfileImage(true);
                            }
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
                              {userDetails.account_type === "Employeer"
                                ? userDetails.company_details?.company_name
                                : `${
                                    userDetails.personal_details?.firstname ||
                                    ""
                                  } ${
                                    userDetails.personal_details?.lastname || ""
                                  }`.trim()}
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
                        <div
                          onClick={() => {
                            navigate("/connections/" + userDetails._id);
                          }}
                          className="flex mt-2  order-1 text-gray-400 items-end font-medium text-sm "
                        >
                          <p>
                            {/* <span>{userDetails.location?.address} · </span> */}
                            {followers || 0}
                            <span className="  font-normal">
                              {" "}
                              followers
                            </span>{" "}
                            {userDetails.account_type == "Candidate" && (
                              <span>
                                · {followings || 0}{" "}
                                <span className="  font-normal">following</span>
                              </span>
                            )}
                          </p>
                        </div>
                        {userDetails.bio ? (
                          <div onClick={() => setFormType("userDetails")}>
                            {userDetails.bio}
                          </div>
                        ) : (
                          <div
                            onClick={() => setFormType("userDetails")}
                            className=" text-sm font-normal text-gray-300 px-2 py-1 mt-3 rounded-lg border w-fit  border-dashed"
                          >
                            Add a bio +
                          </div>
                        )}
                        {userDetails.account_type == "Candidate" && (
                          <div className="order-2 text-sm -mt-1">
                            <p className=" text-wrap truncate">
                              {worksAt && (
                                <span>
                                  Works at {worksAt.companyName}{" "}
                                  <span className="font-extrabold ">{"·"}</span>
                                </span>
                              )}{" "}
                              {latestEducation && (
                                <span>
                                  {" "}
                                  Completed {latestEducation.course} from{" "}
                                  {latestEducation.university}
                                </span>
                              )}
                            </p>
                          </div>
                        )}

                        {userDetails.tags?.length > 0 && (
                          <div className=" mt-4 order-last ">
                            <div className="flex gap-1 max-w-full flex-wrap ">
                              {userDetails.tags?.map((tag) => (
                                <p className="flex rounded-md w-fit px-2 py-0.5 border bg-amber-50 border-amber-600 text-sm text-amber-600 text-nowrap">
                                  {tag}
                                </p>
                              ))}
                            </div>
                            <p className="text-sm mt-1 text-gray-400">
                              These tags will help get you discovered more by
                              relevent people
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setFormType("userDetails")}
                    className="w-full flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5 border justify-center text-gray-600 bg-gray-100 sm:hover:bg-gray-200 py-1.5 rounded-md border-gray-400"
                  >
                    Edit details
                  </button>
                </div>
              </div>
              <div
                className={`sticky w-full top-16 md:top-0 md:mb-4 z-20 transition-all ease-in-out bg-gray-50 ${
                  atTop < 340 ? "pt-0" : "md:pt-[25px]"
                }`}
              >
                <div className=" transition-all ease-in-out">
                  <div
                    style={{
                      overflowX: "auto",
                      scrollbarWidth: "none",
                    }}
                    className={`flex-grow z-20 absolute max-w-full overflow-x-auto border-b sm:border-x ${
                      atTop > 340 ? "md:border-t" : ""
                    } w-full -mt-px sticky top-16 sm:top-0 gap-3 text-gray-800 bg-white font-medium flex`}
                  >
                    <div className="flex w-screen md:w-full pt-1">
                      {[
                        ...(userDetails.account_type === "Employeer"
                          ? ["About", "Posts"]
                          : ["Home", "Posts", "Qualification"]),
                      ].map((tab, index, arr) => (
                        <p
                          key={tab}
                          onClick={() => {
                            setCurrentTab(tab);
                            settabIndex(index);
                          }}
                          className={` text-base  md:text-lg mb-1 truncate font-medium md:font-semibold cursor-pointer ${
                            tab === currentTab ? "z-20 text-gray-800" : ""
                          } text-center py-2`}
                          style={{
                            width: `${
                              100 /
                              (userDetails.account_type === "Employeer" ? 2 : 3)
                            }%`,
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
                          (userDetails.account_type === "Employeer" ? 2 : 3)) *
                        tabIndex
                      }%`,
                      transition: "left 0.2s ease-in-out",
                    }}
                    className={`w-1/${
                      userDetails.account_type === "Employeer" ? "2" : "3"
                    } h-[2px] md:h-1 z-30 rounded-full bottom-0 left-0 bg-gray-800 absolute`}
                  ></div>
                </div>
              </div>

              {/* <div className=" w-full">
              {currentTab == "Home" && (
                <Home
                  userDetails={userDetails}
                  loading={loading}
                  userDetails={userDetails}
                  setcurrentTab={setCurrentTab}
                  postData={postData.slice(0, 2)}
                  setupdateFormType={setupdateFormType}
                  setUpdateData={setUpdateData}
                />
              )}
              {currentTab == "Qualification" && (
                <Qualification
                  className={""}
                  setSkillData={setSkillData}
                  skillData={skillData}
                  educationData={educationData}
                  setEducationData={setEducationData}
                  workExperienceData={workExperienceData}
                  setWorkExperienceData={setWorkExperienceData}
                  projectData={projectData}
                  setProjectData={setprojectData}
                  loading={loading}
                  setFormType={setFormType}
                  setUpdateFormType={setupdateFormType}
                  setUpdateForm={setUpdateForm}
                  setUpdateData={setUpdateData}
                />
              )}
              {currentTab == "Posts" && (
                <Posts
                  setFormType={setFormType}
                  postData={postData}
                  userDetails={userDetails}
                  setPostData={setPostData}
                />
              )}

              {currentTab == "About" && !loading.userDetails && (
                <About
                  setUpdateData={setUpdateData}
                  setUpdateForm={setUpdateForm}
                  setupdateFormType={setupdateFormType}
                  setdescriptionInput={setdescriptionInput}
                  descriptionInput={descriptionInput}
                  setdescriptionInputText={setdescriptionInputText}
                  descriptionInputText={descriptionInputText}
                  userDetails={userDetails}
                  addDescription={addDescription}
                />
              )}

              {currentTab == "Jobs" && (
                <Jobs
                  setFormType={setFormType}
                  setUpdateData={setUpdateData}
                  setupdateFormType={setupdateFormType}
                  jobData={jobData}
                />
              )}
            </div> */}
              <div>{renderTabContent()}</div>
            </div>
            {/* <PostForm className={`shadow-none h-fit top-auto right-auto relative mt-6  z-0`} /> */}
            <div className="w-[500px] hidden lg:block  mt-6 sticky top-6 z-0">
              <PostForm
                className={
                  "relative shadow-none h-[400px]  max-h-[500px] z-0  mb-0"
                }
                isCloseable={false}
                showBackground={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* <div className=" min-w-[35%] hidden lg:flex flex-col"> */}

      {/* </div> */}
      {/* <div className=" z-40"> */}
      <Outlet />
      {/* </div> */}
    </FreezeScroll>
  );
};

export default UserProfile;
