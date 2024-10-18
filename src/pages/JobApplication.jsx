import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import approachService from "../services/approachService";
import UserImageInput from "../components/Input/UserImageInput";
import UserProfileView from "../components/UserProfileView";
import useProfileApi from "../services/profileService";
import authService from "../services/authService";
import applicationService from "../services/applicationService";
import JobProfileView from "../components/JobProfileView";
import { formatDistanceToNow } from "date-fns";
import companyDefaultImage from '../assets/companyDefaultImage.png';

import interviewService from "../services/interviewService";
import { useNavigate } from "react-router-dom";
import JobListItem from "../components/jobComponent/JobListItem";

function JobApplication() {
  const currentUser = useSelector((state) => state.auth.user);
  const [approaches, setApproaches] = useState([]);
  const [innerTab, setInnerTab] = useState("applications");
  const [loading, setLoading] = useState({
    approachList: true,
    userDetails: false,
    qualification: false,
  });
  const navigate = useNavigate()
  const [selectedProfile, setSelectedProfile] = useState("");
  const [applications, setApplications] = useState([]);
  const [applicantsCount, setApplicantsCount] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [qualification, setQualification] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [interviewList, setInterviewList] = useState([]);
  const handleBackNavigation = () => {
    if (selectedJob) {
      // Clear the selected job and prevent the back navigation
      setSelectedJob(null);
      window.history.pushState(null, null, window.location.pathname);
    } else {
      // If no job is selected, allow the default behavior
      window.history.back();
    }
  };

  const updateApproach = async ({ id, status }) => {
    const updatedApproach = await approachService.updateStatus({ id, status });
    setApproaches((prev) => [...prev, { updatedApproach }]);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      handleBackNavigation();
    };

    // Add event listener for popstate
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedJob]);

  const handleJobSelect = (userId) => {
    setSelectedJob(userId);
    window.history.pushState(
      { jobSelected: true },
      "",
      `${window.location.pathname}?job=${userId._id}`
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, userDetails: true }));
      try {
        const response = await authService.fetchUserDetailsById(
          selectedProfile
        );
        setUserDetails(response);
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
          await profileService.qualification.getQualificationById(
            selectedProfile
          );
        console.log(qualificationData);

        setQualification(qualificationData);
      } catch (error) {
        console.error("Failed to fetch qualification data", error);
      } finally {
        setLoading((prev) => ({ ...prev, qualification: false }));
      }
    };

    if (selectedProfile) {
      fetchData();
      fetchQualificationData();
    }
  }, [selectedProfile]);
  // const fetchApplicantsCount = async () => {
  //   setLoading((prev) => ({ ...prev, applicantsCount: true }));
  //   try {
  //     const applicants =
  //       await applicationService.getApplicantsCount(applications);
  //     console.log("applicants:", applicants);
  //     setApplicantsCount(applicants);
  //   } catch (error) {
  //     console.error("Failed to fetch applicants data", error);
  //   } finally {
  //     setLoading((prev) => ({ ...prev, applicantsCount: false }));
  //   }
  // };
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading((prev) => ({ ...prev, applicationList: true }));
      try {
        const applications = await applicationService.getUserApplications(
          currentUser._id
        );
        setApplications(applications);
      } catch (error) {
        console.error("Failed to fetch application:", error);
      } finally {
        setLoading((prev) => ({ ...prev, applicationList: false }));
      }
    };

    const fetchApproaches = async () => {
      setLoading((prev) => ({ ...prev, approachList: true }));
      try {
        const approaches = await approachService.getUserApproaches(
          currentUser._id
        );
        setApproaches(approaches);
      } catch (error) {
        console.error("Failed to fetch application:", error);
      } finally {
        setLoading((prev) => ({ ...prev, approachList: false }));
      }
    };
    const fetchInterviews = async () => {
      setLoading((prev) => ({ ...prev, interviewList: true }));
      try {
        const interviews = await interviewService.getUserInterviews(
          currentUser._id
        );
        setInterviewList(interviews);
        console.log("interviews", interviews);
      } catch (error) {
        console.error("Failed to fetch approaches:", error);
      } finally {
        setLoading((prev) => ({ ...prev, interviewList: false }));
      }
    };

    // fetchApproaches();
    // fetchApplications();
    fetchInterviews();

    fetchApplications();
    fetchApproaches();
  }, []);

  const renderSkeleton = () => (
    <div class="grid min-h-[140px]  border-x h-full w-full justify-center pt-16 overflow-x-scroll   lg:overflow-visible">
    <svg
      class="text-white animate-spin"
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

  let content;

  switch (innerTab) {
    case "approach":
      content = (
        <div>
          {loading.approachList ? (
            renderSkeleton()
          ) : approaches.length > 0 ? (
            <div className="flex flex-col gap-4">
              {approaches.map((approach) => (
                <div
                  key={approach._id}
                  onClick={() => {navigate("/job/"+approach.job._id)}}
                  className="border-y p-6  cursor-pointer flex flex-col gap-4"
                >
                  <JobListItem 
                  job={approach.job}
                  companyDefaultImage={companyDefaultImage}
                  className="rounded-2xl shadow-lg border"
                  />
                  {/* <div className="flex gap-4">
                    <UserImageInput
                      isEditable={false}
                      image={approach.job.companyLogo}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="font-medium">{approach.job.job_role}</p>
                      <p className="text-sm text-gray-400">{approach.job.company_name}</p>
                    </div>
                  </div> */}
                  {/* {approach.job?.experience_type == "Experienced" && (
                    <div className="flex gap-2 text-sm items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5" />
                      </svg>
                      {approach.job.experience_type == "Experienced" ? (
                        <p>
                          {" "}
                          {approach.job.min_experience}{" "}
                          {approach.job.max_experience !=
                            approach.job.min_experience &&
                            "-" + approach.job.max_experience}{" "}
                          years
                        </p>
                      ) : (
                        <p>Not mentioned</p>
                      )}
                    </div>
                  )} */}
                  {/* {(approach.job.min_salary || approach.job.max_salary) && (
                    <div className="flex gap-2 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                      </svg>
                      {approach.job.min_salary || approach.job.max_salary ? (
                        <p>
                          {" "}
                          {approach.job.min_salary}{" "}
                          {approach.job.max_salary != approach.job.min_salary &&
                            "- " + approach.job.max_salary}{" "}
                          {approach.job.max_salary?.length <= 5
                            ? "per year"
                            : "per year"}
                        </p>
                      ) : (
                        <p className="-mt-0.5">Not mentioned</p>
                      )}
                    </div>
                  )}
                  {approach.job.location && (
                    <div className="flex gap-2  text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg>
                      <p className="-mt-1">
                        {" "}
                        {approach.job.location?.address}{" "}
                      </p>
                    </div>
                  )} */}
                  {/* <p className="mt-3 mb-2 text-purple-500 w-fit text-sm rounded-md">
                    Approached for{" "}
                    <span className="font-medium">{approach.job.job_role}</span>
                  </p> */}
                  {approach.status === "approached" ? (
                    <div className="bg-blue-50 text-blue-500 shadow-md font-medium text-sm flex gap-2 flex-wrap justify-between items-center p-4 rounded-lg">
                      <p className="">Select response </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            updateApproach({
                              id: approach._id,
                              status: "accepted",
                            });
                          }}
                          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded-full "
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            updateApproach({
                              id: approach._id,
                              status: "declined",
                            });
                          }}
                          className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-full "
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ) : approach.status === "accepted" ? (
                    <div className="  bg-yellow-50 border text-yellow-600 border-yellow-500 text-sm gap-2 mt-2 flex flex-wrap justify-between items-center p-3 px-4 w-full rounded-lg ">
                      <p><span className="font-medium">Approach accepted</span> ,you will be notified about the next step</p>
                    
                    </div>
                  ) : approach.status === "interview_setup" ? (
                    <p>
                      {interviewList?.map((interview) => {
                        if (interview.job._id == approach.job._id) {
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
                      {approach.createdAt && (
                        <p className="mt-2 text-sm text-gray-400">
                          Approached ${approach.createdAt}
                        </p>
                      )}
                    </p>
                  ) : (
                    <p className="text-red-500 text-sm">Approach declined</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center mt-10 text-gray-500">No approaches yet</p>
          )}
        </div>
      );
      break;
    case "applications":
      content = (
        <div>
          {loading.applicationList ? (
            renderSkeleton()
          ) : applications.length > 0 ? (
            <div className="flex flex-col gap-4">
              {applications.map((application) => (
                <div
                  key={applications._id}
                  onClick={() => handleJobSelect(application.job)}
                  className="border rounded-lg cursor-pointer p-3 flex flex-col gap-2 "
                >
                  <div>
                    <div className="flex gap-4 mb-2">
                      <UserImageInput
                        isEditable={false}
                        image={application.job.companyLogo}
                      />
                      <div className="flex flex-col justify-center">
                        <p className="font-medium">
                          {application.job.job_role}
                        </p>
                        <p className="text-sm">
                          {application.job.company_name}
                        </p>
                        <p className="text-sm text-gray-400 truncate w-full text-wrap">
                          {/* {application.job.location.address} */}
                        </p>
                      </div>
                    </div>
                    <p>{}</p>
                  </div>
                  {application.job.location && (
                    <div className="flex gap-2  text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg>
                      <p className="-mt-1">
                        {" "}
                        {application.job.location?.address}{" "}
                      </p>
                    </div>
                  )}

                  {/* {application.job.location && (
                    <div className="flex gap-2  text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg>
                      <p className="-mt-1">
                        {" "}
                        {application.job.location?.address}{" "}
                      </p>
                    </div>
                  )}
                  {application.job.experience_type == "Experienced" && (
                    <div className="flex gap-2 text-sm items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5" />
                      </svg>
                      {application.job.experience_type == "Experienced" ? (
                        <p>
                          {" "}
                          {application.job.min_experience}{" "}
                          {application.job.max_experience !=
                            application.job.min_experience &&
                            "-" + application.job.max_experience}{" "}
                          years
                        </p>
                      ) : (
                        <p>Not mentioned</p>
                      )}
                    </div>
                  )}
                  {(application.job.min_salary ||
                    application.job.max_salary) && (
                    <div className="flex gap-2 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                      </svg>
                      {application.job.min_salary ||
                      application.job.max_salary ? (
                        <p>
                          {" "}
                          {application.job.min_salary}{" "}
                          {application.job.max_salary !=
                            application.job.min_salary &&
                            "- " + application.job.max_salary}{" "}
                          {application.job.max_salary?.length <= 5
                            ? "per year"
                            : "per year"}
                        </p>
                      ) : (
                        <p className="-mt-0.5">Not mentioned</p>
                      )}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">Description</p>
                    <p className="text-gray-400 text-sm truncate line-clamp-2 text-wrap">
                      {application.job.description}
                    </p>
                  </div> */}

                  <div className="flex gap-2 flex-wrap items-center justify-between">
                    <div className="flex items-center text-sm gap-4 rounded-md">
                      {application.status === "sent" ? (
                        <p className="text-green-600 bg-gray-50 px-4 py-1 rounded-md font-medium ">
                          Application sent
                        </p>
                      ) 
                      // : application.status === "accepted" ? (
                      //   <div className="flex items-center bg-green-50 gap-3 p-2 rounded-md">
                      //     <p className="text-green-600 font-semibold">
                      //       Application accepted
                      //     </p>
                      //     <button className="bg-green-500 hover:bg-green-600 transition-colors font-medium text-white px-3 py-1 rounded-full">
                      //       Schedule interview
                      //     </button>
                      //   </div>
                      // )
                       : application.status === "interview_setup" ? (
                        <p>
                        {interviewList?.map((interview) => {
                          if (interview.job._id == application.job._id) {
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
                        {/* {application.createdAt && (
                          <p className="mt-2 text-sm text-gray-400">
                            Applied ${application.createdAt}
                          </p>
                        )} */}
                      </p>
                      ) : (
                        <p className="text-red-500 font-medium">
                          Application declined
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 text-gray-400 text-sm">
                      Applied{" "}
                      {formatDistanceToNow(application.createdAt.split("T")[0])}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center mt-10 text-gray-500">Haven't applied to any job</p>
          )}
        </div>
      );
      break;
    default:
      content = <p>Invalid tab selected</p>;
      break;
  }

  return (
    <div className="w-full flex justify-center gap-4  ">
      <div className={`w-full max-w-xl py-3 sm:w-full border-x ${selectedJob && "hidden sm:block"}`}>
        <div className="flex gap-4 mb-3  px-4 py-1">
          <p
            onClick={() => setInnerTab("applications")}
            className={`px-3 py-1 cursor-pointer rounded-md font-medium border ${
              innerTab === "applications" && "bg-blue-50 border-blue-500 text-blue-500"
            }`}
          >
            Applications
          </p>
          <p
            onClick={() => setInnerTab("approach")}
            className={`px-3 py-1 cursor-pointer rounded-md font-medium border ${
              innerTab === "approach" && "bg-blue-50 border-blue-500 text-blue-500"
            }`}
          >
            Approaches
          </p>
        </div>
        {content}
      </div>
      <div
        className={`${
          !selectedJob && "hidden"
        }  h-full overflow-auto w-full sm:w-2/3`}
      >
        {selectedJob && (
          <div className="border-b pb-5 md:border md:p-4">
            <div className="flex justify-between items-center">
              <p className="text-xl font-medium">Job details</p>
              <svg
                onClick={() => {
                  handleBackButton();
                }}
                className="h-6 w-6 text-gray-800 pointer-events-auto transition-all duration-500 ease-in-out transform"
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
            </div>
            {loading.applicationList
              ? renderSkeleton()
              : selectedJob && (
                  <div className="mt-4 flex gap-2">
                    <UserImageInput
                      image={selectedJob?.companyLogo}
                      isEditable={false}
                    />
                    <div>
                      <p className="font-medium">{selectedJob?.job_role}</p>
                      <p className="text-sm">{selectedJob?.company_name}</p>
                    </div>
                  </div>
                )}
            {/* <p className="px-2 py-0.5 rounded-md text-sm mt-2 w-fit bg-purple-50 text-purple-500">
            Approached for{" "}
            <span className="font-medium">
              {approaches.map(
                (approach) =>
                  approach.user._id == selectedProfile && approach.job.job_role
              )}
            </span>
          </p> */}
            {/* {loading.userDetails
            ? renderSkeleton()
            : selectedJob && (
                <div className="mt-3 text-sm">
                  <p className="font-medium mb-1">Personal details</p>
                  {userDetails?.personal_details.working_at && (
                    <p>Works at {userDetails?.personal_details.working_at}</p>
                  )}
                  {userDetails?.location.address && (
                    <p>Lives near {userDetails?.location.address}</p>
                  )}
                </div>
              )} */}
            <div className="flex flex-col gap-2 mt-5">
              {selectedJob?.location && (
                <div className="flex gap-2  text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="h-4 w-4"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>
                  <p className="-mt-1"> {selectedJob.location?.address} </p>
                </div>
              )}
              {selectedJob?.experience_type == "Experienced" && (
                <div className="flex gap-2 text-sm items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="h-4 w-4"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5" />
                  </svg>
                  {selectedJob.experience_type == "Experienced" ? (
                    <p>
                      {" "}
                      {selectedJob.min_experience}{" "}
                      {selectedJob.max_experience !=
                        selectedJob.min_experience &&
                        "-" + selectedJob.max_experience}{" "}
                      years
                    </p>
                  ) : (
                    <p>Not mentioned</p>
                  )}
                </div>
              )}
              {(selectedJob.min_salary || selectedJob.max_salary) && (
                <div className="flex gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="h-4 w-4"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                  </svg>
                  {selectedJob.min_salary || selectedJob.max_salary ? (
                    <p>
                      {" "}
                      {selectedJob.min_salary}{" "}
                      {selectedJob.max_salary != selectedJob.min_salary &&
                        "- " + selectedJob.max_salary}{" "}
                      {selectedJob.max_salary?.length <= 5
                        ? "per year"
                        : "per year"}
                    </p>
                  ) : (
                    <p className="-mt-0.5">Not mentioned</p>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <p className="font-medium">Description</p>
                <p className="text-gray-400 text-sm truncate line-clamp-2 text-wrap">
                  {selectedJob.description}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4">
          <p className="font-medium"> Similar Jobs</p>
        </div>
      </div>
    </div>
  );
}

export default JobApplication;
