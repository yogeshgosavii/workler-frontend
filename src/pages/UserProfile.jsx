import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import { formatDistanceToNow } from "date-fns";

import { Doughnut } from "react-chartjs-2";
import { PieChart } from "@mui/x-charts/PieChart";
import githubLogo from "../assets/github-mark.svg";
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem("token");
  //     console.log("token", token);
  //     fetch("https://workler-backend.vercel.app/api/auth/user", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //       .then((response) => response.text()) // Use text() to get the raw response
  //       .then((data) => {
  //         console.log(data); // Log the raw response
  //         return JSON.parse(data); // Attempt to parse the response
  //       })
  //       .catch((error) => console.error("Error:", error));
  //   };

  //   fetchData();
  // }, []);
  const fetchJobData = useCallback(async () => {
    try {
      const data = await jobApi.job.getAll();
      setjobData(data);
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

  const fetchPersonalData = useCallback(async () => {
    try {
      const data = await profileApi.personalDetails.getAll();
      setPersonalData(data[0]);
      console.log("personalData", data); // Logging the fetched data directly
    } catch (error) {
      console.error("Error fetching personal data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, personalDetails: false }));
    }
  }, [profileApi.personalDetails, user]);

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

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData(); // Call fetchData function

    // Adding 'user' to the dependency array ensures this effect runs when 'user' changes
  }, [user]);

  useEffect(() => {
    setpageLoading(true);
    fetchEducationData();
    fetchProjectData();
    fetchPersonalData();
    fetchSkillData();
    fetchWorkExperienceData();
    // fetchUserDetails();
    fetchJobData();
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

  const handleDragStart = (e, id) => e.dataTransfer.setData("id", id);

  const adddescription = async () => {
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

  const handleDrop = (e, id) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData("id");
    const draggedIndex = userDetailsList.findIndex(
      (item) => item.id === draggedItemId
    );
    const targetIndex = userDetailsList.findIndex((item) => item.id === id);

    if (
      draggedIndex !== -1 &&
      targetIndex !== -1 &&
      draggedIndex !== targetIndex
    ) {
      const updatedList = [...userDetailsList];
      const [draggedItem] = updatedList.splice(draggedIndex, 1);
      updatedList.splice(targetIndex, 0, draggedItem);
    }
  };

  const Section = ({ id, title, content, loading, onAdd }) => (
    <div className="flex flex-col border-y sm:border px-4 sm:px-6 py-6 mt-3 ">
      <div className="flex justify-between  items-center">
        <p className="text-xl font-medium">{title}</p>
        {title != "Personal details" && content ? (
          <p
            className="text-blue-500 font-medium cursor-pointer"
            onClick={() => setFormType(id)}
          >
            Add
          </p>
        ) : (
          <svg
            class="h-5 w-5 text-blue-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            onClick={() => {
              setupdateFormType("personalDetails");
              console.log(personalData);
              setUpdateData({ personalDetails: personalData });
              setUpdateForm({ personalDetails: true });
            }}
          >
            {" "}
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        )}
      </div>
      {loading ? (
        loading.personalDetails ? (
          <div className="animate-pulse z-10 mt-2">
            <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
          </div>
        ) : (
          <div className="animate-pulse z-10 mt-2">
            <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
          </div>
        )
      ) : (
        content
      )}
    </div>
  );

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

  const userDetailsList = useMemo(
    () => [
      {
        id: "skills",
        title: "Skills",
        content:
          skillData.length === 0 ? (
            <p className="text-sm text-gray-400 mt-1">
              Adding the skills help recruiter know the your most usefull work
            </p>
          ) : (
            <div className="flex gap-2 mt-3 flex-wrap">
              {skillData.map((data, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setupdateFormType("skills");
                    setUpdateData({ skills: data });
                    setUpdateForm({ skills: true });
                  }}
                  className={`py-2 px-4 w-fit bg-gray-50 border rounded-md ${
                    index === skillData.length - 1 ? null : "border-b"
                  }`}
                >
                  <p className="font-medium hover:text-blue-500">{data.name}</p>
                  <p className="text-sm text-gray-400">{data.level}</p>
                </div>
              ))}
            </div>
          ),
        loading: loading.skills,
      },
      {
        id: "personalDetails",
        title: "Personal details",
        content: personalData ? (
          <div className="mt-4 flex flex-col gap-5">
            {personalData.fullname && (
              <p className=" flex gap-3 ">
                <svg
                  class="h-6 w-6 text-gray-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <circle cx="12" cy="7" r="4" />{" "}
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>{" "}
                <span className="font-semibold">{personalData.fullname}</span>
              </p>
            )}
            {personalData.address && (
              <p className=" flex gap-3 ">
                <svg
                  class="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-semibold">{personalData.address}</span>
              </p>
            )}
            {personalData.birthdate && (
              <p className=" flex gap-3 ">
                <svg
                  class="h-6 w-6 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />{" "}
                  <line x1="16" y1="2" x2="16" y2="6" />{" "}
                  <line x1="8" y1="2" x2="8" y2="6" />{" "}
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>{" "}
                {personalData.birthdate && (
                  <p className="font-semibold">
                    {format(new Date(personalData.birthdate), "MMMM dd, yyyy")}
                  </p>
                )}
              </p>
            )}
            {personalData.phone && (
              <p className=" flex gap-3 ">
                <svg
                  class="h-6 w-6 text-gray-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                </svg>{" "}
                <span className="font-semibold">{personalData.phone}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-1">
            Add personal details so the recrutier can know more aboyt you
          </p>
        ),
        loading: loading.personalDetails,
      },
      {
        id: "education",
        title: "Education",
        content:
          educationData.length === 0 ? (
            <p className="text-sm text-gray-400 mt-1">
              Adding the education or course type helps recruiters know your
              educational background
            </p>
          ) : (
            educationData.map((data, index) => {
              if (
                data.educationType == "Post Graduate" ||
                data.educationType == "Graduate"
              ) {
                const formattedStartMonth = data.start_month
                  ? format(new Date(data.start_month), "MMMM yyyy")
                  : "";
                const formattedEndMonth = data.end_month
                  ? format(new Date(data.end_month), "MMMM yyyy")
                  : "Present";
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setupdateFormType("education");

                      setUpdateData({ education: data });
                      setUpdateForm({ education: true });
                    }}
                    className={`py-4 ${
                      index === educationData.length - 1 ? null : "border-b"
                    }`}
                  >
                    <p className="text-xl font-semibold">
                      {data.course} {data.specialization}
                    </p>
                    <p className="">{data.university}</p>
                    <p className="text-sm text-gray-400">
                      {formattedStartMonth} - {formattedEndMonth}
                    </p>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setUpdateData({ education: data });
                      setUpdateForm({ education: true });
                    }}
                    className={`py-4 ${
                      index === educationData.length - 1 ? null : "border-b"
                    }`}
                  >
                    <p className="text-xl font-semibold">
                      {data.educationType == "Class XII"
                        ? "Class XII"
                        : "Class X"}
                    </p>
                    <p className="">{data.board}</p>
                    <p className="text-sm text-gray-400">
                      {data.passing_out_month}
                    </p>
                  </div>
                );
              }
            })
          ),
        loading: loading.education,
      },
      {
        id: "work_experience",
        title: "Work Experience",
        content:
          workExperienceData.length === 0 ? ( // Check if work experience data is empty
            <p className="text-sm text-gray-400  mt-1">
              Adding work experience helps recruiters understand your
              professional background
            </p>
          ) : (
            <div>
              {workExperienceData.map((data, index) => {
                const formattedJoiningDate = data.joiningDate
                  ? format(new Date(data.joiningDate), "MMMM yyyy")
                  : "";
                const formattedLeavingDate = data.leavingDate
                  ? format(new Date(data.leavingDate), "MMMM yyyy")
                  : "Present";

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setupdateFormType("workExperience");
                      setUpdateData({ workExperience: data });
                      setUpdateForm({ workExperience: true });
                    }}
                    className={`py-4 ${
                      index === workExperienceData.length - 1
                        ? null
                        : "border-b"
                    }`}
                  >
                    <p className="text-xl font-semibold">
                      {data.jobTitle}{" "}
                      <span className="font-normal text-sm">
                        ( {data.employmentType} )
                      </span>
                    </p>
                    <p className="">{data.company_name}</p>
                    <p className="text-sm text-gray-400">
                      {formattedJoiningDate} - {formattedLeavingDate}
                    </p>
                  </div>
                );
              })}
            </div>
          ),
        loading: loading.workExperience,
      },
      {
        id: "projects",
        title: "Projects",
        content:
          projectData.length === 0 ? (
            <p className="text-sm text-gray-400 mt-1 ">
              Adding project helps recruiters understand your work and know your
              potential
            </p>
          ) : (
            <div>
              {projectData.map((data, index) => {
                const formattedStartDate = data.start_date
                  ? format(new Date(data.start_date), "MMMM yyyy")
                  : "";
                const formattedEndDate = data.end_date
                  ? format(new Date(data.end_date), "MMMM yyyy")
                  : "Present";

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setUpdateData({ projects: data });
                      setUpdateForm({ projects: true });
                      setupdateFormType("projects");
                      console.log("project data", data);
                    }}
                    className={`py-4 ${
                      index === projectData.length - 1 ? null : "border-b"
                    }`}
                  >
                    <p className="text-xl flex gap-2 items-center font-semibold">
                      {data.project_name}
                      {data.url && (
                        <a
                          className="cursor-pointer"
                          href={
                            data.url.startsWith("http")
                              ? data.url
                              : `http://${data.url}`
                          }
                          // target={data.url.startsWith("http") ? "_blank" : "_self"}
                          target={"_blank"}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          rel={
                            data.url.startsWith("http")
                              ? "noopener noreferrer"
                              : ""
                          }
                        >
                          <svg
                            className="h-6 w-6  text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </p>

                    <p className="text-gray-400">{data.project_description}</p>
                    <p className="text-sm text-gray-400">
                      {formattedStartDate} - {formattedEndDate}
                    </p>
                  </div>
                );
              })}
            </div>
          ),
        loading: loading.projects,
      },
    ],
    [skillData, educationData, workExperienceData, projectData, personalData]
  );

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
              {/* <div className="w-full bg-white px-4 flex justify-end py-4 border-y">
          <svg
                  class="h-8 w-8 text-gray-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />{" "}
                  <circle cx="12" cy="12" r="3" />
                </svg>
          </div> */}
              <div
                className={`w-full md:hidden ${
                  formType || updateFormType ? "hidden" : ""
                } fixed md:min-w-[57.6%]  md:border-x md:mt-5 z-20 top-0 mb-4 px-4 py-4 bg-white flex justify-between`}
              >
                <div className="flex items-center gap-4">
                  {atTop >= 100 && (
                    <UserImageInput
                      isEditable={false}
                      image={user.profileImage}
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
                  className="h-8 w-8 text-gray-800 pointer-events-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => {
                    console.log("Hello");
                    setsettings(!settings);
                    // setFormType(null)
                    // setupdateFormType(null)
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
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
                          setshowProfileImage(!showProfileImage);
                        }}
                        imageBorder={showProfileImage ? "none" : "2"}
                        className={`transition-all ease-in-out absolute  blur-none  duration-300 ${
                          showProfileImage
                            ? " ml-[40%] md:ml-[45%]  z-50 translate-y-[200%] scale-[3.5] "
                            : ""
                        }`}
                        imageClassName={showProfileImage ? "shadow-3xl" : ""}
                        isEditable={false}
                        image={user.profileImage}
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
                      {/* {userDetails.email &&  user.account_type === "Candidate" &&(
                    <div className="flex order-4 mt-5 text-sm items-center gap-2">
                      <svg
                        class="octicon octicon-mail"
                        viewBox="0 0 16 16"
                        version="1.1"
                        fill="#848d97"
                        width="16"
                        height="16"
                        aria-hidden="true"
                      >
                        <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"></path>
                      </svg>
                      <p>{userDetails.email}</p>
                    </div>
                  )} */}
                      {/* <div className=" space-y-2 order-4 text-sm">
                    {userDetails.githubLink && (
                      <a
                        className="flex  gap-2 cursor-pointer"
                        href={
                          userDetails.githubLink.startsWith("http")
                            ? userDetails.githubLink
                            : `http://${userDetails.githubLink}`
                        }
                        // target={data.url.startsWith("http") ? "_blank" : "_self"}
                        target={"_blank"}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        rel={
                          userDetails.githubLink.startsWith("http")
                            ? "noopener noreferrer"
                            : ""
                        }
                      >
                        <img className="h-[16px] w-[16px]" src={githubLogo} />
                        <p>{userDetails.githubLink}</p>
                      </a>
                    )}

                    {userDetails.linkedInLink && (
                      <a
                        className="flex  gap-2 cursor-pointer"
                        href={
                          userDetails.linkedInLink.startsWith("http")
                            ? userDetails.linkedInLink
                            : `http://${userDetails.linkedInLink}`
                        }
                        // target={data.url.startsWith("http") ? "_blank" : "_self"}
                        target={"_blank"}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        rel={
                          userDetails.linkedInLink.startsWith("http")
                            ? "noopener noreferrer"
                            : ""
                        }`
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#848d97"
                          viewBox="0 0 16 16"
                          role="img"
                          aria-labelledby="anoxoivoozzyddzns0wsn7xrxnzqxmx5"
                          class="octicon mt-[2px]"
                        >
                          <title id="anoxoivoozzyddzns0wsn7xrxnzqxmx5">
                            LinkedIn
                          </title>
                          <g clip-path="url(#clip0_202_91845)">
                            <path
                              d="M14.5455 0H1.45455C0.650909 0 0 0.650909 0 1.45455V14.5455C0 15.3491 0.650909 16 1.45455 16H14.5455C15.3491 16 16 15.3491 16 14.5455V1.45455C16 0.650909 15.3491 0 14.5455 0ZM5.05746 13.0909H2.912V6.18764H5.05746V13.0909ZM3.96291 5.20073C3.27127 5.20073 2.712 4.64 2.712 3.94982C2.712 3.25964 3.272 2.69964 3.96291 2.69964C4.65236 2.69964 5.21309 3.26036 5.21309 3.94982C5.21309 4.64 4.65236 5.20073 3.96291 5.20073ZM13.0938 13.0909H10.9498V9.73382C10.9498 8.93309 10.9353 7.90327 9.83491 7.90327C8.71855 7.90327 8.54691 8.77527 8.54691 9.67564V13.0909H6.40291V6.18764H8.46109V7.13091H8.49018C8.77673 6.58836 9.47636 6.016 10.52 6.016C12.6924 6.016 13.0938 7.44582 13.0938 9.30473V13.0909V13.0909Z"
                              fill="currentColor"
                            ></path>
                          </g>
                        </svg>
                        <p>{userDetails.linkedInLink}</p>
                      </a>
                      //    <a
                      //    className="cursor-pointer"
                      //    href={
                      //      data.url.startsWith("http")
                      //        ? data.url
                      //        : `http://${data.url}`
                      //    }
                      //    // target={data.url.startsWith("http") ? "_blank" : "_self"}
                      //    target={"_blank"}
                      //    onClick={(e) => {
                      //      e.stopPropagation();
                      //    }}
                      //    rel={
                      //      data.url.startsWith("http")
                      //        ? "noopener noreferrer"
                      //        : ""
                      //    }
                      //  >
                      //    <svg
                      //      className="h-6 w-6  text-blue-500"
                      //      fill="none"
                      //      viewBox="0 0 24 24"
                      //      stroke="currentColor"
                      //    >
                      //      <path
                      //        strokeLinecap="round"
                      //        strokeLinejoin="round"
                      //        strokeWidth="2"
                      //        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      //      />
                      //    </svg>
                      //  </a>
                    )}
                    {userDetails.portfolioLink && (
                      <a
                        className="flex  gap-2 cursor-pointer"
                        href={
                          userDetails.portfolioLink.startsWith("http")
                            ? userDetails.portfolioLink
                            : `http://${userDetails.portfolioLink}`
                        }
                        // target={data.url.startsWith("http") ? "_blank" : "_self"}
                        target={"_blank"}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        rel={
                          userDetails.portfolioLink.startsWith("http")
                            ? "noopener noreferrer"
                            : ""
                        }
                      >
                        <svg
                          class="h-4 w-4 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          {" "}
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />{" "}
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <p>{userDetails.portfolioLink}</p>
                      </a>
                    )}
                  </div> */}
                      {user.bio ? (
                        <div onClick={() => setFormType("userDetails")}>
                          {user.bio}
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
                        <div className="order-2 text-sm -mb-2">
                          <p className="mt-2 text-wrap truncate">
                            Works at{" "}
                            {worksAt && (
                              <span>
                                {worksAt.companyName}{" "}
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
                      <div className="flex text-gray-400  order-4  items-end text-sm space-x-1">
                        {/* <svg
                    text="muted"
                    aria-hidden="true"
                    height="18"
                    fill="#9ca3af"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    class="octicon octicon-people pb-0.5"
                  >
                    <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"></path>
                  </svg> */}
                        <p>
                          <span>{user.location?.address} · </span>
                          {user.followers ? user.followers : 0}
                          <span className=" "> followers</span>
                          {/* · {userDetails.followings?userDetails.followings:0}{" "}
                    <span className="">following</span> */}
                        </p>
                      </div>
                      <div className=" mt-2 order-last ">
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

              {/* <div className="flex-grow gap-3 bg-white py-4  border font-medium  h-full md:w-fit px-6 flex w-full">
            <p className=" px-4 w-full text-center bg-blue-50 border rounded-lg border-blue-500 py-1">
              Profile
            </p>
            <p className=" px-4 w-full text-center py-1">
              Posts
            </p>
          </div> */}
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
                {/* <p className=" px-4 w-full text-center bg-blue-50 border-b-2 border-blue-500 py-3">
              Profile
            </p>
            <p className=" px-4 w-full text-center py-3">
              Posts
            </p> */}
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
                <div className="space-y-2 ">
                  {user.account_type == "Employeer" ? (
                    <div className="flex flex-col bg-white border-b md:border shadow-sm md:shadow-lg   gap-2">
                      <div className="px-4 md:px-6 py-4">
                        <p className="text-xl font-bold">About</p>
                        <p className=" line-clamp-3 mt-1 text-sm mb-2">
                          {userDetails == "" ? (
                            <div>
                              <div className="animate-pulse z-10 mt-2">
                                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
                                <div className="h-2 bg-gray-200 rounded-md "></div>
                                <div className="h-2 w-1/2 bg-gray-200 rounded-md mt-5"></div>
                              </div>
                            </div>
                          ) : (
                            <span> {user.description}</span>
                          )}
                        </p>
                        <a className="text-sm text-blue-500">
                          {userDetails.company_details?.website}
                        </a>
                      </div>
                      <p
                        onClick={() => {
                          setcurrentTab("About");
                        }}
                        className="w-full text-center border-t font-medium py-2 text-gray-400"
                      >
                        Learn more
                      </p>
                    </div>
                  ):
                  (
                    <div className="relative overflow-hidden bg-white px-4 py-4 pb-16">
                    <p className="text-xl font-bold ">Description</p>
                    <p className="text-gray-400 text-sm mb-3 font-normal">Click on the text to make the changes or add a new description</p>
                    <div
                      className={`text-sm font-normal ${descriptionInput ? "hidden" : ""}`}
                    >
                      {user?.description ? (
                        <div onClick={() => setdescriptionInput(true)}>
                          <p>{user.description}</p>
                        </div>
                      ) : (
                        <div
                          onClick={() => setdescriptionInput(true)}
                          className="text-sm font-normal text-gray-300 w-full"
                        >
                          Add a description. For example: "We are a dynamic
                          company committed to excellence and innovation."
                        </div>
                      )}
                    </div>

                    <div>
                      {descriptionInput && (
                        <div>
                          <textarea
                            onChange={(e) =>
                              setdescriptionInputText(e.target.value)
                            }
                            value={descriptionInputText}
                            onFocus={() => setdescriptionInput(true)}
                            onBlur={() => setdescriptionInput(false)}
                            placeholder='Add a description. For example: "We are a dynamic company committed to excellence and innovation."'
                            className="text-sm caret-blue-500 -mb-[6px] h-full font-normal placeholder:text-wrap placeholder:text-gray-300 outline-none w-full"
                          />
                        </div>
                      )}

                      <div
                        className={`absolute flex gap-2 right-4 bottom-4 transition-transform duration-300 ${
                          descriptionInput == true
                            ? "translate-x-0"
                            : "translate-x-40"
                        }`}
                      >
                        <button
                          onClick={() => setdescriptionInput(false)}
                          className="font-medium px-4 py-1 rounded-2xl text-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={adddescription}
                          className="font-medium px-4 py-1 bg-blue-500 rounded-full text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                  )}
                  <div className="bg-white border-y md:border shadow-sm md:shadow-lg ">
                    <div className="flex flex-col px-4 md:px-6 py-4 ">
                      <p className="text-xl font-medium">Posts</p>
                    </div>
                    <p
                      onClick={() => {
                        setcurrentTab("Posts");
                      }}
                      className="w-full text-center  border-t font-medium py-2 text-gray-400"
                    >
                      See all posts
                    </p>
                  </div>
                </div>
              )}
              {currentTab == "Qualification" && (
                <div>
                  {/* <div className="flex-grow border  h-full md:w-fit px-6 bg-white sm:px-8 py-5 flex w-full">
              <div className="h-full">
                <p className="text-xl font-medium">Profile Analytics</p>
                <PieChart
                  className=" bg-blue-100"
                  series={[
                    {
                      data: [
                        { value: "Java", color: "orange" },
                        { value: "Javascript", color: "red" },
                        { value: "Springboot", color: "green" },
                        { value: "React", color: "blue" },
                      ],
                      innerRadius: 65,
                      outerRadius: 100,
                      paddingAngle: 0,
                      cornerRadius: 0,
                      startAngle: -182,
                      endAngle: 180,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                />
              </div>
            </div> */}
                  {userDetailsList.map((item, index) => (
                    <div
                      key={index}
                      className="cursor-pointer bg-white"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDrop={(e) => handleDrop(e, item.id)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <Section
                        id={item.id}
                        title={item.title}
                        content={item.content}
                        loading={item.loading}
                      />
                    </div>
                  ))}
                </div>
              )}
              {currentTab == "Posts" && (
                <div className="bg-white w-full h-full"></div>
              )}

              {currentTab == "About" && (
                <div className="bg-white flex flex-col gap-4 w-full px-4 py-4 sm:px-6 h-full">
                  <div className="relative overflow-hidden pb-12">
                    <p className="text-xl font-bold mb-2">Description</p>

                    <div
                      className={`text-sm ${descriptionInput ? "hidden" : ""}`}
                    >
                      {user?.description ? (
                        <div onClick={() => setdescriptionInput(true)}>
                          <p>{user.description}</p>
                        </div>
                      ) : (
                        <div
                          onClick={() => setdescriptionInput(true)}
                          className="text-sm font-normal text-gray-300 w-full"
                        >
                          Add a description. For example: "We are a dynamic
                          company committed to excellence and innovation."
                        </div>
                      )}
                    </div>

                    <div>
                      {descriptionInput && (
                        <div>
                          <textarea
                            onChange={(e) =>
                              setdescriptionInputText(e.target.value)
                            }
                            value={descriptionInputText}
                            onFocus={() => setdescriptionInput(true)}
                            onBlur={() => setdescriptionInput(false)}
                            placeholder='Add a description. For example: "We are a dynamic company committed to excellence and innovation."'
                            className="text-sm caret-blue-500 -mb-[6px] h-full font-normal placeholder:text-wrap placeholder:text-gray-300 outline-none w-full"
                          />
                        </div>
                      )}

                      <div
                        className={`absolute flex gap-2 right-0 bottom-0 transition-transform duration-300 ${
                          descriptionInput == true
                            ? "translate-x-0"
                            : "translate-x-40"
                        }`}
                      >
                        <button
                          onClick={() => setdescriptionInput(false)}
                          className="font-medium px-4 py-1 rounded-2xl text-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={adddescription}
                          className="font-medium px-4 py-1 bg-blue-500 rounded-full text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="-mt-4">
                    <p className="font-semibold text-lg mb-2  ">Details</p>
                    <div className="text-sm flex flex-col gap-2">
                      {userDetails?.company_details.website && (
                        <div>
                          <p>Website</p>
                          <p className="text-blue-500">
                            {userDetails?.company_details.website}
                          </p>
                        </div>
                      )}
                      {userDetails?.company_details.industry && (
                        <div>
                          <p>Industry</p>
                          <p>{userDetails?.company_details.industry}</p>
                        </div>
                      )}
                      {userDetails?.location && (
                        <div>
                          <p>Company location</p>
                          <p className="text-gray-400">
                            {userDetails?.location.address}
                          </p>
                        </div>
                      )}
                      {userDetails?.company_details.found_in_date && (
                        <div>
                          <p>Found in</p>
                          <p className="text-gray-400">
                            {new Date(
                              userDetails.company_details.found_in_date
                            ).getFullYear()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentTab == "Jobs" &&
                (jobData.length > 0 ? (
                  <div className="bg-white border-x h-full px-4 py-4 md:px-6 md:border md:-mt-0 w-full flex-1">
                    <div className="flex justify-between mb-3 items-center">
                      <p className="font-medium">Recently posted jobs</p>
                      <button
                        onClick={() => {
                          setFormType("job");
                        }}
                        className="text-blue-500 bg-blue-50 text-sm py-1 px-4 border rounded-full font-medium border-blue-500"
                      >
                        Create job
                      </button>
                    </div>

                    {jobData.map((job, index) => (
                      <div
                        onClick={() => {
                          console.log(job);
                          setUpdateData({ job: job });
                          setupdateFormType("job");
                        }}
                        className={`flex py-2 items-start  justify-between ${
                          index < jobData.length - 1
                            ? "border-b cursor-pointer"
                            : ""
                        } `}
                        key={job.id}
                      >
                        <div className="">
                          <p className="text-lg font-semibold">
                            {job.job_role}
                          </p>
                          <p className="text-xs text-gray-800">
                            {job.location.address}
                          </p>
                          {job.job_update_date ? (
                            <p className="text-xs mt-0.5 text-gray-400">
                              Updated{" "}
                              {formatDistanceToNow(
                                new Date(job.job_update_date),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                          ) : (
                            <p className="text-xs mt-0.5 text-gray-400">
                              Posted{" "}
                              {formatDistanceToNow(
                                new Date(job.job_post_date),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                          )}
                        </div>
                        <svg
                          class="h-6 w-6 mt-1.5 text-gray-500"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <circle cx="12" cy="12" r="1" />{" "}
                          <circle cx="12" cy="19" r="1" />{" "}
                          <circle cx="12" cy="5" r="1" />
                        </svg>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border-x  text-center pt-10 md:border -mt-4 md:-mt-0 items-center  w-full flex-1">
                    <p className="font-bold text-2xl">No jobs posted </p>
                    <p
                      onClick={() => {
                        setFormType("job");
                      }}
                      className=" font-semibold text-blue-500 mt-1"
                    >
                      Post a job
                    </p>
                  </div>
                ))}
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
