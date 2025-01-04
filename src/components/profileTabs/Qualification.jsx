import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import resumeService from "../../services/resumeService";
import imageCompression from "browser-image-compression"; // Image compression library
import { PDFDocument } from "pdf-lib";

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
  const [resumeUploadError, setResumeUploadError] = useState(null);

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
      <div className={`flex  border-b sm:border-b-0  flex-col mt-3 `}>
        <div className="flex justify-between items-center px-4 py-3 bg-white  border sm:border-b-0  w-full">
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
          <div className="p-4 sm:border  bg-white">{content}</div>
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
                  className={`py-1 px-4 w-fit ${data.level[0] == "B"?"bg-blue-50 text-blue-500 border-blue-500":data.level[0] == "I"?"bg-amber-50 border-amber-500 text-amber-500":"bg-red-50 border-red-500 text-red-500"} flex items-center  cursor-pointer border rounded-md ${
                    index === skillData?.length - 1 ? null : "border-b"
                  }`}
                >
                  <p className="font-medium hover:text-blue-500">{data.name}</p>
                  {/* <p className={`border-l  ${data.level[0] == "B"?" border-blue-500":data.level[0] == "I"?" border-amber-500 ":" border-red-500 "}   pl-2`}>{data.level[0]}</p> */}
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
                      index === educationData?.length - 1 ? null : "border-b"
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
                      index === educationData?.length - 1 ? null : "border-b"
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
                    index === workExperienceData?.length - 1 ? null : ""
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
            <div className="flex flex-col gap-3 overflow-hidden ">
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
                    index === projectData?.length - 1 ? null : "border"
                  }`}
                  >
                  <img
                    className="h-10 w-10 rounded-md"
                    src={
                    data.logo?.originalImage || "https://avatars.githubusercontent.com/u/43775498?v=4"
                    }
                  />
                  <div className="-mt-1 flex-1">
                    <p
                    onClick={(e) => { 
                      if(data.url){
                      e.stopPropagation();
                      console.log(data.url);
                      window.open("//"+data.url, '_blank');
                      }
                    }}
                    className="text-xl font-semibold flex items-center gap-2"
                    >
                    {data.project_name}
                    {data.url && (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 -mt-px text-blue-500">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                     </svg>
                     
                    )}
                    </p>
                    <p className="text-sm">{data.project_description}</p>
                    <p className="text-sm text-gray-400">
                    {formattedStartDate} - {formattedEndDate}
                    </p>
                    <div className="flex flex-wrap gap-2 text-gray-700 mt-2 text-sm  overflow-hidden text-ellipsis max-w-screen">
                    {data.technologies.map((tech, index) => (
                      <span key={index} className="border rounded-md bg-gray-50 px-3 py-[4px] font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-full">{tech}</span>
                    ))}
                    </div>
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

  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 1, // Limit file size to 1 MB
      maxWidthOrHeight: 1024, // Resize image dimensions
      useWebWorker: true, // Use a Web Worker for better performance
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      return compressedFile; // Return the compressed image file
    } catch (error) {
      console.error("Error compressing image:", error);
      throw new Error("Image compression failed");
    }
  };

  // Function to compress PDF
  const compressPDF = async (file) => {
    const maxSize = 100 * 1024; // 100 KB
    let pdfBytes = await file.arrayBuffer();
    let pdfDoc = await PDFDocument.load(pdfBytes);

    let compressedPdfBytes = await pdfDoc.save();

    // If file is larger than max size, keep compressing iteratively
    console.log("compressing");

    // For iterative compression, you might remove unused resources, downsample images, etc.
    pdfDoc = await PDFDocument.load(pdfBytes);
    compressedPdfBytes = await pdfDoc.save();
    // For now, we're simply trying the same compression over and over

    console.log([compressedPdfBytes], file.name, {
      type: "application/pdf",
    });

    return new File([compressedPdfBytes], file.name, {
      type: "application/pdf",
    });
  };

  // The upload function that compresses and uploads the file
  const uploadResume = async () => {
    setUploading(true); // Start loading state
    setResumeUploadError(null); // Reset previous errors

    console.log(selectedResume);

    try {
      // Define maximum file size (in bytes)
      const maxFileSize = 50 * 1024; // 100 KB

      // Compress the file based on type (PDF or image)
      let compressedFile;

      compressedFile = await compressPDF(selectedResume); // Compress PDF

      // Check if the compressed file size is below 100 KB
      if (compressedFile.size > maxFileSize) {
        throw new Error(
          "File too big , select the file with size less than 50 KB"
        );
      }

      // Upload the compressed file
      const resumeResponse = await resumeService.addResume(compressedFile);

      if (resumeResponse) {
        setUserResumes((prev) => [...prev, resumeResponse.resume]);
        setSelectedResume(null); // Reset selected resume
      }

      setUploading(false); // Set loading state to false
    } catch (e) {
      setUploading(false);
      setResumeUploadError(e.message || "An error occurred during the upload");
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
      {/* {isEditable && (
        <div className="bg-white sm:border border-b  px-4 py-4 mb-5 md:px-6">
          <p className="font-medium text-lg mb-2">Resumes</p>
          <div className="mb-5 flex flex-col gap-2">
            {userResumes?.map((resume, index) => (
              <div
                key={index}
                className="border px-4 py-3 flex justify-between gap-2 rounded-lg"
              >
                <div className="flex gap-2">
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
                <svg
                onClick={async()=>{
                  await resumeService.deleteResumesById(resume._id)
                  setUserResumes(userResumes.filter(item => item._id != resume._id ))


                }}
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
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
                        {resumeUploadError && <p className="text-red-500 mt-1">{resumeUploadError}</p>}

        </div>
      )} */}
      {!isEditable &&
        skillData?.length == 0 &&
        educationData?.length == 0 &&
        workExperienceData?.length == 0 &&
        projectData?.length == 0 && (
          <p className="max-w-xl pt-14 text-center sm:h-full h-fit px-6 md:px-6">
            <p className="text-2xl font-bold text-gray-500">
              No Qualifications Added Yet
            </p>
            <p className="mt-1 text-gray-400">
              User qualification like skills, projects , work experience and
              educations will be show here once user adds it
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
