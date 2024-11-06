import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import approachService from "../services/approachService";
import UserImageInput from "../components/Input/UserImageInput";
import UserProfileView from "../components/UserProfileView";
import useProfileApi from "../services/profileService";
import authService from "../services/authService";
import UrlInput from "../components/Input/UrlInput";
import OptionInput from "../components/Input/OptionInput";
import TextInput from "../components/Input/TextInput";
import DateInput from "../components/Input/DateInput";
import TextAreaInput from "../components/Input/TextAreaInput";
import NumberInput from "../components/Input/NumberInput";
import interviewService from "../services/interviewService";
import applicationService from "../services/applicationService";
import { formatDistanceToNow } from "date-fns";

function Employment({ job, applications, approaches }) {
  const currentUser = useSelector((state) => state.auth.user);
  const [innerTab, setInnerTab] = useState("approach");
  const [loading, setLoading] = useState({
    approachList: false,
    userDetails: false,
    qualification: false,
  });
  const [selectedProfile, setSelectedProfile] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [qualification, setQualification] = useState(null);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewList, setInterviewList] = useState();
  const [interviewCreateLoading, setInterviewCreateLoading] = useState(false);

  
  const profileService = useProfileApi();
  // const [applications, setApplications] = useState([]);
  const [interviewForm, setInterviewForm] = useState({
    interview_date: "",
    interview_time: "",
    interview_mode: "",
    interview_link: "",
    interview_address: "",
    interview_location_link: "",
  });

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

  const setupInterview = async (e) => {
    e.preventDefault();
    console.log(interviewForm, showInterviewForm);
    setInterviewCreateLoading(true)
    const interview = await interviewService.createInterview({
      ...interviewForm,
      user: showInterviewForm.user._id,
      job: showInterviewForm.job._id,
      employeer: currentUser._id,
    });

    if (innerTab == "approach") {
      const approach = await approachService.updateStatus({
        id: showInterviewForm._id,
        status: "interview_setup",
      });
    } else {
      const application = await applicationService.updateStatus({
        id: showInterviewForm._id,
        status: "interview_setup",
      });
    }
    setShowInterviewForm(null);
    setInterviewCreateLoading(false)
    setInterviewList(prev => [...prev,interview])
    console.log(interview);
  };

  const updateStatus = async (status) => {
    const application = await applicationService.updateStatus(status);
  };

  useEffect(() => {
    // const fetchApproaches = async () => {
    //   setLoading((prev) => ({ ...prev, approachList: true }));
    //   try {
    //     const approachedUsers = await approachService.getApproachDetails(
    //       currentUser._id
    //     );
    //     setApproaches(approachedUsers);
    //   } catch (error) {
    //     console.error("Failed to fetch approaches:", error);
    //   } finally {
    //     setLoading((prev) => ({ ...prev, approachList: false }));
    //   }
    // };

    // const fetchApplications =  async ()=>{
    //   setLoading((prev) => ({ ...prev, applicationList: true }));
    //   try {
    //     const applications = await applicationService.getEmployeerApplications(
    //       currentUser._id
    //     );
    //     setApplications(applications);
    //   } catch (error) {
    //     console.error("Failed to fetch approaches:", error);
    //   } finally {
    //     setLoading((prev) => ({ ...prev, applicationList: false }));
    //   }
    // };

    const fetchInterviews = async () => {
      setLoading((prev) => ({ ...prev, interviewList: true }));
      try {
        const interviews = await interviewService.getEmployeerInterviews(
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
  }, [currentUser._id]);

  useEffect(() => {
    const handleBackButton = (event) => {
      if (selectedProfile) {
        event.preventDefault();
        setSelectedProfile(null);
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [selectedProfile]);

  const handleProfileSelect = (userId) => {
    setSelectedProfile(userId);
    window.history.pushState(null, null);
  };

  const renderSkeleton = () => (
    <div class="grid min-h-[140px] w-full  h-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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

  let content;

  switch (innerTab) {
    case "approach":
      content = (
        <div>
          {loading.approachList ? (
            renderSkeleton()
          ) : approaches.length > 0 ? (
            <div className="flex flex-col  gap-4">
              {approaches.map((approach) => (
                <div
                  key={approach._id}
                  onClick={() => handleProfileSelect(approach.user._id)}
                  className="border-b sm:border p-3 py-5 "
                >
                  <div className="flex gap-4 mb-3">
                    <UserImageInput
                      isEditable={false}
                      image={approach.user.profileImage?.compressedImage}
                    />
                    <div className="flex flex-col justify-center">
                      <p className=" font-medium text-lg">
                        {approach.user.personal_details.firstname}{" "}
                        {approach.user.personal_details.lastname}
                      </p>
                      <p className="text-sm -mt-1 text-gray-400">
                        {approach.user.username}
                      </p>

                      {/* <p className="text-sm text-gray-400 truncate w-full text-wrap">
                        {approach.user.location.address}
                      </p> */}
                    </div>
                  </div>
                  {/* <p className="mt-3 mb-2 text-purple-500 w-fit text-sm rounded-md">
                    Approached for{" "}
                    <span className="font-medium">{approach.job.job_role}</span>
                  </p> */}
                  {approach.status === "approached" ? (
                    <p className="text-yellow-600 text-sm">
                      Haven't replied yet
                    </p>
                  ) : approach.status === "accepted" ? (
                    <div className="bg-gray-50 border gap-2 flex  justify-between items-center text-sm  rounded-lg text-gray-500">
                      <p className=" px-4 font-medium truncate">
                        Approach accepted
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Hello");
                          setShowInterviewForm(approach);
                        }}
                        className="bg-gray-500 border border-gray-500 h-full font-medium  truncate text-white px-3 py-2.5  rounded-e-lg"
                      >
                        Set up interview
                      </button>
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
                                  className="relative w-12"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-link-45deg h-full p-1 bg-white rounded-md  w-full"
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
            <p className="text-center">Haven't approached anyone yet</p>
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
            <div className="flex flex-col w-full gap-4">
              {applications.map((application) => (
                <div
                  key={applications._id}
                  onClick={() => handleProfileSelect(application.user)}
                  className="border  p-3 flex flex-col gap-2 "
                >
                  <div>
                    <div className="flex gap-4 mb-2">
                      <UserImageInput
                        isEditable={false}
                        image={application.user.profileImage.compressedImage}
                      />
                      <div className="flex flex-col justify-center">
                        <p className="font-medium">
                          {application.user.username}
                        </p>
                        <p className="text-sm">
                          {application.user.personal_details.firstname}{" "}
                          {application.user.personal_details.lastname}
                        </p>
                        <p className="text-sm text-gray-400 truncate w-full text-wrap">
                          {application.user.location.address}
                        </p>
                      </div>
                    </div>
                    <p>{}</p>
                  </div>
                  <div className=" font-medium mb-2 border p-3 rounded-md flex ">
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
                    <p className="">{application.resume.fileName}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap w-full  items-center justify-between">
                    <div className="flex items-center text-sm w-full gap-4 rounded-md">
                      {interviewList?.some(
                        (interview) =>
                          interview.job._id == application.job._id &&
                          interview.user._id == application.user._id
                      ) &&
                      approaches.some(
                        (approach) =>
                          approach.job._id == application.job._id &&
                          approach.user._id == application.user._id
                      ) ? (
                        <p className="">
                          Interview already setup for{" "}
                          <span className="font-medium">
                            {application.job.job_role}
                          </span>
                        </p>
                      ) : application.status === "sent" ? (
                        <div className="flex items-center w-full justify-between   gap-3 rounded-md">
                          {/* <p className=" font-semibold">
                            
                          </p> */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Hello");
                              setShowInterviewForm(application);
                            }}
                            className="bg-blue-500 shadow-md w-full hover:bg-blue-600 transition-colors font-medium text-white px-3 py-1.5 rounded-full"
                          >
                            Schedule interview
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Hello");
                              updateStatus({
                                id: application._id,
                                status: "rejected",
                              });
                            }}
                            className="bg-red-500 shadow-md hover:bg-red-600 w-full transition-colors font-medium text-white px-3 py-1.5 rounded-full"
                          >
                            Reject
                          </button>
                        </div>
                      ) : application.status === "accepted" ? (
                        <div className="flex items-center bg-green-50 gap-3 p-2 rounded-md">
                          <p className="text-green-600 font-semibold">
                            Application accepted
                          </p>
                          <button className="bg-green-500 hover:bg-green-600 transition-colors font-medium text-white px-3 py-1 rounded-full">
                            Schedule interview
                          </button>
                        </div>
                      ) : application.status === "interview_setup" ? (
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
                          Application rejected
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 text-gray-400 text-xs">
                      Applied{" "}
                      {formatDistanceToNow(application.createdAt.split("T")[0])}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center pt-5">No candidates yet</p>
          )}
        </div>
      );
      break;
    default:
      content = <p>Invalid tab selected</p>;
      break;
  }

  return (
    <div className="w-full flex gap-4  sm:max-w-lg">
      {/* {showInterviewForm && ( */}
      <div className=" fixed h-fit sm:left-[69px] left-0   z-50 -mt-5">
        {showInterviewForm && (
          <div
            onClick={() => setShowInterviewForm(null)}
            className=" w-screen h-screen bg-black opacity-50"
          ></div>
        )}
        <div
          className={`fixed inset-x-0 z-50 p-4 md:p-6 max-w-sm transition-transform transform ${
            showInterviewForm ? "translate-y-0" : "translate-y-full"
          } bottom-0 md:top-1/2 md:left-1/2 h-fit md:-translate-x-1/2 md:-translate-y-1/2 ${
            !showInterviewForm && "md:hidden"
          } bg-white border rounded-t-xl md:rounded-lg shadow-lg`}
        >
          <h3 className="text-lg font-medium mb-10 mt-2">Set Up Interview</h3>
          <form onSubmit={setupInterview} className="flex flex-col gap-6">
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
              initialValue="Select interview mode"
              options={["In-person", "Online", "Phone call"]}
              placeholder={"Mode of Interview"}
            />
            {/* {interviewForm.interview_mode == "Phone-call" && (
              <NumberInput
                value={interviewForm.phone}
                name={"Caller number"}
                placeholder={"Meet link"}
              />
            )} */}
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
                placeholder={"Enter your meet link"}
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
              disabled = {interviewCreateLoading}
                type="submit"
                className="bg-gray-800 disabled:bg-gray-600 w-full font-medium text-white px-4 py-3 rounded-md"
              >
                {interviewCreateLoading ? (
                  <div className='flex items-center justify-center gap-5'> 
        
                    <svg className="inline w-6 h-6 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                  </div>
                ) : (
                  "Create Interview"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* )} */}
      <div className=" w-full sm:pr-5">
        <div className="flex flex-col mb-5 fixed left-0 z-40  md:-mt-0  -mt-6 w-full sm:static p-4 border sm:rounded-xl bg-gray-50">
          <p className="font-medium">{job?.job_role}</p>
          <p className="text-xs truncate text-wrap max-w-full">
            {job?.location.address}
          </p>
          <div className={`w-full text-sm mt-4 `}>
            <div className="flex gap-4 ">
              <p
                onClick={() => setInnerTab("approach")}
                className={`px-3 cursor-pointer py-1.5 rounded-md border bg-gray-50   ${
                  innerTab === "approach" ? "shadow-inner bg-white font-medium  border-gray-200 ":"border-gray-50"
                }`}
              >
                Approaches
              </p>
              <p
                onClick={() => setInnerTab("applications")}
                className={`px-3 cursor-pointer py-1.5  rounded-md border  ${
                  innerTab === "applications" ? "shadow-inner font-medium bg-white   border-gray-200 ":"border-gray-50"
                }`}
              >
                Applications
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24  w-full sm:mt-0">{content}</div>
      </div>
    </div>
  );
}

export default Employment;
