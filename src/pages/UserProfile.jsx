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

import { useNavigate, useLocation } from "react-router-dom";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ProjectUpdateForm from "../components/Forms/ProjectUpdateForm";
import UserDetailsForm from "../components/Forms/UserDetailsForm";
import UserImageInput from "../components/Input/UserImageInput";
import authService from "../services/authService";
import JobUpdateForm from "../components/Forms/JobUpdateForm";
import TextInput from "../components/Input/TextInput";
import Button from "../components/Button/Button";
import { useDispatch } from "react-redux";
import About from "../components/tabs/About";
import Posts from "../components/tabs/Posts";
import Qualification from "../components/tabs/Qualification";
import Home from "../components/tabs/Home";
import Jobs from "../components/tabs/Jobs";
import PostForm from "../components/Forms/PostForm";
import { getUserPosts } from "../services/postService";

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
  const [userDetails, setuserDetails] = useState([]);
  const [postData, setPostData] = useState([]);
  const [jobData, setjobData] = useState();
  const profileApi = useProfileApi();
  const jobApi = useJobApi();

  useEffect(() => {
    return () => {};
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

  const [currentTab, setcurrentTab] = useState("Home");
  const data = {
    labels: ["ReactJs", "Frontend", "Java developer", "Spring boot"],
    datasets: [
      {
        data: [20, 12, 2, 9],
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
      },
    ],
  };

  const [loading, setLoading] = useState({
    education: true,
    skills: true,
    workExperience: true,
    projects: true,
    personalDetails: true,
    userDetails: true,
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
        console.error("Error fetching user data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, userDetails: false }));
      }
    };

    fetchData();
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
      const data = await jobApi.job.getAll();
      setjobData(data);
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
    }
  }, []);

  const fetchEducationData = useCallback(async () => {
    try {
      const data = await profileApi.education.getAll();
      setEducationData(data);

      if (data.length === 0) {
        console.log("No education data available.");
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

      console.log("latestEducationData", latestEducationData);
      setlatestEducation(latestEducationData);
    } catch (error) {
      console.error("Error fetching education data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, education: false }));
    }
  }, [profileApi.education, user]);

  const fetchProjectData = useCallback(async () => {
    try {
      const data = await profileApi.projectDetails.getAll();
      setprojectData(data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  }, [profileApi.projectDetails, user]);

  const fetchSkillData = useCallback(async () => {
    try {
      const data = await profileApi.skills.getAll();
      setSkillData(data);
    } catch (error) {
      console.error("Error fetching skill data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, skills: false }));
    }
  }, [profileApi.skills, user]);

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
  }, [profileApi.workExperience, user]);

  const fetchUserDetails = useCallback(
    async () => {
      setLoading((prev) => ({ ...prev, userDetails: true })); // Set loading state for userDetails to true

      try {
        const data = await authService.fetchUserDetails(); // Fetch user details
        console.log(data);
        setuserDetails(data); // Update userDetails state with fetched data
        setdescriptionInput(data.description); // Update descriptionInputText state with description from fetched data
      } catch (error) {
        console.error("Error fetching user data:", error); // Log any errors
      } finally {
        setLoading((prev) => ({ ...prev, userDetails: false })); // Set loading state for userDetails to false
      }
    },
    authService.fetchUserDetails,
    user
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
    console.log(descriptionInputText);
    try {
      const response = await authService.updateUserDetails({
        ...userDetails,
        description: descriptionInputText,
      });
      console.log(response);
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
      console.log("Back button pressed. Event:", event);

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

  const handleClose = () => {
    setFormType(null);
    window.history.back();
  };

  useEffect(() => {
    if (formType) {
      window.history.pushState({ formType }, "", `profile/${formType}`);
    } else {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [formType]);

  useEffect(() => {
    // Function to handle popstate event
    const handlePopState = (event) => {
      console.log("Hello");
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

  useEffect(() => {
    if (updateFormType) {
      // Push new state into history with formType
      window.history.pushState(
        { updateFormType },
        "",
        `profile/${updateFormType}`
      );
    } else {
      // Replace state if no formType is present
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [updateFormType]);

  return (
    <div
      className={`w-full flex    justify-center gap-5  bg-gray-100  sm:py-5 md:px-5 `}
    >
      {pageLoading ? (
        <div>Loading...</div>
      ) : (
        <div
          className={`  w-full flex-1 flex-grow  ${
            settings ? "pointer-events-none " : "pointer-events-auto"
          }`}
        >
          {formType && (
            <div
              className="fixed inset-0 z-30 flex justify-center items-center bg-black bg-opacity-50"
              onClick={handleClose}
            >
              <div
                className="fixed z-20 w-full border h-full sm:h-fit sm:max-w-md mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {console.log(formType)}
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
                      : null,
                })}
              </div>
            </div>
          )}

          {updateFormType ? (
            <div
              className="fixed inset-0 z-30 flex justify-center items-center bg-black bg-opacity-50"
              onClick={handleClose}
            >
              <div
                className="fixed z-20 w-full border h-full sm:h-fit sm:max-w-md mx-auto"
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
          <div
            className={`w-full ${settings ? "-ml-[60%]" : "-ml-0"} ${
              (formType || settings || showProfileImage || updateFormType) &&
              "fixed"
            }   md:flex-row transition-all duration-300 relative md:min-w-full flex-1 h-full `}
          >
            {showProfileImage && (
              <div
                onClick={() => {
                  setshowProfileImage(false);
                }}
                className={`h-screen border w-full top-0 bg-white opacity-85   z-50 absolute `}
              ></div>
            )}
            <div className="  flex gap-4  max-h-min flex-wrap ">
              <div
                className={`w-full md:hidden ${
                  formType || updateFormType ? "hidden" : ""
                } fixed md:min-w-[57.6%]  md:border-x md:mt-5 z-20 top-0 mb-4 px-4 py-4 bg-white flex justify-between`}
              >
                <div className="flex items-center gap-4">
                  {atTop >= 100 && (
                    <UserImageInput
                      isEditable={false}
                      image={userDetails.profileImage?.compressedImage}
                      imageHeight="40"
                    />
                  )}
                  <div className="flex flex-col justify-center">
                    <p className="text-xl font-semibold">
                      {atTop >= 100 ? user.username : "Profile"}
                    </p>
                    <div className="flex gap-1 mt-0.5 items-center">
                      <span className="h-2 w-2 rounded-full shadow-lg bg-green-500"></span>
                      <p className="text-xs text-gray-400 -mt-px">
                        Currently active
                      </p>
                    </div>
                  </div>
                </div>
                <svg
                  className="h-8 w-8 text-gray-800 pointer-events-auto transition-all duration-500 ease-in-out transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => {
                    setsettings(!settings);
                  }}
                >
                  {settings ? (
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
              <div className="flex border-t pt-8 pb-6 mt-10 md:mt-0   flex-grow  sm:border-x  px-4 md:px-6 gap-3 bg-white justify-center flex-col">
                <div className="w-full hidden md:flex   mb-4 bg-white   justify-between ">
                  <p className="text-2xl font-semibold">Profile</p>
                  <svg
                    class="h-8 w-8 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </div>
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
                          setshowProfileImage(true);
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
                            {user.account_type == "Employeer"
                              ? user.company_details?.company_name
                              : user.personal_details?.firstname +
                                " " +
                                user.personal_details?.lastname}
                          </h1>
                          <div className="flex  gap-2">
                            <p className="text-lg font-light sm:font-normal sm:text-xl text-gray-600">
                              {user?.username || "Username"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="order-3 flex flex-col gap-2">
                      <div className="flex mt-2  order-1 text-gray-400 items-end font-medium text-sm ">
                        <p>
                          {/* <span>{user.location?.address} · </span> */}
                          {user.followers ? user.followers : 0}
                          <span className="  font-normal"> followers</span>{" "}
                          {user.account_type == "Candidate" && (
                            <span>
                              ·{" "}
                              {userDetails.followings
                                ? userDetails.followings
                                : 0}{" "}
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
                          className=" text-sm font-normal text-gray-300 px-2 py-1 rounded-lg border w-fit  border-dashed"
                        >
                          Add a bio +
                        </div>
                      )}
                      {user.account_type == "Candidate" && (
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

                      {user.tags.length > 0 && (
                        <div className=" mt-4 order-last ">
                          <div className="flex gap-1 max-w-full flex-wrap ">
                            {user.tags?.map((tag) => (
                              <p className="flex rounded-md w-fit px-px  text-blue-500 text-nowrap">
                                #{tag}
                              </p>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400">
                            The tags won't be visible on you profile to others
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
              className={` sticky top-16 z-20 transition-all ease-in-out sm:top-0 md:${
                atTop < 340 ? "pt-0" : "pt-5"
              } bg-gray-100`}
            >
              <div
                style={{
                  overflowX: "auto",
                  scrollbarWidth: "none",
                }}
                className={`flex-grow z-20  max-w-full overflow-x-auto border-b sm:border-x  ${
                  atTop > 340 ? " md:border-t" : null
                } w-full -mt-px sticky top-16 sm:top-0  gap-3  md:mb-4   order-last bg-white   font-medium  h-full  flex`}
              >
                {[
                  "Home",
                  ...(user.account_type == "Employeer"
                    ? ["About", "Posts", "Jobs", "People"]
                    : ["Posts", "Qualification"]),
                ].map((tab) => (
                  <p
                    onClick={() => {
                      setcurrentTab(tab);
                    }}
                    className={`px-4 text-base md:text-lg font-medium md:font-semibold cursor-pointer ${
                      tab == currentTab
                        ? "  border-b-2 text-blue-500 border-blue-500"
                        : null
                    } w-full text-center py-2`}
                  >
                    {tab}
                  </p>
                ))}
              </div>
            </div>
            <div className="">
              {currentTab == "Home" && (
                <Home
                  user={user}
                  loading={loading}
                  userDetails={userDetails}
                  setcurrentTab={setcurrentTab}
                  postData={postData.slice(0,2)}
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
                  userDetails={user}
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
            </div>
          </div>
        </div>
      )}

      {true && (
        <div
          className={`fixed top-0 border-l  z-40 h-full w-[60%] bg-white transition-all duration-300 ease-in-out 
          ${settings ? " right-0" : "-right-[60%]"}
          `}
        >
          <div className="p-4 flex h-full flex-col">
            <h2 className="text-xl font-semibold">Settings</h2>
            <div className="flex-1 "></div>
            <a
              onClick={() => {
                console.log("logout");
                dispatch(logout());
                navigate("/", { replace: true });
              }}
              className="mt-2 bg-red-50 font-bold w-fit py-1 px-3 rounded-md border border-red-500 text-red-500"
            >
              Sign out
            </a>
          </div>
        </div>
      )}

      <div className=" min-w-[35%] hidden lg:flex flex-col gap-4">
        <div
          className={`border  h-fit px-6 sticky ${
            atTop <= 500 ? "-mt-8" : null
          } -top-3 bg-white sm:px-8 py-5 flex w-full transition-transform duration-300   ${
            scrollDirection === "down" ? "-translate-y-full" : "translate-y-8"
          }`}
        >
          <p className="text-xl font-medium">Recomendations</p>
        </div>
        <div
          className={`border transition-all ${
            atTop <= 500 ? "-mt-40" : null
          }  ease-in-out h-fit px-6 sticky top-4 
          ${scrollDirection === "down" ? "translate-y-0" : "translate-y-[85px]"}
           bg-white sm:px-8 py-5  flex w-full `}
        >
          <p className="text-xl font-medium">Candidates</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
