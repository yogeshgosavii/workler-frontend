import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import resumeService from "../../services/resumeService";

function Qualification({
  educationData,
  skillData,
  workExperienceData,
  projectData,
  loading,
  setFormType,
  setUpdateForm,
  setUpdateFormType,
  setUpdateData,
  className,
  user,

  isEditable = true,
}) {
  const currentUser = useSelector((state) => state.auth.user);

  const [selectedResume, setSelectedResume] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Ensure the file is a PDF
      if (file.type === "application/pdf") {
        setSelectedResume(file); // Set the selected file name in state
      } else {
        alert("Please select a PDF file.");
        setSelectedResume(null); // Reset if the file is not a PDF
      }
    }
  };

  const Section = ({ id, title, content, loading, onAdd }) =>
    (isEditable || (!isEditable && content != "")) && (
      <div className={`flex    flex-col sm:mt-3 `}>
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 shadow-inner border w-full">
          <p className="text-xl font-medium   ">{title}</p>
          {onAdd && isEditable && (
            <p
              className="text-blue-500 font-medium cursor-pointer"
              onClick={() => {
                onAdd(id);
              }}
            >
              Add
            </p>
          )}
        </div>
        {loading ? (
          <div className="animate-pulse z-10 mt-2">
            <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
          </div>
        ) : (
          <div className="p-4 sm:border sm:mt-5 bg-white">{content}</div>
        )}
      </div>
    );

  const userDetailsList = useMemo(
    () => [
      {
        id: "skills",
        title: "Skills",
        content:
          skillData?.length === 0 ? (
            isEditable ? (
              <p className="text-sm text-gray-400">
                Adding the skills helps recruiters know your most useful work
              </p>
            ) : (
              []
            )
          ) : (
            <div className="flex gap-2 flex-wrap">
              {skillData?.map((data, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setUpdateFormType("skills");
                    setUpdateData({ skills: data });
                    setUpdateForm({ skills: true });
                  }}
                  className={`py-2 px-4 w-fit bg-gray-50 shadow-md cursor-pointer border rounded-md ${
                    index === skillData.length - 1 ? null : "border-b"
                  }`}
                >
                  <p className="font-medium hover:text-blue-500">{data.name}</p>
                  <p className="text-sm text-gray-400">{data.level}</p>
                </div>
              ))}
            </div>
          ),
        loading: loading?.skills,
        onAdd: (id) => {
          setFormType(id);
        },
      },
      {
        id: "education",
        title: "Education",
        content:
          educationData?.length === 0 ? (
            isEditable ? (
              <p className="text-sm text-gray-400 ">
                Adding education or course type helps recruiters know your
                educational background
              </p>
            ) : (
              []
            )
          ) : (
            educationData?.map((data, index) => {
              if (
                data.educationType === "Post Graduate" ||
                data.educationType === "Graduate"
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
                      setUpdateFormType("education");
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
                    <p>{data.university}</p>
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
                      {data.educationType === "Class XII"
                        ? "Class XII"
                        : "Class X"}
                    </p>
                    <p>{data.board}</p>
                    <p className="text-sm text-gray-400">
                      {data.educationType === "Class XII"
                        ? data.school
                        : data.class10School}
                    </p>
                    <p className="text-sm text-gray-400">
                      {data.educationType === "Class XII"
                        ? data.marks
                        : data.class10Marks}{" "}
                      %
                    </p>
                  </div>
                );
              }
            })
          ),
        loading: loading?.education,
        onAdd: (id) => {
          setFormType(id);
        },
      },
      {
        id: "work_experience",
        title: "Work experience",
        content:
          workExperienceData?.length === 0 ? (
            isEditable ? (
              <p className="text-sm text-gray-400 ">
                Adding work experience helps recruiters know about your previous
                work experience
              </p>
            ) : (
              []
            )
          ) : (
            workExperienceData?.map((data, index) => {
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
                    setUpdateFormType("workExperience");
                    setUpdateData({ workExperience: data });
                    setUpdateForm({ workExperience: true });
                  }}
                  className={`py-4 ${
                    index === workExperienceData.length - 1 ? null : ""
                  }`}
                >
                  <p className="text-xl font-semibold">{data.companyName}</p>
                  <p>{data.jobTitle}</p>
                  <p className="text-sm text-gray-400">
                    {formattedJoiningDate} - {formattedLeavingDate}
                  </p>
                </div>
              );
            })
          ),
        loading: loading.workExperience,
        onAdd: (id) => {
          setFormType(id);
        },
      },
      {
        id: "projects",
        title: "Projects",
        content:
          projectData?.length === 0 ? (
            isEditable ? (
              <p className="text-sm text-gray-400 ">
                Adding projects helps recruiters know about your previous
                projects
              </p>
            ) : (
              []
            )
          ) : (
            <div className="flex flex-col gap-3">
              {projectData?.map((data, index) => {
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
                      setUpdateFormType("projects");
                      setUpdateData({ projects: data });
                      setUpdateForm({ projects: true });
                    }}
                    className={`py-4 border px-4 flex gap-3 rounded-lg ${
                      index === projectData.length - 1 ? null : "border"
                    }`}
                  >
                    <img
                      className="h-10 w-10 rounded-md border"
                      src={
                        "https://avatars.githubusercontent.com/u/43775498?v=4"
                      }
                    />
                    <div className="-mt-1">
                      <a
                        href={currentUser._id != user._id && data.url}
                        target="_blank"
                        className="text-xl font-semibold"
                      >
                        {data.project_name}
                      </a>
                      <p className="text-sm">{data.project_description}</p>
                      <p className="text-sm text-gray-400">
                        {formattedStartDate} - {formattedEndDate}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ),
        loading: loading?.projects,
        onAdd: (id) => {
          setFormType(id);
        },
      },
    ],
    [educationData, projectData, skillData, user, workExperienceData]
  );

  const uploadResume = async () => {
    setUploading(true);
    const resumeResponse = await resumeService.addResume(selectedResume);
    if (resumeResponse) {
      setSelectedResume(null);
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchUserResumes = async () => {
      try {
        const userResumes = await resumeService.getUserResumes();
        setUserResumes(userResumes);
      } catch (error) {
        console.error("Error fetching user resumes:", error);
      }
    };

    fetchUserResumes(); // Call the async function
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className={`${className}`}>
      {/* <div className="relative">
        <div className="w-full font-normal text-gray-300 px-2 py-2 rounded-lg border text-center border-dashed cursor-pointer">
          {selectedResume ? (
            <p className="text-gray-700">{selectedResume}</p> // Display the selected resume name
          ) : (
            'Add a resume +'
          )}
        </div>
        <input
          className="absolute top-0 left-0 border w-full h-full opacity-0 cursor-pointer"
          type="file"
          accept="application/pdf" // Only allow PDF files
          onChange={handleFileChange} // Handle file selection
        />
      </div> */}
      {isEditable && (
        <div className="bg-white sm:border  px-4 py-4 mb-5 md:px-6">
          <p className="font-medium text-lg mb-2">Resumes</p>
          <div className="mb-5 flex flex-col gap-2">
            {userResumes?.map((resume, index) => (
              <div
                key={index}
                className="border px-4 py-3 flex gap-2 rounded-lg"
              >
                <svg
                  className="w-6 h-6 text-red-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 2a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V7l-6-5H6z"
                  />
                </svg>
                <p>{resume.fileName}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center flex-wrap w-full">
            <div
              className={`relative flex-grow flex items-center border rounded-lg  ${
                !selectedResume && "border-dashed bg-white "
              } bg-gray-50 border-gray-300 px-4 py-3`}
            >
              {selectedResume ? (
                <>
                  <svg
                    className="w-6 h-6 text-red-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 2a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V7l-6-5H6z"
                    />
                  </svg>
                  <p className="flex-1 text-gray-700 truncate">
                    {selectedResume.name}
                  </p>
                  {/* <button
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Remove
              </button> */}
                  <svg
                    className="h-5 w-5 text-gray-500 pointer-events-auto transition-all duration-500 ease-in-out transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => setSelectedResume(null)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                      className="transition-all duration-500 ease-in-out"
                    />
                    )
                  </svg>
                </>
              ) : (
                <>
                  <p className="flex-1 text-gray-300 text-center">
                    Add a resume +
                  </p>
                </>
              )}
              {!selectedResume && (
                <input
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              )}
            </div>
            {selectedResume &&
              (uploading ? (
                <svg
                  className="inline w-8 h-7 my-1.5 text-transparent animate-spin fill-blue-500 "
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
                <svg
                  onClick={() => {
                    uploadResume();
                  }}
                  class="h-full w-10 text-white bg-blue-500 p-2 rounded-full"
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
                  <line x1="12" y1="5" x2="12" y2="19" />{" "}
                  <line x1="18" y1="11" x2="12" y2="5" />{" "}
                  <line x1="6" y1="11" x2="12" y2="5" />
                </svg>
              ))}{" "}
          </div>
          {/* <button className="bg-blue-500 text-white w-full text-center text-lg font-medium rounded-lg px-4 py-3 mt-3">Upload</button> */}
        </div>
      )}
      {skillData.length == 0 &&
        educationData.length == 0 &&
        workExperienceData.length == 0 &&
        projectData.length == 0 && (
          <p className="max-w-xl pt-14 text-center sm:h-full h-fit px-6 md:px-6">
            <p className="text-2xl font-bold text-gray-500">
              No Qualifications Added Yet 
            </p>
            <p className="mt-1 text-gray-400">
              User qualification like skills, projects , work experience and educations  will be show here once user adds it 
            </p>
          </p>
        )}
      {userDetailsList.map((item) => (
        <Section
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          loading={item.loading}
          onAdd={item.onAdd}
        />
      ))}
    </div>
  );
}

export default Qualification;
