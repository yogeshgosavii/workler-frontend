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
      document.title = "Job manager";
    
    
   }, []);
 
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
              </svg></div>
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
              </svg></div>
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
              </svg></div>
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
    <div className="flex gap-6 w-full justify-center">
      <div
        className={`flex px-4 md:px-6 mt-3 max-w-lg flex-col w-full ${
          selectedJob && "hidden md:block"
        }`}
      >
        <div className="mb-5">
          <p
            className={`${
              innerTab == "jobs" && "bg-gray-800 border-gray-800 w-fit rounded-md text-white"
            } px-3 border font-medium text-sm py-1`}
          >
            Jobs
          </p>
        </div>
        {
          applications<=0 && approaches<=0 && jobs.length<=0 &&  <p className="max-w-xl pt-20 sm:h-full text-center h-fit px-6 md:px-6">
          <p className="text-3xl font-bold text-gray-500">
            No jobs yet
          </p>
          <p className="mt-2 text-gray-400 ">
            When jobs posted the actions taken on the jobs, like applications and approaches will be shown here
          </p>
        </p>
        }
        <div className="w-full">{(loading.applicationList || loading.approachList)?<div class="grid min-h-[140px] w-full  h-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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
              </svg></div>: content}</div>
      </div>
     { selectedJob && <div className=" mt-5 w-full sm:w-fit ">
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
