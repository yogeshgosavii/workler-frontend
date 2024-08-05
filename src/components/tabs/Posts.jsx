import React from "react";
import profileImageDefault from "../../assets/user_male_icon.png";

import UserImageInput from "../Input/UserImageInput";
import { formatDistanceToNow } from "date-fns";

function Posts({ setFormType, postData, userDetails }) {
  console.log(postData);

  return (
    <div className=" w-full">
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
        <div className="flex flex-col gap-4">
          <div className="flex px-4 bg-white justify-between py-4 border-b items-center">
            <p className="font-medium">Recently posts</p>
            <button
              onClick={() => {
                setFormType("post");
              }}
              className="text-blue-500 bg-blue-50 text-sm py-1 px-4 border rounded-full font-medium border-blue-500"
            >
              Add post
            </button>
          </div>
          {postData.map((post, index) => (
            <div key={index} className="border-y bg-white border-gray-300 py-4 ">
              <div className="flex  items-center justify-between px-4">
                <div className="flex gap-2 items-center">
                  <UserImageInput
                    className="w-[35px] h-[35px] rounded-full"
                    imageHeight={35}
                    imageBorder={1}
                    // src={post.userAvatar || profileImageDefault}
                    image={post.profileImage || profileImageDefault}
                    alt={`${post.username}'s avatar`}
                    isEditable={false}
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {userDetails.username}
                    </p>
                    <p className="text-xs text-gray-400"> {formatDistanceToNow(new Date(post.timestamp), {
                  addSuffix: true,
                })}</p>
                  </div>
                </div>
                <svg
                  class="h-6 w-6 text-gray-500"
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
                  <circle cx="12" cy="12" r="1" />{" "}
                  <circle cx="12" cy="19" r="1" />{" "}
                  <circle cx="12" cy="5" r="1" />
                </svg>
              </div>
              <p className="mt-1 px-4 text-sm">{post.content}</p>
              {post.images && (
                <div
                  style={{
                    overflowX: "auto",
                    scrollbarWidth: "none",
                  }}
                  className="mt-2 px-4 flex gap-2 overflow-x-auto"
                >
                  {post.images.compressedImage.map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      height={"10px"}
                      className="w-full h-full  rounded-sm border aspect-square border-gray-800  object-cover"
                      src={image}
                      alt={`Post ${index} image ${imgIndex}`}
                    />
                  ))}
                </div>
              )}
              {/* <div className="flex justify-between items-center mt-4">
                <button className="text-sm text-blue-500">Like</button>
                <button className="text-sm text-blue-500">Comment</button>
                <button className="text-sm text-blue-500">Share</button>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Posts;
