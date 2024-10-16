import React, { useEffect, useState } from "react";
import Employment from "./Employment";
import useJobApi from "../services/jobService";
import { useSelector } from "react-redux";
import UserImageInput from "../components/Input/UserImageInput"; // Assuming this is the correct import for handling user images
import approachService from "../services/approachService";
import applicationService from "../services/applicationService";
import interviewService from "../services/interviewService";
import { useNavigate } from "react-router-dom";

function Manager() {
  const [jobs, setJobs] = useState([]);
  const [approaches, setApproaches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviewList, setInterviewList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [innerTab, setInnerTab] = useState("jobs");
  const navigate = useNavigate();

  const [loading, setLoading] = useState({
    approachList: false,
    applicationList: false,
    interviewList: false,
  });
 
  useEffect(() => {
    const handlePopState = () => {
      if (selectedJob) {
        console.log("Job unselected");
        setSelectedJob(null);  // Close the job detail view
      } else {
        // Navigate to the previous URL in history
        navigate(-1);  // Or use window.history.back() if preferred
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Only push state when a job is selected
    if (selectedJob) {
      window.history.pushState({ jobId: selectedJob?._id }, `/${selectedJob?._id}`);
    }

    console.log("Popstate event listener added");

    return () => {
      window.removeEventListener("popstate", handlePopState);
      console.log("Popstate event listener removed");
    };
  }, [navigate, selectedJob]);

  
  // Somewhere in your component, simulate a back navigation:
  // useEffect(() => {
  //   setTimeout(() => {
  //     window.history.back();
  //   }, 3000);  // Simulates pressing the back button after 3 seconds
  // }, []);
  
  
  const jobService = useJobApi(); // Assuming useJobApi is a custom hook to handle API calls
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await jobService.job.getByUserIds(currentUser._id);
        setJobs(jobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    const fetchApproaches = async () => {
      setLoading((prev) => ({ ...prev, approachList: true }));
      try {
        const approachedUsers = await approachService.getApproachDetails(
          currentUser._id
        ); // Adjusted to use jobService.approach
        setApproaches(approachedUsers);
      } catch (error) {
        console.error("Failed to fetch approaches:", error);
      } finally {
        setLoading((prev) => ({ ...prev, approachList: false }));
      }
    };

    const fetchApplications = async () => {
      setLoading((prev) => ({ ...prev, applicationList: true }));
      try {
        const applications = await applicationService.getEmployeerApplications(
          currentUser._id
        ); 
        setApplications(applications);
        console.log("aplica5ions", applications);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading((prev) => ({ ...prev, applicationList: false }));
      }
    };

    const fetchInterviews = async () => {
      setLoading((prev) => ({ ...prev, interviewList: true }));
      try {
        const interviews = await interviewService.getEmployeerInterviews(
          currentUser._id
        ); // Adjusted to use jobService.interview
        setInterviewList(interviews);
      } catch (error) {
        console.error("Failed to fetch interviews:", error);
      } finally {
        setLoading((prev) => ({ ...prev, interviewList: false }));
      }
    };

    fetchJobs();
    fetchApplications();
    fetchApproaches();
    fetchInterviews();
  }, []);

  let content;

  switch (innerTab) {
    case "jobs":
      content = (
        <div className="flex flex-col ">
          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => {
                setSelectedJob(job);
              }}
              className="text-sm bg-gray-50 border p-3 px-4 rounded-lg"
            >
              <p className="font-medium text-lg">{job.job_role}</p>
              <p className="text-gray-500">{job.location?.address}</p>
              {applications
                    .filter((application) => application.job._id == job._id).length >0  && <div className="bg-white mt-2 flex justify-between p-2 rounded-md border">
                <div>
                  <p>Applications</p>
                  <p className="text-sm text-gray-400">
                    List of candidates applied
                  </p>
                </div>
                <div className="flex -space-x-4 rtl:space-x-reverse">
                  {applications
                    .filter((application) => application.job._id == job._id)
                    .slice(0, 3)
                    .map((application, index) => (
                      <img
                        key={index}
                        className="w-10 h-10 border  rounded-full "
                        src={application.user.profileImage?.compressedImage}
                        alt=""
                      />
                    ))}
                    
                 {applications
                    .filter((application) => application.job._id == job._id) >3 && <a
                    className="flex items-center justify-center w-10 h-10 text-xs font-medium border  text-gray-500 bg-gray-100   rounded-full "
                    href="#"
                  >
                    +{applications-3}
                  </a>}
                </div>
              </div>}
              {approaches
                    .filter((approach) => approach.job._id == job._id).length >0  && <div className="bg-white mt-2 flex justify-between p-2 px-3 rounded-lg border">
                <div>
                  <p className="font-medium">Approaches</p>
                  <p className="text-sm text-gray-400">
                    List of candidates applied
                  </p>
                </div>
                <div className="flex -space-x-4 rtl:space-x-reverse">
                  {approaches
                    .filter((approach) => approach.job._id == job._id)
                    .slice(0, 3)
                    .map((approach, index) => (
                      <img
                        key={index}
                        className="w-10 h-10 border  rounded-full "
                        src={approach.user.profileImage?.compressedImage}
                        alt=""
                      />
                    ))}
                    
                 {approaches
                    .filter((approach) => approach.job._id == job._id) >3 && <a
                    className="flex items-center justify-center w-10 h-10 text-xs font-medium border  text-gray-500 bg-gray-100   rounded-full "
                    href="#"
                  >
                    +{approaches-3}
                  </a>}
                </div>
              </div>}
            </div>
          ))}
        </div>
      );
      break;
    case "applications":
      content = loading.applicationList ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((application) => (
            <div
              key={application._id}
              className="border rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex gap-4 mb-2">
                <UserImageInput
                  isEditable={false}
                  image={application.job.companyLogo}
                />
                <div className="flex flex-col justify-center">
                  <p className="font-medium">{application.job.job_role}</p>
                  <p className="text-sm">{application.job.company_name}</p>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                {application.job.location && (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                    <p>{application.job.location.address}</p>
                  </>
                )}
              </div>
              <div className="flex gap-2 items-center justify-between">
                <div className="text-xs flex gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                  <p>{application.job.employmentType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
      break;
    case "approaches":
      content = loading.approachList ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {approaches.map((approach) => (
            <div
              key={approach._id}
              className="border rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex gap-4 mb-2">
                <UserImageInput
                  isEditable={false}
                  image={approach.user.profileImage}
                />
                <div className="flex flex-col justify-center">
                  <p className="font-medium">{approach.user.name}</p>
                  <p className="text-sm">{approach.user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
      break;
    case "interviews":
      content = loading.interviewList ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {interviewList.map((interview) => (
            <div
              key={interview._id}
              className="border rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex gap-4 mb-2">
                <UserImageInput
                  isEditable={false}
                  image={interview.user.profileImage}
                />
                <div className="flex flex-col justify-center">
                  <p className="font-medium">{interview.user.name}</p>
                  <p className="text-sm">{interview.job.job_role}</p>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <p>{interview.date}</p>
                <p>{interview.status}</p>
              </div>
            </div>
          ))}
        </div>
      );
      break;
    default:
      content = null;
      break;
  }

  // if(loading.applicationList || loading.approachList)
  // {
  //   return("Loading...")
  // }

  return (
    <div className="flex gap-6 w-full">
      <div
        className={`flex px-4 md:px-6 mt-3 flex-col w-full ${
          selectedJob && "hidden md:block"
        }`}
      >
        <div className="mb-5">
          <p
            className={`${
              innerTab == "jobs" && "bg-blue-50 border-blue-500 w-fit rounded-md text-blue-500"
            } px-3 border font-medium text-sm py-1`}
          >
            Jobs
          </p>
        </div>
        <div className="w-full">{(loading.applicationList || loading.approachList)?"Loading...": content}</div>
      </div>
     { selectedJob && <div className="w-full mt-5 ">
        <Employment
          job={selectedJob}
          applications={applications.filter(
            (application) => application.job._id == selectedJob?._id
          )}
          approaches={approaches?.filter(
            (application) => application.job._id == selectedJob?._id
          )}
          setInnerTab={setInnerTab}
        />
      </div>}
    </div>
  );
}

export default Manager;
