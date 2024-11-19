import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useJobApi from "../services/jobService";
import useProfileApi from "../services/profileService";
import UserImageInput from "./Input/UserImageInput";
import profileImageDefault from "../assets/user_male_icon.png";
import { formatDistanceToNow } from "date-fns";
import authService from "../services/authService";
import applicationService from "../services/applicationService";
import { useSelector } from "react-redux";
import approachService from "../services/approachService";
import interviewService from "../services/interviewService";
import { updateUserDetails } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import resumeService from "../services/resumeService";
import searchService from "../services/searchService";
import JobListItem from "./jobComponent/JobListItem";
import companyDefaultImage from "../assets/companyDefaultImage.png";
import savedService from "../services/savedService";
import "../css/button.css";

function JobProfileView({ jobId = useParams().jobId, crossButton, onBack }) {
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [qualification, setQualification] = useState();
  const [applied, setapplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [postData, setpostData] = useState();
  const [currentTab, setCurrentTab] = useState("Job details");
  const [tabIndex, setTabIndex] = useState(0);
  const currentUser = useSelector((state) => state.auth.user);

  // Access the passed data
  // const jobDetails = location.state?.jobDetails;
  const [jobDetails, setJobDetails] = useState(null);

  // useEffect(() => {
  //   if (location.state?.jobDetails) {
  //     setJobDetails(location.state.jobDetails);
  //     console.log("", jobDetails);
  //   }
  // }, [location.state?.jobDetails]);
  const [selectedJob, setSelectedJob] = useState();
  const [jobApproach, setJobApproach] = useState(null);
  const [applicantsCount, setapplicantsCount] = useState(0);
  const [approaches, setApproaches] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobInterview, setJobInterview] = useState(null);
  const userDetails = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState({
    jobDetails: true,
    checkSaved: true,
  });
  const [selectResume, setSelectResume] = useState(null);
  const [atTop, setAtTop] = useState(0);
  const [userResumes, setUserResumes] = useState([]);
  const profileService = useProfileApi();
  const dispatch = useDispatch();
  const [selectedResume, setSelectedResume] = useState(null);
  const [relatedJobs, setrelatedJobs] = useState([]);
  const [copied, setCopied] = useState(false);
  const [copiedAnimation, setCopiedAnimation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleDescription = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if(!loading.jobDetails && !jobDetails){
      navigate("/not-found", { replace: true })
    }

  }, []);
  const jobService = useJobApi();
  const profileRef = useRef();
  const navigate = useNavigate();

  const copyToClipboard = () => {
    console.log("copying");
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setCopiedAnimation(true);
        setTimeout(() => setCopiedAnimation(false), 1000); // Reset after 2 seconds

        setTimeout(() => setCopied(false), 4000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  useEffect(() => {
    const fetchApproaches = async () => {
      const approaches = await approachService.getUserApproaches(
        userDetails._id
      );

      setApproaches(approaches.filter((approach) => approach.job._id == jobId));
    };

    const fetchInterviews = async () => {
      const interviews = await interviewService.getUserInterviews(
        userDetails._id
      );
      setInterviews(interviews);
    };

    if (userDetails) {
      fetchApproaches();
      fetchInterviews();
    }
  }, []);

  useEffect(() => {
    document.title = jobDetails?.job_role;
  }, [jobDetails]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, jobDetails: true }));
      try {
        const response = await jobService.job.getById(jobId);

        setJobDetails(response);
      } catch (error) {
        setJobDetails(null);
        console.error("Failed to fetch user details", error);
      } finally {
        setLoading((prev) => ({ ...prev, jobDetails: false }));
      }
    };

    // const fetchUserData = async () => {
    //   setLoading((prev) => ({ ...prev, userDetails: true }));
    //   try {
    //     const response = await authService.fetchUserDetails();
    //     if (response.saved_jobs?.some((job) => job == jobId)) {
    //       setSaved(true);
    //     }
    //     setuserDetails(response);
    //   } catch (error) {
    //     setuserDetails(null);
    //     console.error("Failed to fetch user details", error);
    //   } finally {
    //     setLoading((prev) => ({ ...prev, userDetails: false }));
    //   }
    // };

    const checkApplied = async () => {
      setLoading((prev) => ({ ...prev, checkApplied: true }));
      try {
        const application = await applicationService.checkApplied({
          jobId: jobId,
          userId: userDetails._id,
        });
        if (application.exists) {
          setapplied(true);
        } else {
          setapplied(false);
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
      } finally {
        setLoading((prev) => ({ ...prev, checkApplied: false }));
      }
    };

    const fetchApplicantsCount = async () => {
      setLoading((prev) => ({ ...prev, applicantsCount: true }));
      try {
        const applicants = await applicationService.getApplicantsCount(jobId);
        setapplicantsCount(applicants);
      } catch (error) {
        console.error("Failed to fetch applicants data", error);
      } finally {
        setLoading((prev) => ({ ...prev, applicantsCount: false }));
      }
    };

    // const fetchQualificationData = async () => {
    //   setLoading((prev) => ({ ...prev, qualification: true }));
    //   try {
    //     const qualificationData =
    //       await profileService.qualification.getQualificationById(userId);
    //     setQualification(qualificationData);
    //   } catch (error) {
    //     console.error("Failed to fetch qualification data", error);
    //   } finally {
    //     setLoading((prev) => ({ ...prev, qualification: false }));
    //   }
    // };

    // const fetchUserJobsPosts = async ()=>{
    //   setLoading((prev) => ({ ...prev, job: true }));
    //   try {
    //     const jobData =
    //       await jobService.job.getByUserIds(userId);
    //     setJobData(jobData);
    //   } catch (error) {
    //     console.error("Failed to fetch qualification data", error);
    //   } finally {
    //     setLoading((prev) => ({ ...prev, job: false }));
    //   }
    // }

    const checkSaved = async () => {
      setLoading((prev) => ({ ...prev, checkSaved: true }));
      try {
        const saveData = await savedService.checkSaved({
          userId: userDetails._id,
          saved_content: jobDetails._id,
        });
        setSaved(saveData.exists);
      } catch (error) {
        console.error("Failed to fetch saved data", error);
      } finally {
        setLoading((prev) => ({ ...prev, checkSaved: false }));
      }
    };

    if (jobId) {
      // Ensure userId exists before making requests
      // fetchUserData();

      checkApplied();
      // checkSaved();
      fetchData();

      setJobApproach(
        approaches.filter((approach) => approach.job._id == jobId)
      );
      setJobInterview(
        interviews.find((interview) => interview.job._id === jobId)
      );

      fetchApplicantsCount();
    }
  }, [jobId, interviews]);

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      const relatedJobs = await searchService.secrchJobByKeyword(
        jobDetails?.job_role
      );
      setrelatedJobs(relatedJobs.filter((job) => job._id != jobDetails?._id));
    };
    const checkSaved = async () => {
      setLoading((prev) => ({ ...prev, checkSaved: true }));
      try {
        const saveData = await savedService.checkSaved({
          userId: userDetails._id,
          saved_content: jobDetails._id,
        });
        setSaved(saveData.exists);
      } catch (error) {
        console.error("Failed to fetch saved data", error);
      } finally {
        setLoading((prev) => ({ ...prev, checkSaved: false }));
      }
    };
    if (!saved) {
      checkSaved();
    }

    fetchRelatedJobs();
  }, [jobDetails]);

  const saveJob = async () => {
    setSaved(true);
    const response = await savedService.save({
      user: userDetails._id,
      contentType: "job",
      saved_content: jobDetails._id,
    });
  };

  const unsaveJob = async () => {
    setSaved(false);
    const response = await savedService.unsave(jobDetails._id);
  };

  const applyJob = async () => {
    // setSelectResume(true);

    const response = await applicationService.createApplication({
      job: jobId,
      user: userDetails._id,
      employeer: selectResume._id,
      resume: selectedResume._id,
    });
    setapplied(true);
    setSelectResume(null);
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
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (profileRef.current) {
        const currentScrollY = profileRef.current.scrollTop;

        if (currentScrollY !== atTop) {
          setAtTop(currentScrollY); // Only update if value changes
        }
      }
    };

    const profileElement = profileRef.current;
    if (profileElement) {
      profileElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (profileElement) {
        profileElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [atTop]);

  const renderTabContent = () => {
    if (loading.jobDetails) {
      return (
        <div className="h-full">
          <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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
        </div>
      );
    }

    switch (currentTab) {
      case "Job details":
        return (
          !loading.jobDetails && jobDetails && (
            <div className="flex flex-col sm:px-0 sm:gap-4 ">
              {/* <div className="border  px-4 flex flex-col gap-4 md:px-6 py-6">
                {jobDetails.location && (
                  <div className="flex gap-2  ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="h-5 w-5"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                    <p className="-mt-1"> {jobDetails.location?.address} </p>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="h-5 w-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5" />
                  </svg>
                  {jobDetails.experience_type == "Experienced" ? (
                    <p>
                      {" "}
                      {jobDetails.min_experience}{" "}
                      {jobDetails.max_experience != jobDetails.min_experience &&
                        "-" + jobDetails.max_experience}{" "}
                      years
                    </p>
                  ) : (
                    <p>Not mentioned</p>
                  )}
                </div>
                <div className="flex gap-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="h-5 w-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                  </svg>
                  {jobDetails.min_salary || jobDetails.max_salary ? (
                    <p>
                      {" "}
                      {jobDetails.min_salary}{" "}
                      {jobDetails.max_salary != jobDetails.min_salary &&
                        "- " + jobDetails.max_salary}{" "}
                      {jobDetails.max_salary?.length <= 5
                        ? "per year"
                        : "per year"}
                    </p>
                  ) : (
                    <p className="-mt-0.5">Not mentioned</p>
                  )}
                </div>
              </div> */}
              <div className=" flex flex-col px-4 sm:px-6 gap-6 sm:border bg-white mb-10  py-6 ">
                <div>
                  <p className="font-medium text-xl mb-3 border-b pb-3 ">
                    Description
                  </p>
                  <div>
                    <p
                      className={`max-w-full break-words whitespace-normal ${
                        isExpanded ? "" : "overflow-hidden line-clamp-3"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: jobDetails.description,
                      }}
                    />
                    <button
                      className={`${
                        isExpanded ? "text-gray-400" : "text-gray-800"
                      } text-sm mt-2`}
                      onClick={toggleDescription}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  </div>
                  {/* {jobDetails.description}
                  </p> */}
                </div>
                {jobDetails.skills_required.length > 0 && (
                  <div>
                    <p className="  font-medium border-b   text-xl mb-3 pb-3">
                      Skills required
                    </p>
                    <div className="flex gap-2 text-sm flex-wrap">
                      {jobDetails.skills_required?.map((skill, index) => (
                        <p
                          className="bg-gray-50 px-3 py-1.5 font-medium text-gray-500 border rounded-md"
                          key={index}
                        >
                          {skill}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        );
      case "About company":
        return (
          !loading.jobDetails && (
            <div className="py-4 px-4 bg-white md:px-6 mb-10 flex md:border flex-col gap-4">
              <div className=" ">
                <p className="font-medium">Company name</p>
                <p className="text-sm text-gray-400">
                  {jobDetails?.user
                    ? jobDetails?.user.company_details.company_name
                    : jobDetails?.company_name}
                </p>
              </div>
              <div className="">
                <p className="font-medium">Company location</p>
                <p className="text-sm text-gray-400">
                  {jobDetails.user
                    ? jobDetails.user.location.address
                    : jobDetails.location.address ||
                      jobDetails.location.country ||
                      jobDetails.location.state}
                </p>
              </div>
              {jobDetails.user && (
                <div className=" ">
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-gray-400">
                    {jobDetails.user.description || "Not available"}
                  </p>
                </div>
              )}
              <div className=" ">
                <p className="font-medium">Industry</p>
                <p className="text-sm text-gray-400">
                  {jobDetails.user
                    ? jobDetails.user.company_details.industry
                    : "Not available"}
                </p>
              </div>
            </div>
          )
        );
      case "About user":
        return (
          !loading.jobDetails && (
            <div className=" px-4 md:px-6 flex bg-white flex-col pb-[100px] gap-4 md:border py-4">
              <div className="">
                <p className="font-medium mb-2">Posted by user</p>
                <div className="border sm:w-1/2 w-full justify-between flex gap-5 items-center p-3 rounded-xl px-4">
                  <div className="flex gap-3  items-center">
                    <UserImageInput
                      imageHeight={40}
                      isEditable={false}
                      image={jobDetails.user.profileImage.compressedImage}
                    />
                    <div>
                      <p className="font-medium">
                        {jobDetails.user.personal_details.firstname}{" "}
                        {jobDetails.user.personal_details.lastname}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {jobDetails.user.username}
                      </p>
                    </div>
                  </div>
                  <svg
                    onClick={() => {
                      navigate("/user/" + jobDetails.user._id);
                    }}
                    class="h-8 w-8 mt-px text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </div>
              <div className="">
                <p className="font-medium">Email address</p>
                <p className="text-sm text-gray-400">{jobDetails.user.email}</p>
              </div>

              {/* <div className=" ">
            <p className="font-medium">
              Company location
            </p>
            <p  className="text-sm text-gray-400">
              {jobDetails.user.location.address}
            </p>
          </div>
          <div className=" ">
            <p className="font-medium">
              Description
            </p>
            <p  className="text-sm text-gray-400">
              {jobDetails.user.description || "Not available"}
            </p>
          </div>
          <div className="">
            <p className="font-medium">
              Industry
            </p>
            <p  className="text-sm text-gray-400">
              {jobDetails.user.company_details.industry || "Not available"}
            </p>
          </div> */}
            </div>
          )
        );
      case "Related jobs":
        return (
          <div className="p-4 sm:px-0 pb-14 flex flex-col gap-5 ">
            {relatedJobs.length <= 0 ? (
              <div className="w-full text-center text-lg text-gray-500">
                {" "}
                No related jobs
              </div>
            ) : (
              relatedJobs.map((job) => (
                <JobListItem
                  job={job}
                  companyDefaultImage={companyDefaultImage}
                  className="border bg-white rounded-lg sm:rounded-none sm:shadow-none"
                />
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };
  // if (!jobDetails) {
  //   return (
  //     <div className="text-center py-20">
  //       <h2 className="text-2xl font-semibold text-red-500 mb-4">
  //         Failed to Load
  //       </h2>
  //       <p className="text-gray-500">
  //         We couldn't load the job details. Please try again later.
  //       </p>
  //     </div>
  //   );
  // }
  return (
    jobDetails ?<div
      className={` w-full h-full sm:p-10 bg-gray-50 sm:py-6 flex justify-center overflow-y-auto gap-8 ${
        !userDetails && ""
      }`}
    >
      <div
        ref={profileRef}
        style={{ scrollbarWidth: "none" }}
        className={`${
          !jobId && "hidden"
        } overflow-y-auto w-full rounded-3xl flex-1 relative   flex-grow ${
          showProfileImage && "pointer-events"
        }`}
      >
        {selectResume && (
          <div className=" fixed h-fit  w-full z-50 -mt-5">
            <div
              onClick={() => setSelectResume(false)}
              className=" w-screen h-screen bg-black opacity-50"
            ></div>

            <div
              className={`fixed inset-x-0 w-screen  z-50 p-4 md:p-6 sm:max-w-sm transition-transform transform ${
                selectResume ? "translate-y-0" : "translate-y-full"
              } bottom-0 sm:top-1/2 sm:left-1/2 h-fit sm:-translate-x-1/2 sm:-translate-y-1/2 ${
                !selectResume && "md:hidden"
              } bg-white border rounded-t-xl sm:rounded-lg shadow-lg`}
            >
              <h3 className="text-lg font-medium mb-5 mt-2">Select a resume</h3>
              <div className="mb-5 flex flex-col gap-2">
                {userResumes?.map((resume, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedResume(resume);
                    }}
                    className={`border ${
                      selectedResume == resume && "border-blue-500"
                    } px-4 py-3 flex gap-2 rounded-lg`}
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
              {/* <form onSubmit={setupInterview} className="flex flex-col gap-6">
            <div className="flex gap-4">
              <DateInput
                type={"date"}
                value={interviewForm.interview_date}
                onChange={(e) => {
                  setInterviewForm((prev) => ({
                    ...prev,
                    interview_date: e.target.value,
                  }));
                }}
                minDate={"today"}
                name={"interview_date"}
                placeholder={"Interview Date"}
              />
              <div className=" peer  flex-grow">
                <input
                  value={interviewForm.interview_time}
                  type="time"
                  onChange={(e) => {
                    setInterviewForm((prev) => ({
                      ...prev,
                      interview_time: e.target.value,
                    }));
                  }}
                  placeholder="Time"
                  className=" block border rounded-sm h-full focus:border-blue-500 outline-none w-full p-2"
                />
              </div>
            </div>

            <OptionInput
              name="interview_mode"
              value={interviewForm.interview_mode}
              onChange={(e) => {
                setInterviewForm((prev) => ({
                  ...prev,
                  interview_mode: e.target.value,
                }));
              }}
              options={["In-person", "Online", "Phone call"]}
              placeholder={"Mode of Interview"}
            />
          
            {interviewForm.interview_mode == "Online" && (
              <UrlInput
                value={interviewForm.interview_link}
                name={"meet_link"}
                onChange={(e) => {
                  setInterviewForm((prev) => ({
                    ...prev,
                    interview_link: e.target.value,
                  }));
                }}
                placeholder={"Meet link"}
              />
            )}
            {interviewForm.interview_mode == "In-person" && (
              <div className="flex flex-col gap-6">
                <TextAreaInput
                  placeholder={"Interview address"}
                  name={"interview_address"}
                  onChange={(e) => {
                    setInterviewForm((prev) => ({
                      ...prev,
                      interview_address: e.target.value,
                    }));
                  }}
                />
                <TextInput
                  placeholder={"Location link (Optional)"}
                  name={"location_link"}
                  onChange={(e) => {
                    setInterviewForm((prev) => ({
                      ...prev,
                      interview_location_link: e.target.value,
                    }));
                  }}
                />
              </div>
            )}
            <div className="mt-4">
              <button
                type="submit"
                className="bg-gray-800 font-medium text-white px-4 py-2 rounded-md"
              >
                Confirm Interview
              </button>
            </div>
          </form> */}

              <div className="mt-4 w-full">
                <button
                  onClick={() => {
                    applyJob();
                  }}
                  // type="submit"
                  className="bg-gray-800 w-full font-medium text-white px-4 py-3 text-xl  rounded-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
        {showProfileImage && (
          <div
            onClick={() => setShowProfileImage(false)}
            className="h-screen  w-full top-0 bg-white opacity-85 z-50 fixed"
          ></div>
        )}
        <div className="flex relative  flex-wrap">
          <div className="bg-gray-100 border-x absolute top-0 w-full h-32 sm:h-40"></div>
          <div
            className={` w-full border-t rounded-t-3xl  fixed sm:sticky  ${
              atTop > 100 ? "bg-white" : "bg-gray-100"
            }  sm:border-x  z-20 top-0   px-4 py-4  flex `}
          >
            <div className="flex w-full items-center gap-4">
              {atTop >= 100 && (
                <UserImageInput
                  isEditable={false}
                  className={""}
                  image={
                    jobDetails?.profileImage?.originalImage ||
                    (jobDetails?.user?.company_details &&
                      jobDetails?.user?.profileImage.originalImage) ||
                    jobDetails?.company_logo ||
                    companyDefaultImage
                  }
                  imageHeight="45"
                  onError={(e) => {
                    e.target.src = companyDefaultImage; // Replace with default image on error
                  }}
                />
              )}
              <div className="flex flex-col justify-center w-full">
                <p className="text-xl flex justify-between  w-full font-semibold">
                  {atTop > 100 ? (
                    <p className="truncate max-w-full line-clamp-1 text-wrap">
                      {jobDetails?.job_role}
                    </p>
                  ) : (
                    <p className="text-2xl">Job profile</p>
                  )}
                  {crossButton && (
                    <svg
                      onClick={() => {
                        onBack();
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
                  )}
                </p>
                <p className="text-gray-400 text-sm">
                  {atTop > 100 && jobDetails.company_name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-t sm:border-t-0 pt-8 pb-6 mt-10 sm:mt-0 flex-grow sm:border-x px-4 md:px-6 gap-3 bg-white justify-center flex-col">
            {loading.jobDetails ? (
              <div className="animate-pulse ">
                <div className="flex justify-between">
                  <div className="flex  items-center">
                    <div className="p-2 bg-white rounded-full">
                      <div className="h-[100px] bg-gray-200 w-[100px] rounded-full mb-2"></div>
                    </div>
                    <div className="  w-32 ml-2 -mt-3 sm:mt-0">
                      <div className="h-6 bg-gray-200 rounded-full mb-2"></div>
                      <div className="h-4 bg-gray-200 mt-4 rounded-full mb-2"></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 justify-center mt-2">
                  <div className="h-4 bg-gray-200 w-1/4 rounded-full"></div>
                  <div className="h-4 bg-gray-200 w-1/4 rounded-full"></div>
                  <div className="h-4 bg-gray-200 w-1/4 rounded-full"></div>
                </div>
                {/* <div className="h-3 bg-gray-200 rounded-md mt-2"></div>
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
                </div> */}
              </div>
            ) : (
              jobDetails &&<div className="mt-2 flex relative  flex-col ">
                <div className="flex mb-4 mt-1  w-full gap-4  items-center">
                  <UserImageInput
                    imageBorder={showProfileImage ? "none" : "2"}
                    className={`transition-all ease-in-out absolute blur-none bg-white p-2 rounded-full duration-300 
                     `}
                    imageClassName={showProfileImage ? "shadow-3xl" : ""}
                    isEditable={false}
                    image={
                      jobDetails?.profileImage?.originalImage ||
                      (jobDetails?.user?.company_details &&
                        jobDetails?.user?.profileImage.originalImage) ||
                      jobDetails?.company_logo ||
                      companyDefaultImage
                    }
                    imageHeight="100"
                    onError={(e) => {
                      e.target.src = companyDefaultImage; // Replace with default image on error
                    }}
                  />

                  <div className="flex w-full ml-32 mt-2  gap-2 justify-between items-center">
                    <div>
                      <h1 className="text-2xl  text-wrap md:text-3xl leading-[32px] font-semibold text-gray-900">
                        {jobDetails?.job_role}
                      </h1>
                      <div className="flex  gap-2 mt-2">
                        <p className="text-lg font-light sm:font-normal sm:text-xl text-gray-400">
                          {jobDetails?.company_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {jobDetails.job_source != "job_post" ? (
                  <div className="flex flex-wrap sm:text-xl text-lg self-center  text-gray-700 font-medium  gap-3 flex-row text-nowrap mt-5">
                    {/* <div className="flex gap-2 border px-3 py-1.5 bg-gray-50 rounded-lg items-center">
                    <svg
                      className="h-6 w-6 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-nowrap  sm:text-base  ">
                      {job.min_salary || job.max_salary
                        ? ` ${job.min_salary>1000?job.min_salary/1000+"K":job.min_salary}  - ${job.max_salary>1000?job.max_salary/1000+"K":job.max_salary}`
                        : "Not disclosed"}
                    </p>
                  </div> */}
                    {/* <div className="min-h-full border-l mx-1 w-px"></div> */}
                    <div className="flex gap-3 font-medium  items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-briefcase-fill text-gray-400"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
                        <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
                      </svg>
                      <p className="text-nowrap">
                        {jobDetails.min_experience || jobDetails.max_experience
                          ? `${jobDetails.min_experience} - ${jobDetails.max_experience}`
                          : "Experience not specified"}
                      </p>
                    </div>
                    <div className="mx-3 border-l"></div>

                    {jobDetails.location && (
                      <div className="flex gap-2 items-center ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          class="bi bi-geo-alt-fill text-gray-400"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                        </svg>
                        <p className="text-wrap">
                          {jobDetails.location?.city ||
                            jobDetails.location?.state ||
                            jobDetails.location?.country ||
                            jobDetails.location?.address}
                        </p>
                      </div>
                    )}
                    <div className="mx-3 border-l"></div>

                    <div className="flex gap-2 items-center">
                      {jobDetails.currency_type == "$" ||
                      jobDetails.currency_type == "USD" ? (
                        <svg
                          class="h-6 w-6 text-gray-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : jobDetails.currency_type == "₹" ? (
                        <svg
                          className="h-7 w-7 text-gray-800 "
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        jobDetails.currency_type
                      )}
                      <p className="text-nowrap    ">
                        {jobDetails.min_salary || jobDetails.max_salary
                          ? ` ${
                              jobDetails.min_salary > 1000
                                ? jobDetails.min_salary / 1000 + "K"
                                : jobDetails.min_salary
                            }  - ${
                              jobDetails.max_salary > 1000
                                ? jobDetails.max_salary / 1000 + "K"
                                : jobDetails.max_salary
                            }`
                          : "Not disclosed"}
                        {jobDetails.salary_type && (
                          <span className="text-gray-400 font-normal ml-2">
                            per {jobDetails.salary_type}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg border mt-5 p-2  px-4">
                    <p className=" inline-flex flex-wrap">
                      <span className="mr-1">
                        This job is fetched from a job post.{" "}
                      </span>
                      {/* <a className="text-gray-800 cursor-pointer flex gap-1 font-medium items-center">
                        View post{" "}
                      </a> */}
                    </p>
                  </div>
                )}

                {/* <div className="order-3 flex flex-col gap-2">
              <div classNa <svg
                          class="h-5 w-5 text-gray-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>me="text-sm flex justify-between flex-wrap  order-1 text-gray-400 items-end">
                <p>
                  <span>{jobDetails.location?.address} · </span>
                  {applicantsCount || 0} Applicant
                  {applicantsCount > 1 && "s"}
                  <span className="  font-normal"> followers</span>{" "}
                {jobDetails.account_type == "Candidate" && (
                  <span>
                    · {jobDetails.followings ? jobDetails.followings : 0}{" "}
                    <span className="  font-normal">following</span>
                  </span>
                )}
                </p>
                {jobDetails.updatedAt ? (
                  <p className=" mt-0.5 text-gray-400">
                    Posted{" "}
                    {formatDistanceToNow(
                      new Date(
                        jobDetails.updatedAt || jobDetails.job_post_date
                      ),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                ) : (
                  <p className=" mt-0.5 text-gray-400">
                    Posted{" "}
                    {formatDistanceToNow(
                      new Date(
                        jobDetails.createdAt || jobDetails.job_post_date
                      ),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                )}
              </div>
              {
                jobDetails.bio && (
                  <div onClick={() => setFormType("jobDetails")}>
                    {jobDetails.bio}
                  </div>
                )
                // : (
                //   <div
                //     onClick={() => setFormType("jobDetails")}
                //     className=" text-sm font-normal text-gray-300 px-2 py-1 rounded-lg border w-fit  border-dashed"
                //   >
                //     Add a bio +
                //   </div>
                // )
              }
              {jobDetails.account_type == "Candidate" && (
                <div className="order-2 text-sm -mt-1">
                  <p className=" text-wrap truncate">
                    {jobDetails.personal_details.working_at && (
                      <span>
                        Works at {jobDetails.personal_details.working_at}{" "}
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
            </div> */}

                {/* <div className="order-3 flex flex-col gap-2">
              <div classNa <svg
                          class="h-5 w-5 text-gray-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>me="text-sm flex justify-between flex-wrap  order-1 text-gray-400 items-end">
                <p>
                  <span>{jobDetails.location?.address} · </span>
                  {applicantsCount || 0} Applicant
                  {applicantsCount > 1 && "s"}
                  <span className="  font-normal"> followers</span>{" "}
                {jobDetails.account_type == "Candidate" && (
                  <span>
                    · {jobDetails.followings ? jobDetails.followings : 0}{" "}
                    <span className="  font-normal">following</span>
                  </span>
                )}
                </p>
                {jobDetails.updatedAt ? (
                  <p className=" mt-0.5 text-gray-400">
                    Posted{" "}
                    {formatDistanceToNow(
                      new Date(
                        jobDetails.updatedAt || jobDetails.job_post_date
                      ),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                ) : (
                  <p className=" mt-0.5 text-gray-400">
                    Posted{" "}
                    {formatDistanceToNow(
                      new Date(
                        jobDetails.createdAt || jobDetails.job_post_date
                      ),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                )}
              </div>
              {
                jobDetails.bio && (
                  <div onClick={() => setFormType("jobDetails")}>
                    {jobDetails.bio}
                  </div>
                )
                // : (
                //   <div
                //     onClick={() => setFormType("jobDetails")}
                //     className=" text-sm font-normal text-gray-300 px-2 py-1 rounded-lg border w-fit  border-dashed"
                //   >
                //     Add a bio +
                //   </div>
                // )
              }
              {jobDetails.account_type == "Candidate" && (
                <div className="order-2 text-sm -mt-1">
                  <p className=" text-wrap truncate">
                    {jobDetails.personal_details.working_at && (
                      <span>
                        Works at {jobDetails.personal_details.working_at}{" "}
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
            </div> */}
              </div>
            )}
            {approaches?.status === "approached" ? (
              <div className="bg-blue-50 text-gray-800 shadow-md font-medium text-sm flex gap-2 flex-wrap justify-between items-center p-4 rounded-lg">
                <p className="">Select response </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateApproach({
                        id: approaches._id,
                        status: "accepted",
                      });
                    }}
                    className="bg-gray-800 transition-colors text-white px-4 py-2 rounded-full "
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      updateApproach({
                        id: approaches._id,
                        status: "declined",
                      });
                    }}
                    className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-full "
                  >
                    Decline
                  </button>
                </div>
              </div>
            ) : approaches[0]?.status === "accepted" ? (
              <div className=" w-fit bg-yellow-50  text-yellow-600 mt-2 text-sm gap-2 flex flex-wrap justify-between items-center p-3 py-2 self-center rounded-md ">
                <p>
                  <span className="font-medium">Approach accepted</span>, you
                  will be notified about the next step
                </p>
              </div>
            ) : approaches[0]?.status === "interview_setup" ? (
              <p>
                {interviews?.map((interview) => {
                  if (interview.job._id == approaches.job._id) {
                    return (
                      <div className="text-sm justify-between items-center shadow-md flex gap-2 bg-gray-50 p-2 px-4 rounded-md">
                        <div>
                          <p>
                            {" "}
                            Interview scheduled on{" "}
                            <span className="font-medium">
                              {new Date(
                                interview.interview_date
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>{" "}
                            at <span>{interview.interview_time}</span>
                          </p>
                          <p>
                            Mode of interview{" "}
                            <span className="font-medium">
                              {interview.interview_mode}
                            </span>
                          </p>
                          {/* <p>Address {interview.interview_address}</p> */}
                        </div>
                        {interview.interview_mode == "In-person" && (
                          <div
                            className="relative"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              className="h-14 bg-white p-2 rounded-md border"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                            </svg>
                            <a
                              className="border absolute h-full w-full top-0 rounded-md "
                              href={interview.interview_location_link}
                            ></a>
                          </div>
                        )}
                        {interview.interview_mode == "Online" && (
                          <div
                            className="relative"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-link-45deg"
                              viewBox="0 0 16 16"
                            >
                              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                            </svg>
                            <a
                              className="border absolute h-full w-full top-0 rounded-md "
                              href={interview.interview_meet_link}
                            ></a>
                          </div>
                        )}
                      </div>
                    );
                  }
                })}
                {approaches.createdAt && (
                  <p className="mt-2 text-sm text-gray-400">
                    Approached ${approaches.createdAt}
                  </p>
                )}
              </p>
            ) : approaches[0]?.status === "declined" ? (
              <p className="text-red-500 text-sm">Approach declined</p>
            ) : null}
            {jobInterview && (
              <div className="text-sm justify-between items-center shadow-md flex gap-2 bg-gray-50 p-2 px-4 rounded-md">
                <div>
                  <p>
                    {" "}
                    Interview scheduled on{" "}
                    <span className="font-medium">
                      {new Date(jobInterview.interview_date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}
                    </span>{" "}
                    at <span>{jobInterview.interview_time}</span>
                  </p>
                  <p>
                    Mode of interview{" "}
                    <span className="font-medium">
                      {jobInterview.interview_mode}
                    </span>
                  </p>
                  {/* <p>Address {interview.interview_address}</p> */}
                </div>
                {jobInterview.interview_mode == "In-person" && (
                  <div
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="h-14 bg-white p-2 rounded-md border"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                    </svg>
                    <a
                      className="border absolute h-full w-full top-0 rounded-md "
                      href={jobInterview.interview_location_link}
                    ></a>
                  </div>
                )}
                {jobInterview.interview_mode == "Online" && (
                  <div
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-link-45deg"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                    </svg>
                    <a
                      className="border absolute h-full w-full top-0 rounded-md "
                      href={jobInterview.interview_meet_link}
                    ></a>
                  </div>
                )}
              </div>
            )}

            <div className=" transition-all flex gap-4">
              {/* {!userDetails && (
                <a
                  href={"/login"}
                  className={`w-fit px-5 ${
                    applied && "hidden"
                  } flex cursor-pointer py-1 md:order-2 text-center order-last gap-2 font-medium mt-3.5 items-center justify-center text-white bg-gray-800 sm:hover:bg-blue-600 pb-1 rounded-full`}
                >
                  Login / Sign up
                </a>
              )} */}
              {/* {(!jobApproach || jobApproach.length === 0) && userDetails && (
                <a
                  target="_blank"
                  onClick={() => {
                    if (!jobDetails?.job_url) {
                      setSelectResume(jobDetails.user);
                    }
                  }}
                  href={jobDetails?.job_url}
                  className={`w-fit px-5 ${
                    applied && "hidden"
                  } flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5 items-center justify-center text-white bg-gray-800 sm:hover:bg-blue-600 pb-1 rounded-full`}
                >
                  Apply
                </a>
              )} */}
              {/* {userDetails &&
                (saved ? (
                  <button
                    onClick={() => unsaveJob()}
                    className="w-fit px-5 border-2 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-gray-500  bg-gray-100 sm:hover:bg-gray-200 pb-0.5  rounded-full"
                  >
                    Unsave
                  </button>
                ) : (
                  <button
                    onClick={() => saveJob()}
                    className="w-fit px-5 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-gray-800 border-2 border-blue-500  sm:hover:bg-blue-50 pb-0.5  rounded-full"
                  >
                    Save
                  </button>
                ))} */}
            </div>
            {applied && (
              <p className="text-sm text-red-500 mt-2">
                Application already sent
              </p>
            )}
          </div>
        </div>
        <div
          className={`md:border-t sticky md:-top-[1px] top-16  bg-white md:mb-4 z-20 transition-all ease-in-out `}
        >
          <div className="relative w-full">
            <div
              style={{
                overflowX: "auto",
                scrollbarWidth: "none",
              }}
              className={`flex-grow z-20  max-w-full overflow-x-auto border-b  ${
                atTop > 340 ? " rounded-t-3xl sm:border" : "sm:border-x"
              } w-full    gap-3  font-medium flex`}
            >
              <div className="flex w-full pt-1">
                {[
                  "Job details",
                  userDetails
                    ? jobDetails?.job_source === "job_post"
                      ? "About user"
                      : "About company"
                    : null,
                  "Related jobs",
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
                        tab === currentTab ? "z-20 text-gray-800" : ""
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
                left: `${(100 / (userDetails ? 3 : 2)) * tabIndex}%`,
                transition: "left 0.2s ease-in-out",
              }}
              className={`${
                userDetails ? "w-1/3" : "w-1/2"
              } h-[2px] md:h-1 z-30 rounded-full bottom-0 left-0 bg-gray-800 absolute`}
            ></div>
            {/* <div className="fixed   w-full sm:max-w-xl self-center flex gap-3 bottom-[56px] sm:bottom-0 z-30 bg-white border px-4 py-5 items-center">
              {copied && (
                <p
                  className={`absolute -top-16   bg-black opacity-85 text-white font-medium rounded-xl px-6 py-2.5 shadow-lg border  
                      
                   ${copiedAnimation ? "animate-popup" : "animate-popdown"}`}
                >
                  Link Copied
                </p>
              )}
              <svg
                onClick={() => {
                  copyToClipboard();
                }}
                className="h-12 w-[70px] p-2 px-2.5 border text-gray-400 rounded-lg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <rect x="8" y="8" width="12" height="12" rx="2" />
                <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
              </svg>

              <button
                disabled={
                  applied ||
                  approaches[0]?.status === "accepted" ||
                  approaches[0]?.status === "approached"
                }
                onClick={() => {
                  if (!jobDetails?.job_url) {
                    setSelectResume(jobDetails.user);
                  } else {
                    window.open(jobDetails?.job_url, "_blank");
                  }
                }}
                href={jobDetails?.job_url}
                className={`disabled:bg-blue-300 bg-gray-800 text-white text-center flex items-center justify-center py-2.5 font-medium w-full rounded-lg text-xl transition-all duration-300 ease-in-out ${
                  applied ||
                  approaches[0]?.status === "accepted" ||
                  approaches[0]?.status === "approached"
                    ? "cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                {applied ? (
                  "Applied"
                ) : approaches[0]?.status === "accepted" ||
                  approaches[0]?.status === "approached" ? (
                  "Approached"
                ) : (
                  <span className="flex gap-2 items-center">
                    Apply{" "}
                    <svg
                      className="h-6 w-6 mt-px text-white"
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
                  </span>
                )}
              </button>

              {(jobDetails?.user || jobDetails?.job_source == "job_post") &&
                (loading.checkSaved ? (
                  <svg
                    className="inline h-14 w-[60px] rounded-lg  px-2.5 p-3 text-transparent animate-spin fill-blue-500 "
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
                ) : saved ? (
                  <svg
                    onClick={(e) => {
                      unsaveJob();
                      e.stopPropagation();
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="bi bi-bookmark-fill h-14 w-[60px] rounded-lg  px-2.5 p-3 self-start unliked-animation"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                  </svg>
                ) : (
                  <svg
                    onClick={(e) => {
                      saveJob();
                      e.stopPropagation();
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="bi bi-bookmark h-14 w-[60px] rounded-lg  px-2.5 p-3 self-start liked-animation"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                  </svg>
                ))}
            </div> */}
          </div>
        </div>

        <div className={`pb-12 sm:pb-0`}>{renderTabContent()}</div>
        <div
          className={`fixed ${
            userDetails && "mb-[55px] sm:mb-0"
          } sm:sticky sm:rounded-b-3xl  w-full self-center flex gap-3  bottom-0 z-30 bg-white sm:border border-t px-4 py-5 items-center`}
        >
          {copied && (
            <p
              className={`absolute -top-16   bg-black opacity-85 text-white font-medium rounded-xl px-6 py-2.5 shadow-lg border  
                      
                   ${copiedAnimation ? "animate-popup" : "animate-popdown"}`}
            >
              Link Copied
            </p>
          )}
          <svg
            // onClick={() => {
            //   copyToClipboard();
            // }}
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: jobDetails.job_role,
                    url: "http://workler.in/job/"+jobDetails._id,
                  });
                } catch (error) {
                  console.error("Error sharing:", error);
                }
              } else {
                copyToClipboard();
              }
            }}
            className="h-12 w-[70px] p-2 px-2.5 border text-gray-400 rounded-lg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
          </svg>

          <button
            disabled={
              applied ||
              approaches[0]?.status === "accepted" ||
              approaches[0]?.status === "approached" ||
              loading.jobDetails
            }
            onClick={() => {
              if (userDetails) {
                if (!jobDetails?.job_url) {
                  setSelectResume(jobDetails.user);
                } else {
                  window.open(jobDetails?.job_url, "_blank");
                }
              } else {
                navigate("/login");
              }
            }}
            href={jobDetails?.job_url}
            className={`disabled:bg-gray-600 bg-gray-800 text-white text-center flex items-center justify-center py-2.5 font-medium w-full rounded-lg text-xl transition-all duration-300 ease-in-out ${
              applied ||
              approaches[0]?.status === "accepted" ||
              approaches[0]?.status === "approached"
                ? "cursor-not-allowed"
                : ""
            }`}
          >
            {userDetails ? (
              applied ? (
                "Applied"
              ) : approaches[0]?.status === "accepted" ||
                approaches[0]?.status === "approached" ? (
                "Approached"
              ) : (
                <span className="flex gap-2 items-center">
                  Apply{" "}
                  <svg
                    className="h-6 w-6 mt-px text-white"
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
                </span>
              )
            ) : (
              "Login / Signup"
            )}
          </button>

          {(jobDetails?.user || jobDetails?.job_source == "job_post") &&
            userDetails &&
            (loading.checkSaved ? (
              <svg
                className="inline h-14 w-[60px] rounded-lg  px-2.5 p-3 text-transparent animate-spin fill-blue-500 "
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
            ) : saved ? (
              <svg
                onClick={(e) => {
                  unsaveJob();
                  e.stopPropagation();
                }}
                xmlns="http://www.w3.org/2000/svg"
                className="bi bi-bookmark-fill h-14 w-[60px] rounded-lg  px-2.5 p-3 self-start unliked-animation"
                viewBox="0 0 16 16"
              >
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
              </svg>
            ) : (
              <svg
                onClick={(e) => {
                  saveJob();
                  e.stopPropagation();
                }}
                xmlns="http://www.w3.org/2000/svg"
                className="bi bi-bookmark h-14 w-[60px] rounded-lg  px-2.5 p-3 self-start liked-animation"
                viewBox="0 0 16 16"
              >
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
              </svg>
            ))}
        </div>
      </div>
      <div
        className="hidden sticky   overflow-y-auto w-full max-w-md flex-col gap-5 lg:flex"
        style={{ scrollbarWidth: "none" }}
      >
        {/* {userDetails && (
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
              <p className="bg-gray-800 h-fit rounded-full text-white font-medium px-3 py-1">
                Follow
              </p>
            </div>
          </div>
        )} */}
        <div className="">
          <p className="text-xl font-semibold border sticky top-0 bg-white  py-4 px-6">
            Similar Jobs
          </p>
          <div className="pt-4 flex flex-col gap-4 ">
            {relatedJobs.length <= 0 ? (
              <div className="w-full text-center text-lg text-gray-500">
                {" "}
                No related jobs
              </div>
            ) : (
              relatedJobs.map((job) => (
                <JobListItem
                  className={"sm:shadow-none bg-white border sm:rounded-none"}
                  job={job}
                  companyDefaultImage={companyDefaultImage}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>:(
    loading.jobDetails?
     <div className="h-full flex justify-center">
          <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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
        </div>: <div className="w-full text-center mt-10">
        {" "}
        <p className="max-w-xl pt-20 text-center sm:h-full h-fit px-6 md:px-6">
          <p className="text-2xl font-bold text-gray-500">
            Failed to load content
          </p>
          <p className="mt-1 text-red-400">
            Refresh to load the content and try again to load content
          </p>
          <p
            onClick={() => {
              window.location.reload();
            }}
            className="text-blue-500 font-medium cursor-pointer"
          >
            Refresh
          </p>
        </p>
      </div>
    )
  );
}

export default JobProfileView;
