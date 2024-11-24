import { formatDistanceToNow } from "date-fns";
import React from "react";
import UserImageInput from "../Input/UserImageInput";
import companyDefaultImage from "../../assets/companyDefaultImage.png";

function UserPostedJobs({
  setFormType,
  setupdateFormType,
  setUpdateData,
  jobData =[],
  isEditable,
  user
}) {
  console.log(jobData);
  
  return (
    <div className="bg-white border-x h-full px-4 py-4 md:px-6 md:border md:-mt-0 w-full flex-1">
      {jobData?.length > 0 ? (
        <div className="flex justify-between mb-3 items-center">
          <p className="font-medium">Recently posted jobs</p>
          {isEditable && (
            <button
              onClick={() => {
                setFormType("job");
              }}
              className="text-blue-500 bg-blue-50 text-sm py-1 px-4 border rounded-full font-medium border-blue-500"
            >
              Create job
            </button>
          )}
        </div>
      ) : isEditable && jobData?.length <= 0 ? (
        <div className="flex w-full justify-center py-10 text-center pt-8 flex-col items-center bg-white">
            <p className="text-2xl font-bold text-gray-500">
              No Job Posted Yet
            </p>
            <p className="mt-1 text-gray-400">
              Your job added will appear here once you've submitted them.
            </p>
            <p
              onClick={() => setFormType("job")}
              className="text-blue-500 bg-blue-50 w-fit px-8  py-2.5 mt-4 max-w-lg rounded-full text-xl font-medium cursor-pointer"
            >
              Create Job
            </p>
        </div>
      ) : (
        <p>No jobs post yet</p>
      )}

      {!isEditable && jobData?.length <= 0 && (
        <p className="max-w-xl pt-20 text-center sm:h-full h-fit px-6 md:px-6">
          <p className="text-2xl font-bold text-gray-500">
            No Job Applications Yet
          </p>
          <p className="mt-1 text-gray-400">
            Your job applications will appear here once you've submitted them.
          </p>
          <p
            onClick={() => {
              navigate("/jobs");
            }}
            className="text-blue-500 font-medium cursor-pointer"
          >
            Explore Jobs
          </p>
        </p>
      )}

      {jobData?.map((job, index) => (
        <div
          onClick={() => {
            setUpdateData({ job: job });
            setupdateFormType("job");
          }}
          className={`flex py-2 items-start  justify-between ${
            index < jobData.length - 1 ? "border-b cursor-pointer" : ""
          } `}
          key={job.id}
        >
          <div className="flex gap-2 ">
            <UserImageInput
              image={job.company_Logo || user?.profileImage?.compressedImage[0] || companyDefaultImage}
              isEditable={false}
              imageHeight={40}
            />
            <div className="-mt-1">
              <p className="text-lg font-semibold">{job.job_role}</p>
              <p className="text-xs text-gray-800 text-wrap">
                {job.location?.address}
              </p>
              {job.updatedAt ? (
                <p className="text-xs mt-0.5 text-gray-400">
                  Updated{" "}
                  {formatDistanceToNow(
                    new Date(job.updatedAt || job.job_post_date),
                    {
                      addSuffix: true,
                    }
                  )}
                </p>
              ) : (
                <p className="text-xs mt-0.5 text-gray-400">
                  {/* Posted{" "}
                  {formatDistanceToNow(
                    new Date(job.createdAt || job.job_post_date),
                    {
                      addSuffix: true,
                    }
                  )} */}
                </p>
              )}
            </div>
          </div>
          {isEditable && (
            <svg
              class="h-6 w-6 mt-1.5 text-gray-500"
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
              <circle cx="12" cy="12" r="1" /> <circle cx="12" cy="19" r="1" />{" "}
              <circle cx="12" cy="5" r="1" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserPostedJobs;
