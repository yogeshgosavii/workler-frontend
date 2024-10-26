import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import remotiveLogo from "../../assets/wordmark_H_orange.svg";
import savedService from "../../services/savedService";
import { useSelector } from "react-redux";

const JobListItem = React.memo(({ job, companyDefaultImage, className }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const checkSaved = async () => {
      // setLoading((prev) => ({ ...prev, checkSaved: true }));
      try {
        const saveData = await savedService.checkSaved({
          userId: currentUser?._id,
          saved_content: job?._id,
        });
        console.log("saved:", saveData);
        setSaved(saveData.exists);
      } catch (error) {
        console.error("Failed to fetch saved data", error);
      } finally {
        // setLoading((prev) => ({ ...prev, checkSaved: false }));
      }
    };

    if (job.user) {
      checkSaved();
    }
  }, []);

  const saveJob = async () => {
    setSaved(true);
    const response = await savedService.save({
      user: currentUser._id,
      contentType: "job",
      saved_content: job._id,
    });
    console.log("saved data:", response);
  };

  const unsaveJob = async () => {
    setSaved(false);
    const response = await savedService.unsave(job._id);
    console.log("unsaved data:", response);
  };

  return (
    <div
      onClick={() => {
        console.log("Navigating with job:", job);
        navigate(`/job/${job._id}`, { state: { jobDetails: job } });
      }}
      className={` sm:rounded-2xl  py-6  transition-all cursor-pointer ${className}`}
    >
      <div className="flex gap-4 px-6">
        {/* Company Logo */}
        <img
          className="w-14 h-14 object-contain border bg-gray-50 p-2 rounded-lg"
          src={
            job.company_logo ||
            (job.user.company_details &&
              job.user?.profileImage.compressedImage) ||
            companyDefaultImage
          }
          alt={`${job.company_name} logo`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = companyDefaultImage;
          }}
        />

        {/* Job Details */}
        <div className="flex-1 flex flex-col ">
          <div className="flex justify-between items-center">
            <h2 className="text-[23px] font-semibold leading-[27px] -mt-1 text-black">
              {job.job_role}
            </h2>
          </div>

          <p className="text-gray-400 font-medium mt-1">{job.company_name}</p>

          {/* Job Meta Information */}
          {/* <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <p>{job?.location?.address || "Location not specified"}</p>
            <p>{job.goc || "Experience not specified"}</p>
            <p>{job.payPeriodAdjustedPay ? `$${job.payPeriodAdjustedPay}` : "Salary not disclosed"}</p>
          </div> */}

          {/* Job Source */}
          {/* {job.job_source && (
            <div className="flex items-center gap-2 mt-3">
              {job.job_source === "Remotive" && (
                <img className="h-6" src={remotiveLogo} alt="Remotive Logo" />
              )}
              <p>{job.job_source !== "Remotive" && job.job_source}</p>
            </div>
          )} */}
        </div>
      </div>

      {/* Job Description */}
      {job.description && (
        <p
          className="mt-4 px-6 text-gray-400 leading-tight line-clamp-3"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
      )}
      {/* <div className="border-t w-full mt-5"></div> */}

      <div className="flex flex-wrap px-6 text-gray-700 font-medium  gap-3 flex-row text-nowrap mt-5">
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
        <div className="flex gap-2  border rounded-lg bg-gray-50  px-3 py-1.5  items-center">
          <svg
            className="h-6 w-6 text-gray-400"
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
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
            <line x1="12" y1="12" x2="12" y2="12.01" />
            <path d="M3 13a20 20 0 0 0 18 0" />
          </svg>
          <p className="text-nowrap">
            {job.min_experience || job.max_experience
              ? `${job.min_experience} - ${job.max_experience}`
              : "Experience not specified"}
          </p>
        </div>
        {/* {job.location && (
              <div className="min-h-full border-l mx-1 w-px"></div>
            )} */}
        {job.location && (
          <div className="flex gap-2 px-3 py-1.5 border rounded-lg bg-gray-50 ">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-wrap">
              {job.location?.city ||
                job.location?.state ||
                job.location?.country ||
                job.location?.address}
            </p>
          </div>
        )}
      </div>
      <div className="border-t w-full mt-5"></div>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex  px-6 justify-between gap-4 mt-5  items-center"
      >
        <div className="flex gap-2   font-medium text-lg rounded-lg items-center">
          {job.currency_type == "$" || job.currency_type == "USD" ? (
            <svg
              class="h-6 w-6 text-blue-500"
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
          ) : job.currency_type == "₹" ? (
            <svg
              className="h-7 w-7 text-blue-500 "
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
            job.currency_type
          )}
          <p className="text-nowrap  sm:text-base  ">
            {job.min_salary || job.max_salary
              ? ` ${
                  job.min_salary > 1000
                    ? job.min_salary / 1000 + "K"
                    : job.min_salary
                }  - ${
                  job.max_salary > 1000
                    ? job.max_salary / 1000 + "K"
                    : job.max_salary
                }`
              : "Not disclosed"}
            {(job.min_salary || job.max_salary) && job.salary_type && (
              <span className="text-gray-400 font-normal ml-2">
                per {job.salary_type}
              </span>
            )}
          </p>
        </div>
        {/* <p>Save</p> */}
        {(job?.user || job.source == "job_post") &&
          currentUser &&
          (saved ? (
            <svg
              onClick={(e) => {
                unsaveJob(job._id);
                e.stopPropagation();
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class={`bi bi-bookmark-fill liked-animation`}
              viewBox="0 0 16 16"
            >
              <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
            </svg>
          ) : (
            <svg
              onClick={(e) => {
                saveJob(job._id);
                e.stopPropagation();
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-bookmark unliked-animation"
              viewBox="0 0 16 16"
            >
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
            </svg>
          ))}
      </div>
    </div>
  );
});

export default JobListItem;
