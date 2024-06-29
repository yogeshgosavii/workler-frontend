import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import profileImageDefault from "../assets/profileDefaultMale.png";
import EducationForm from "../components/Forms/EducationForm";
import WorkExperienceForm from "../components/Forms/WorkExperienceForm";
import ProjectForm from "../components/Forms/ProjectForm";
import SkillForm from "../components/Forms/SkillForm";
import PersonalDetailsForm from "../components/Forms/PersonalDetailsForm";
import profileService from "../services/profileService";
import EducationUpdateForm from "../components/Forms/EducationUpdateForm";
import SkillUpdateForm from "../components/Forms/SkillUpdateForm";
import WorkExperienceUpdateForm from "../components/Forms/WorkExperienceUpdateForm"; // Assuming you have this form
import { format, formatDate } from "date-fns";
import useProfileApi from "../services/profileService"; // Adjust the import path
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

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
  }); // Added workExperience loading
  const [updateForm, setUpdateForm] = useState({
    education: false,
    skills: false,
    workExperience: false,
    project: false,
  }); // Added workExperience update form
  const [updateData, setUpdateData] = useState({
    education: null,
    skills: null,
    workExperience: null,
    project: null,
  }); // Added workExperience update data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log("token", token);
      fetch('https://workler-backend.vercel.app/api/auth/user',
        {
          headers : {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      .then(response => response.text())  // Use text() to get the raw response
      .then(data => {
        console.log(data);  // Log the raw response
        return JSON.parse(data);  // Attempt to parse the response
      })
      .catch(error => console.error('Error:', error));
    }

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
    // try {
    //   const data = await profileApi.projectDetails.getAll();
    //   set(data);
    // } catch (error) {
    //   console.error('Error fetching project data:', error);
    // } finally {
    //   setLoading((prev) => ({ ...prev, project: false }));
    // }
  }, [profileApi.projectDetails]);

  const fetchPersonalData = useCallback(async () => {
    try {
      const data = await profileApi.personalDetails.getAll();
      setPersonalData(data[0]);
      console.log(data[0]); // Logging the fetched data directly
    } catch (error) {
      console.error("Error fetching personal data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, personal: false }));
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
    <div className="flex flex-col border px-6 py-6 mt-3">
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
            onClick={() => setFormType(id)}
          >
            {" "}
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        )}
      </div>
      {loading ? (
        <div className="animate-pulse mt-2">
          <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
        </div>
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
              <span>{personalData.fullname}</span>
            </p>
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
              <span>{personalData.address}</span>
            </p>
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
                <p className="">
                  {format(new Date(personalData.birthdate), "MMMM dd, yyyy")}
                </p>
              )}
            </p>
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
              <span>{personalData.phone}</span>
            </p>

            {/* Add more personal details as needed */}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-1">
            Add personal details so the recrutier can know more aboyt you
          </p>
        ),
        loading: loading.education, // Corrected loading key to match `fetchPersonalData`
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
                      {data.start_year}-{data.end_year}
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
                      {data.passing_out_year}
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
          projectData.length === 0 ? ( // Check if work experience data is empty
            <p className="text-sm text-gray-400 mt-1 ">
              Adding project helps recruiters understand your work and know your
              potential
            </p>
          ) : (
            <div>
              {projectData.map((data, index) => {
                const formattedJoiningDate = data.start_date
                  ? format(new Date(data.joiningDate), "MMMM yyyy")
                  : "";
                const formattedLeavingDate = data.end_date
                  ? format(new Date(data.leavingDate), "MMMM yyyy")
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
        loading: false,
      },
    ],
    [skillData, educationData, workExperienceData, loading, personalData]
  );

  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-5 py-2 px-2 sm:py-5 sm:px-5 ">
      {formType && (
        <div
          className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50"
          onClick={closeForm}
        >
          <div
            className="fixed z-20 w-full border h-full sm:h-fit sm:max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {React.createElement(FormComponents[formType], {
              onClose: closeForm,
              setData:
                formType === "Skill"
                  ? setSkillData
                  : formType === "Education"
                  ? setEducationData
                  : formType === "WorkExperience"
                  ? setWorkExperienceData
                  : formType === "PersonalDetails"
                  ? setPersonalData
                  : null,
            })}
          </div>
        </div>
      )}
      {updateForm.education && (
        <div
          className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50"
          onClick={() => setUpdateForm({ education: false })}
        >
          <div
            className="fixed z-20 w-full max-w-md mx-auto"
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
              setWorkExperienceData={setWorkExperienceData}
            />
          </div>
        </div>
      )}
      <div className="w-full ">
        <div className=" border md:flex px-5 gap-3  py-8">
          <div className="flex  justify-center flex-col w-full  ">
            <div className="flex flex-col text-center sm:text-start justify-center sm:justify-start sm:flex-row  w-full  items-center sm:gap-6">
              <img
                className="object-cover h-32"
                src={profileImageDefault}
                alt="Profile"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.username || "Username"}
                  </h1>
                  <svg
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </div>
                <p className="text-xl font-medium text-gray-700">
                  Software Engineer
                </p>
                <p className="text-gray-500">{user?.email || "email"}</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center sm:justify-start mt-4 items-center">
              <p className="flex flex-col text-center">
                <span className="font-medium">20</span>
                <span className="text-sm">Followers</span>
              </p>
              <p className="flex flex-col text-center">
                <span className="font-medium">20</span>
                <span className="text-sm">Following</span>
              </p>
              <p className="border-l border-gray-300 h-fit  px-4  py-1 flex items-center">
                <svg
                  class="h-8 w-8 text-gray-400 bg-gray-50 px-1 rounded-md border border-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </p>
            </div>
            <div className="flex gap-2 mt-4 max-w-full flex-wrap justify-center sm:justify-start">
              <p className="flex border rounded-md w-fit px-2 py-1 font-medium bg-gray-50 text-nowrap">
                Java Developer
              </p>
              <p className="flex border rounded-md w-fit px-2 py-1 font-medium bg-gray-50 text-nowrap">
                ReactJs
              </p>
              <p className="flex border rounded-md w-fit px-2 py-1 font-medium bg-gray-50 text-nowrap">
                Sprigboot
              </p>
              <p className="flex border rounded-md w-fit px-2 py-1 font-medium bg-gray-50 text-nowrap">
                Backend
              </p>
              <p className="flex border rounded-md w-fit px-2 py-1 font-medium bg-gray-50 text-nowrap">
                Forntend
              </p>
              <p className="flex border rounded-md w-fit px-2 py-1 font-medium bg-gray-50 text-nowrap">
                Web Developer
              </p>
              <p className="flex border rounded-md w-fit px-2 py-1 font-medium bg-gray-50 text-nowrap">
                Fullstack
              </p>
            </div>
          </div>

          <div className="md:w-fit border  bg-white p-5 h-fit flex justify-center mt-6 w-full md:mt-0 shadow-lg rounded-md">
            <Doughnut className="w-full h-fit" data={data} options={options} />
          </div>
        </div>
       
        {userDetailsList.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer"
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
     
      {/* <div className=''>
        <div className='border px-5 py-4 h-fit w-80'>
          <p className='text-xl font-medium mb-8'>Jobs Applied</p>
          <div className='flex flex-col gap-3'>
            {[
              { company: 'Google', role: 'SDE-1', status: 'Pending' },
              { company: 'Microsoft', role: 'SDE-2', status: 'Shortlisted' },
              { company: 'Meta', role: 'ML Engineer', status: 'Rejected' }
            ].map((job, index) => (
              <div key={index} className='flex gap-2'>
                <img className='aspect-square h-10 w-10' src={defaultCompanyImage} alt="Company" />
                <div className='flex flex-col'>
                  <p className='font-medium'>{job.company}</p>
                  <p className='text-gray-500'>{job.role}</p>
                  <p className='text-sm text-gray-400'>{job.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default UserProfile;
