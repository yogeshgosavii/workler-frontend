import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

function JobProfileView({ jobId = useParams().jobId, crossButton, onBack }) {
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [qualification, setQualification] = useState();
  const [applied, setapplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [postData, setpostData] = useState();
  const [currentTab, setCurrentTab] = useState("Job details");
  const [tabIndex, setTabIndex] = useState(0);
  const [jobDetails, setJobDetails] = useState(null);
  const [selectedJob, setSelectedJob] = useState();
  const [jobApproach, setJobApproach] = useState(null);
  const [applicantsCount, setapplicantsCount] = useState(0);
  const [approaches, setApproaches] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobInterview, setJobInterview] = useState(null);
  const userDetails = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState({ jobDetails: true });
  const [selectResume, setSelectResume] = useState(null);
  const [atTop, setAtTop] = useState(0);
  const [userResumes, setUserResumes] = useState([]);
  const profileService = useProfileApi();
  const dispatch = useDispatch();
  const [selectedResume, setSelectedResume] = useState(null);

  const jobService = useJobApi();
  const profileRef = useRef();
  useEffect(() => {
    const fetchApproaches = async () => {
      const approaches = await approachService.getUserApproaches(
        userDetails._id
      );
      console.log(approaches);
      setApproaches(approaches);
    };

    const fetchInterviews = async () => {
      const interviews = await interviewService.getUserInterviews(
        userDetails._id
      );
      setInterviews(interviews);
      console.log("jobInterviews", interviews);
    };
    fetchApproaches();
    fetchInterviews();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, jobDetails: true }));
      try {
        const response = await jobService.job.getById(jobId);
        console.log("response:", response);

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
    //     console.log("response:", response);
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
        // console.log("response:", application);
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
        console.log("applicants:", applicants);
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
    //     console.log("qualification:", qualificationData);
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
    //     console.log("jobData:", jobData);
    //     setJobData(jobData);
    //   } catch (error) {
    //     console.error("Failed to fetch qualification data", error);
    //   } finally {
    //     setLoading((prev) => ({ ...prev, job: false }));
    //   }
    // }

    if (jobId) {
      // Ensure userId exists before making requests
      // fetchUserData();
      console.log("jInter", interviews);
      if (userDetails.saved_jobs.some((job) => job == jobId)) {
        setSaved(true);
      }
      console.log(userDetails.saved_jobs);

      checkApplied();
      fetchData();

      setJobApproach(
        approaches.filter((approach) => approach.job._id === jobId)
      );
      setJobInterview(
        interviews.find((interview) => interview.job._id === jobId)
      );
      console.log(
        "jonInterview",
        interviews?.filter((interview) => interview.job._id == jobId)
      );
      // console.log("approaches",approaches.filter(approach  => approach.job._id === jobId));
      console.log("approaches", jobApproach);

      fetchApplicantsCount();
    }
  }, [jobId, interviews]);

  const saveJob = async () => {
    setSaved(true);
    const response = await authService.updateUserDetails({
      ...userDetails,
      saved_jobs: [...(userDetails.saved_jobs || []), jobId],
    });
    dispatch(updateUserDetails(response));

    console.log("saved data:", response);
  };

  const unsaveJob = async () => {
    setSaved(false);
    const response = await authService.updateUserDetails({
      ...userDetails,
      saved_jobs: userDetails.saved_jobs.filter((job) => job._id == jobId),
    });
    dispatch(updateUserDetails(response));
    console.log("unsaved data:", response);
  };

  const applyJob = async () => {
    // setSelectResume(true);
    console.log(selectedResume._id);

    const response = await applicationService.createApplication({
      job: jobId,
      user: userDetails._id,
      employeer: selectResume._id,
      resume: selectedResume._id,
    });
    setapplied(true);
    setSelectResume(null);

    console.log(response);
  };
  useEffect(() => {
    const fetchUserResumes = async () => {
      try {
        const userResumes = await resumeService.getUserResumes();
        console.log("userResumes:", userResumes);
        setUserResumes(userResumes);
      } catch (error) {
        console.error("Error fetching user resumes:", error);
      }
    };

    fetchUserResumes(); // Call the async function
    console.log("userResumes1:", userResumes);
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
      return <div>Loading...</div>;
    }

    switch (currentTab) {
      case "Job details":
        return (
          !loading.jobDetails && (
            <div className="flex flex-col sm:gap-4">
              <div className="border  px-4 flex flex-col gap-4 md:px-6 py-6">
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
              </div>
              <div className="border-t flex flex-col gap-4 sm:border px-4 sm:px-6 py-6 ">
                <div>
                  <p className="font-medium text-lg">Description</p>
                  <p className=" text-gray-400 mt-2">
                    {jobDetails.description}
                  </p>
                </div>
                {jobDetails.skills_required.length > 0 && (
                  <div>
                    <p className="mb-1 font-medium">Skills required</p>
                    <div className="flex gap-2 text-sm">
                      {jobDetails.skills_required?.map((skill, index) => (
                        <p
                          className="bg-gray-100 px-2 py-1 rounded-md"
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
            <div className="py-4 px-4 md:px-6 flex md:border flex-col gap-4">
              <div className=" ">
                <p className="font-medium">Company name</p>
                <p className="text-sm text-gray-400">
                  {jobDetails.user.company_details.company_name}
                </p>
              </div>
              <div className="">
                <p className="font-medium">Company location</p>
                <p className="text-sm text-gray-400">
                  {jobDetails.user.location.address}
                </p>
              </div>
              <div className=" ">
                <p className="font-medium">Description</p>
                <p className="text-sm text-gray-400">
                  {jobDetails.user.description || "Not available"}
                </p>
              </div>
              <div className=" ">
                <p className="font-medium">Industry</p>
                <p className="text-sm text-gray-400">
                  {jobDetails.user.company_details.industry || "Not available"}
                </p>
              </div>
            </div>
          )
        );
      case "About user":
        return (
          !loading.jobDetails && (
            <div className=" px-4 md:px-6 flex flex-col gap-4 md:border py-4">
              <div className="">
                <p className="font-medium">Posted by user</p>
                <p className="text-sm text-gray-400">
                  {jobDetails.user.personal_details.firstname +
                    " " +
                    jobDetails.user.personal_details.lastname}{" "}
                  (
                  <span className="text-blue-500">
                    {jobDetails.user.username}
                  </span>
                  )
                </p>
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
        return "Related jobs";

      default:
        return null;
    }
  };
  if (!loading.jobDetails && !jobDetails) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">
          Failed to Load
        </h2>
        <p className="text-gray-500">
          We couldn't load the job details. Please try again later.
        </p>
      </div>
    );
  }
  return (
    <div className=" w-full flex justify-center overflow-y-auto gap-8">
      <div
        ref={profileRef}
        className={`${
          !jobId && "hidden"
        } overflow-y-auto w-full flex-1  max-w-lg  flex-grow ${
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
                      console.log(resume);
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
                className="bg-blue-500 font-medium text-white px-4 py-2 rounded-md"
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
                  className="bg-blue-500 w-full font-medium text-white px-4 py-2 rounded-md"
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
          <div
            className={` w-full border-t  fixed sm:sticky  sm:border-x  z-20 top-0   px-4 py-4 bg-white flex `}
          >
            <div className="flex w-full items-center gap-4">
              {atTop >= 100 && (
                <UserImageInput
                  isEditable={false}
                  image={
                    jobDetails?.profileImage?.compressedImage ||
                    profileImageDefault
                  }
                  imageHeight="40"
                />
              )}
              <div className="flex flex-col justify-center w-full">
                <p className="text-xl flex justify-between  w-full font-semibold">
                  {atTop > 100 ? jobDetails?.job_role : "Job profile"}
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
                  {atTop > 100 && jobDetails?.company_name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-t sm:border-t-0 pt-8 pb-6 mt-10 sm:mt-0 flex-grow sm:border-x px-4 md:px-6 gap-3 bg-white justify-center flex-col">
            {loading.jobDetails ? (
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
                      if (jobDetails.compony_logo) {
                        setShowProfileImage(true);
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
                      jobDetails?.profileImage?.originalImage ||
                      jobDetails?.profileImage ||
                      profileImageDefault
                    }
                    imageHeight="70"
                  />
                  <div className="flex w-full ml-20  justify-between items-center">
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        {jobDetails?.job_role}
                      </h1>
                      <div className="flex  gap-2">
                        <p className="text-lg font-light sm:font-normal sm:text-xl text-gray-600">
                          {jobDetails?.company_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-3 flex flex-col gap-2">
                  <div className="text-sm flex justify-between flex-wrap  order-1 text-gray-400 items-end">
                    <p>
                      {/* <span>{jobDetails.location?.address} · </span> */}
                      {applicantsCount || 0} Applicant
                      {applicantsCount > 1 && "s"}
                      {/* <span className="  font-normal"> followers</span>{" "}
                    {jobDetails.account_type == "Candidate" && (
                      <span>
                        · {jobDetails.followings ? jobDetails.followings : 0}{" "}
                        <span className="  font-normal">following</span>
                      </span>
                    )} */}
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
              {(!jobApproach || jobApproach.length === 0) && (
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
                  } flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5 items-center justify-center text-white bg-blue-500 sm:hover:bg-blue-600 pb-1 rounded-full`}
                >
                  Apply
                </a>
              )}
              {saved ? (
                <button
                  onClick={() => unsaveJob()}
                  className="w-fit px-5 border-2 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-gray-500  bg-gray-100 sm:hover:bg-gray-200 pb-0.5  rounded-full"
                >
                  Unsave
                </button>
              ) : (
                <button
                  onClick={() => saveJob()}
                  className="w-fit px-5 flex cursor-pointer md:order-2 text-center order-last gap-2 font-medium mt-3.5  items-center justify-center text-blue-500 border-2 border-blue-500  sm:hover:bg-blue-50 pb-0.5  rounded-full"
                >
                  Save
                </button>
              )}
            </div>
            {applied && (
              <p className="text-sm text-red-500 mt-2">
                Application already sent
              </p>
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
                "Job details",
                jobDetails?.job_source == "job_post"
                  ? "About user"
                  : "About company",
                "Related jobs",
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
              left: `${(100 / 3) * tabIndex}%`,
              transition: "left 0.2s ease-in-out",
            }}
            className={`w-1/3 h-[2px] md:h-1 z-30 rounded-full bottom-0 left-0 bg-blue-500 absolute`}
          ></div>
        </div>

        <div>{renderTabContent()}</div>
      </div>
      <div className="hidden sticky top-20 w-full max-w-sm flex-col gap-5 md:flex">
        <div className="border rounded-lg p-4">
          <p className="text-xl font-semibold mb-5">Releated Accounts</p>
          <div className="flex gap-5 justify-between items-center">
            <div className="flex gap-2">
              <UserImageInput isEditable={false} />
              <div className="">
                <p className="text-lg font-medium">Yogesh Gosavi</p>
                <p className="text-gray-400">yogesh_gosavii</p>
              </div>
            </div>
            <p className="bg-blue-500 h-fit rounded-full text-white font-medium px-3 py-1">Follow</p>
          </div>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-xl font-semibold">Similar Jobs</p>
        </div>
      </div>
    </div>
  );
}

export default JobProfileView;
