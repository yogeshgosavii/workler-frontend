import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import profileImageDefault from "../assets/user_male_icon.png";
import EducationForm from "../components/Forms/EducationForm";
import WorkExperienceForm from "../components/Forms/WorkExperienceForm";
import ProjectForm from "../components/Forms/ProjectForm";
import SkillForm from "../components/Forms/SkillForm";
import PersonalDetailsForm from "../components/Forms/PersonalDetailsForm";
import EducationUpdateForm from "../components/Forms/EducationUpdateForm";
import SkillUpdateForm from "../components/Forms/SkillUpdateForm";
import WorkExperienceUpdateForm from "../components/Forms/WorkExperienceUpdateForm"; // Assuming you have this form
import { format, formatDate } from "date-fns";
import useProfileApi from "../services/profileService"; // Adjust the import path
import { Doughnut } from "react-chartjs-2";
import { PieChart } from "@mui/x-charts/PieChart";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ProjectUpdateForm from "../components/Forms/ProjectUpdateForm";

// Register necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const UserProfile = () => {
  const [formType, setFormType] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [educationData, setEducationData] = useState([]);
  const [personalData, setPersonalData] = useState(null);
  const [skillData, setSkillData] = useState([]);
  const [workExperienceData, setWorkExperienceData] = useState([]); // Added work experience data
  const [projectData, setprojectData] = useState([]);
  const profileApi = useProfileApi();

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
        text: "",
      },
    },
  };
  const [loading, setLoading] = useState({
    education: true,
    skills: true,
    workExperience: true,
    project: true,
    personalDetails: true,
  });
  const [updateForm, setUpdateForm] = useState({
    education: false,
    skills: false,
    workExperience: false,
    project: false,
    personalDetails: false,
  });
  const [updateData, setUpdateData] = useState({
    education: null,
    skills: null,
    workExperience: null,
    project: null,
    personalDetails: null,
  });
  const [tags, settags] = useState(["Java", "Springboot", "React"]);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      console.log("token", token);
      fetch("https://workler-backend.vercel.app/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.text()) // Use text() to get the raw response
        .then((data) => {
          console.log(data); // Log the raw response
          return JSON.parse(data); // Attempt to parse the response
        })
        .catch((error) => console.error("Error:", error));
    };

    fetchData();
  }, []);
  const fetchEducationData = useCallback(async () => {
    try {
      const data = await profileApi.education.getAll();
      setEducationData(data);
    } catch (error) {
      console.error("Error fetching education data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, education: false }));
    }
  }, [profileApi.education]);

  const fetchProjectData = useCallback(async () => {
    try {
      const data = await profileApi.projectDetails.getAll();
      setprojectData(data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, project: false }));
    }
  }, [profileApi.projectDetails]);

  const fetchPersonalData = useCallback(async () => {
    try {
      const data = await profileApi.personalDetails.getAll();
      setPersonalData(data[0]);
      console.log(data); // Logging the fetched data directly
    } catch (error) {
      console.error("Error fetching personal data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, personalDetails: false }));
    }
  }, [profileApi.personalDetails]);

  const fetchSkillData = useCallback(async () => {
    try {
      const data = await profileApi.skills.getAll();
      setSkillData(data);
    } catch (error) {
      console.error("Error fetching skill data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, skills: false }));
    }
  }, [profileApi.skills]);

  const fetchWorkExperienceData = useCallback(async () => {
    try {
      const data = await profileApi.workExperience.getAll();
      setWorkExperienceData(data);
    } catch (error) {
      console.error("Error fetching work experience data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, workExperience: false }));
    }
  }, [profileApi.workExperience]);

  useEffect(() => {
    fetchEducationData();
    fetchProjectData();
    fetchPersonalData();
    fetchSkillData();
    fetchWorkExperienceData();
  }, []);

  const closeForm = useCallback(() => setFormType(null), []);

  const FormComponents = useMemo(
    () => ({
      education: EducationForm,
      personalDetails: PersonalDetailsForm,
      work_experience: WorkExperienceForm,
      projects: ProjectForm,
      skills: SkillForm,
    }),
    []
  );

  const handleDragStart = (e, id) => e.dataTransfer.setData("id", id);

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
    <div className="flex flex-col border-y sm:border px-6 py-6 mt-3 ">
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
          <div className="animate-pulse mt-2">
            <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
          </div>
        ) : (
          <div className="animate-pulse mt-2">
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
                      setUpdateData({ workExperience: data });
                      console.log(data);
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
                    <p className="">{data.companyName}</p>
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
                      setUpdateData({ project: data });
                      console.log(data);
                      setUpdateForm({ project: true });
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
        loading: loading.project,
      },
    ],
    [skillData, educationData, workExperienceData, projectData, personalData]
  );

  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-5 py-2 bg-gray-100  sm:py-5 sm:px-5 ">
      {formType && (
        <div
          className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50"
          onClick={closeForm}
        >
          <div
            className="fixed z-20 w-full border h-full sm:h-fit sm:max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {console.log(formType)}
            {React.createElement(FormComponents[formType], {
              onClose: closeForm,
              setData:
                formType === "skills"
                  ? setSkillData
                  : formType === "education"
                  ? setEducationData
                  : formType === "work_experience"
                  ? setWorkExperienceData
                  : formType === "personalDetails"
                  ? setPersonalData
                  : null,
              data:
                formType == "skill"
                  ? skillData
                  : formType == "education"
                  ? educationData
                  : formType == "work_experience"
                  ? workExperienceData
                  : formType == "personalDetails"
                  ? personalData
                  : null,
            })}
          </div>
        </div>
      )}
      {updateForm.personalDetails && (
        <div
          className="fixed inset-0 z-10 flex h-full justify-center  items-center bg-black bg-opacity-50"
          onClick={() => setUpdateForm({ personalDetails: false })}
        >
          <div
            className="fixed z-20 w-full h-full flex items-center sm:max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <PersonalDetailsForm
              onClose={() => setUpdateForm({ personalDetails: false })}
              personalDetailsData={updateData.personalDetails}
              setPersonalDetailsData={setPersonalData}
            />
          </div>
        </div>
      )}
      {updateForm.education && (
        <div
          className="fixed inset-0 z-10 flex h-full justify-center  items-center bg-black bg-opacity-50"
          onClick={() => setUpdateForm({ education: false })}
        >
          <div
            className="fixed z-20 w-full h-full flex items-center sm:max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <EducationUpdateForm
              onClose={() => setUpdateForm({ education: false })}
              educationdata={updateData.education}
              setEducationData={setEducationData}
            />
          </div>
        </div>
      )}
      {updateForm.skills && (
        <div
          className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50"
          onClick={() => setUpdateForm({ skills: false })}
        >
          <div
            className="fixed z-20 w-full bg-white h-full sm:h-fit sm:max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <SkillUpdateForm
              onClose={() => setUpdateForm({ skills: false })}
              skillData={updateData.skills}
              setSkillData={setSkillData}
            />
          </div>
        </div>
      )}
      {updateForm.workExperience && ( // Added work experience update form modal
        <div
          className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50"
          onClick={() => setUpdateForm({ workExperience: false })}
        >
          <div
            className="fixed z-20  w-full bg-white h-full sm:h-fit sm:max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <WorkExperienceUpdateForm
              onClose={() => setUpdateForm({ workExperience: false })}
              workExperienceData={updateData.workExperience}
              workExperienceFullData={workExperienceData}
              setWorkExperienceData={setWorkExperienceData}
            />
          </div>
        </div>
      )}
      {updateForm.project && (
        <div
          className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50"
          onClick={() => setUpdateForm({ project: false })}
        >
          <div
            className="fixed z-20 w-full bg-white h-full sm:h-fit sm:max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ProjectUpdateForm
              onClose={() => setUpdateForm({ project: false })}
              projectData={updateData.project}
              setProjectData={setprojectData}
            />
          </div>
        </div>
      )}
      <div className="w-full ">
        <div className="  flex gap-4 max-h-min flex-wrap ">
          <div className="flex border-y py-8 flex-grow sm:border  px-5 gap-3 bg-white justify-center flex-col">
            <div className="flex  w-full gap-4  items-center">
              <div className="bg-gray-50 aspect-square border rounded-full p-2 flex items-center justify-center">
                <img
                  className="object-cover sm:w-20 w-14 h-auto"
                  src={profileImageDefault}
                  alt="Profile"
                />
              </div>
              <div className="flex w-full  justify-between items-center">
                <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  {personalData?.fullname}
                </h1>
                <div className="flex  gap-2">
                  <p className="text-lg font-light sm:font-normal sm:text-xl text-gray-600">
                    {user?.username || "Username"}
                  </p>
                </div>
                </div>
                <svg class="h-8 w-8 text-gray-400"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />  <circle cx="12" cy="12" r="3" /></svg>

                {/* <p className="text-gray-500">{user?.email || "email"}</p> */}
              </div>
            </div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit omnis enim illo fugiat ipsum sapiente, nesciunt fuga et odio suscipit voluptatum molestias qui quisquam obcaecati quae iusto libero deserunt magni!</p>
            <div className="mt-3">
              <div className="flex gap-2 items-center">
                <svg
                  class="h-5 w-5 text-gray-400"
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
                  <rect x="3" y="5" width="18" height="14" rx="2" />{" "}
                  <polyline points="3 7 12 13 21 7" />
                </svg>
                <p className="-mt-0.5"> {user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2 text-sm font-medium   items-center">
              <p className="flex items-center gap-2">
                <span className="font-semibold">20</span>
                <span className=" text-gray-500">followers</span>
              </p>

              <p className="flex items-center gap-2">
                <span className="font-semibold">20</span>
                <span className="text-gray-500">following</span>
              </p>
            </div>

            <div className="flex gap-2 -mt-2 max-w-full flex-wrap ">
              {tags.map((tag) => (
                <p className="flex rounded-md w-fit text-blue-500 text-nowrap">
                  #{tag}
                </p>
              ))}
            </div>

            <button className="border  mt-2 py-1.5 font-medium text-gray-500 rounded-md w-full">
              Edit profile
            </button>
          </div>

          <div className="flex-grow border h-full md:w-fit px-6 bg-white sm:px-8 py-5 flex w-full">
            <div className="h-full">
              <p className="text-xl font-medium">Profile Analytics</p>
              <PieChart
                className=""
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
          </div>
        </div>

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
    </div>
  );
};

export default UserProfile;
