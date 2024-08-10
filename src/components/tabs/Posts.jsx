import React, { useState, useEffect } from "react";
import profileImageDefault from "../../assets/user_male_icon.png";
import UserImageInput from "../Input/UserImageInput";
import { formatDistanceToNow } from "date-fns";
import ImageCarousel from "../ImageCarousel";
import LikeButton from "../Button/LikeButton";
import useJobApi from "../../services/jobService";
import Button from "../Button/Button";
import CommentButton from "../Button/CommentButton";

function Posts({ setFormType, postData, setPostData, userDetails }) {
  const [jobData, setJobData] = useState({});
  const jobService = useJobApi();

  console.log(postData);

  return (
    <div className="w-full">
      {postData.length === 0 ? (
        <div className="flex flex-col items-center bg-white">
          <p className="font-bold text-xl mt-6">Create your first post</p>
          <p
            onClick={() => setFormType("post")}
            className="text-sm text-blue-500 mt-2 font-medium cursor-pointer"
          >
            Add post
          </p>
        </div>
      ) : (
        <div className="flex flex-col ">
          <div className="flex px-4 bg-white justify-between py-4  sm:border items-center">
            <p className="font-medium">Recently posts</p>
            <button
              onClick={() => setFormType("post")}
              className="text-blue-500 bg-blue-50 text-sm py-1 px-4 border rounded-full font-medium border-blue-500"
            >
              Add post
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl::grid-cols-3 ">
            {postData.map((post, index) => (
              <div
                key={index}
                className={`border-b sm:border sm:shadow-xl h-full bg-white border-gray-300 py-4 px-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-start">
                    <UserImageInput
                      className="w-[35px] h-[35px] rounded-full"
                      imageHeight={35}
                      imageBorder={1}
                      image={
                        userDetails.profileImage?.compressedImage ||
                        profileImageDefault
                      }
                      alt={`${post.username}'s avatar`}
                      isEditable={false}
                    />
                    <div className="flex gap-2 items-center ">
                      <p className="font-medium text-sm">
                        {userDetails.username}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDistanceToNow(new Date(post.createdAt), {})}
                      </p>
                    </div>
                  </div>
                  <svg
                    className="h-6 w-6 text-gray-500"
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
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="19" r="1" />
                    <circle cx="12" cy="5" r="1" />
                  </svg>
                </div>
                <p className=" ml-[43px] -mt-4 text-sm flex-1">
                  {post.content}
                </p>
                {post.images && (
                  <div
                    style={{ overflowX: "auto", scrollbarWidth: "none" }}
                    className="mt-2 flex flex-col overflow-x-auto flex-grow flex-1"
                  >
                    <ImageCarousel
                      // className={"pl-[43px]"}
                      dots={false}
                      edges="rounded-lg"
                      className={"h-full flex-1"}
                      gap={2}
                      images={post.images.originalImage}
                    />
                     <div className="flex gap-4 text-gray-400 font-normal items-center ml-[43px] mt-2">
                      <LikeButton postData={post} setPostData={setPostData} />
                      <CommentButton postData={post} setPostData={setPostData} />
                    </div>
                  </div>
                )}
                {post.post_type == "job" && (
                  <div
                    style={{
                      overflowX: "scroll",
                      scrollbarWidth: "none",
                      scrollSnapType: "x mandatory",
                      scrollBehavior: "smooth",
                      scrollMarginLeft: "20px",
                    }}
                    className="flex flex-col overflow-x-auto"
                  >
                    <div
                      style={{
                        overflowX: "scroll",
                        scrollbarWidth: "none",
                        scrollSnapType: "x mandatory",
                        scrollBehavior: "smooth",
                        scrollMarginLeft: "20px",
                      }}
                      className="flex gap-4 pl-[43px]  mt-4 overflow-x-auto"
                    >
                      {post.post_type === "job" &&
                        post.jobs.map((job) => {
                          const logoLetter = job.company_name
                            ?.charAt(0)
                            .toUpperCase();
                          return (
                            <div
                              key={job._id}
                              className="mt-2 border p-5 rounded-2xl w-full flex-shrink-0"
                            >
                              <div className="flex gap-4">
                                <p className="bg-pink-950 text-white font-bold text-3xl -ml-px rounded-full flex items-center justify-center w-14 h-14">
                                  {logoLetter}
                                </p>
                                <div>
                                  <h3 className="font-bold text-2xl">
                                    {job.job_role}
                                  </h3>
                                  <p className="text-gray-500">
                                    {job.company_name}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm mt-2 line-clamp-3 ">
                                Lorem, ipsum dolor sit amet consectetur
                                adipisicing elit. Ea, distinctio obcaecati est
                                repellendus unde delectus alias quidem magni
                                officia porro, at perferendis temporibus facilis
                                voluptate dolores magnam! Commodi, a voluptas?
                              </p>
                              <a
                                href={job.job_url}
                                target="_blank"
                                className="bg-blue-500 rounded-lg w-full px-4 py-2 pb-3 flex items-center justify-center text-xl font-bold text-white mt-4"
                              >
                                Apply
                              </a>
                            </div>
                          );
                        })}
                    </div>
                    <div className="flex gap-4 text-gray-400 items-center ml-[43px] mt-2">
                      <LikeButton postData={post} setPostData={setPostData} />
                      <CommentButton postData={post} setPostData={setPostData} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;
