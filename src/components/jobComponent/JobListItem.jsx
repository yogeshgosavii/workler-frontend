import React from "react";
import Logo from "../../assets/Logo";
import LogoCircle from "../../assets/LogoCircle";
import { useNavigate } from "react-router-dom";

const JobListItem = React.memo(({ job, companyDefaultImage }) => {
  const navigate = useNavigate()
  return (
    <div>
      {job.header ? (
        <div
          onClick={() => {
            window.location.href = job.header.jobLink;
          }}
          className="border p-4 px-6 cursor-pointer hover:bg-gray-50 rounded-xl mb-4"
        >
          <div className="flex gap-3">
            <img
              className="border h-20"
              src={
                job.overview.squareLogoUrl
                  ? job.overview.squareLogoUrl
                  : companyDefaultImage
              }
            />
            <div className="w-full">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-black max-w-[700px] ">
                  {job.header.jobTitleText}
                </h2>
                {/* Add other job details */}
              </div>
              <div className="flex items-center justify-between gap-2 ">
                <p className="text-gray-600 font-medium text-lg">
                  {job.header.employerNameFromSearch}
                </p>
                <p className="flex gap-2 items-center ">
                  {
                    job.header.rating ? (
                      <div className="border flex rounded-full items-center px-2 pr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="yellow"
                          width="16px"
                          height="16px"
                          style={{ marginRight: "4px" }} // Adjust for spacing
                        >
                          <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
                        </svg>
                        <p>{job.header.rating}</p> {/* Display the rating */}
                      </div>
                    ) : null // If job.header.review is falsy, render nothing
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="flex px-2 gap-1 w-fit rounded-md items-center mt-1.5 text-sm border text-black">
            <img className="h-6 " src={job.header.portal_Image} />
            <p>{job.header.portal}</p>
          </div>
          <div className="flex flex-wrap flex-col gap-2 md:flex-row text-nowrap mt-5">
            <div className="flex gap-2 sm:pr-5 sm:border-r items-center">
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
                  d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-nowrap text-lg sm:text-base sm:font-normal font-semibold">
                {job.header.payPeriodAdjustedPay !== undefined
                  ? ` ${job.header.payPeriodAdjustedPay}`
                  : "Not disclosed"}
              </p>
            </div>
            <div className="flex flex-wrap gap-5 sm:gap-0 mt-2 sm:mt-0">
              <div className="flex gap-2 sm:px-5 sm:border-r items-center">
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
                  {job.header.goc || "Experience not specified"}
                </p>
              </div>
              <div className="flex gap-2 sm:px-5 items-center">
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
                <p className="text-nowrap">{job.header.locationName}</p>
              </div>
            </div>
          </div>
          {job.job.descriptionFragments &&
            job.job.descriptionFragments != "" && (
              <div className="flex gap-2 mt-4">
                <svg
                  className="h-6 w-6 shrink-0 text-gray-400"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24h24H0z" />
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <line x1="9" y1="7" x2="15" y2="7" />
                  <line x1="9" y1="11" x2="15" y2="11" />
                  <line x1="9" y1="15" x2="13" y2="15" />
                </svg>
                <p
                  className="text-gray-700"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3, // Number of lines to display
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: job.job.descriptionFragments,
                  }}
                ></p>
              </div>
            )}
        </div>
      ) : (
        <div
          onClick={() => {
            navigate("/job/"+job._id)
          }}
          className="border p-5 cursor-pointer hover:bg-gray-50 rounded-xl mb-4"
        >
          <div className="flex gap-3">
            <img
              className="border p-2 rounded-lg h-20"
              src={
                job.company_details
                  ? job.company_details.logo
                  : companyDefaultImage
              }
            />
            <div className="w-full">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-black max-w-[700px] ">
                  {job.job_role}
                </h2>
                {/* Add other job details */}
              </div>
              <div className="flex items-center justify-between gap-2 ">
                <p className="text-gray-600 font-medium text-lg">
                  {job.company_name}
                </p>
              </div>
            </div>
          </div>
          {/* <div className="flex px-2 gap-1 py-1 max-h-10 w-fit rounded-md items-center mt-2 text-sm border text-black">
            <LogoCircle/>
            <p>Workler</p>
          </div> */}
          <div className="flex flex-wrap gap-2 flex-row text-nowrap mt-5">
            <div className="flex gap-2   items-center">
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
                  d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-nowrap text-lg sm:text-base sm:font-normal font-semibold">
                {job.min_salary ? ` ${job.min_salary}` : "Not disclosed"}
              </p>
            </div>
            <div className="min-h-full border-l mx-1 w-px"></div>
            <div className="flex gap-2   items-center">
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
                {job.min_experience || "Experience not specified"}
              </p>
            </div>
            {job.location && (
              <div className="min-h-full border-l mx-1 w-px"></div>
            )}
            {job.location && (
              <div className="flex gap-2 ">
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
                <p className="text-wrap">{job.location?.address}</p>
              </div>
            )}
          </div>
          {job.description && job.description != "" && (
            <div className="flex gap-2 mt-4">
              <svg
                className="h-6 w-6 shrink-0 text-gray-400"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24h24H0z" />
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <line x1="9" y1="7" x2="15" y2="7" />
                <line x1="9" y1="11" x2="15" y2="11" />
                <line x1="9" y1="15" x2="13" y2="15" />
              </svg>
              <p
                className="text-gray-700"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3, // Number of lines to display
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                dangerouslySetInnerHTML={{
                  __html: job.description,
                }}
              ></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default JobListItem;
