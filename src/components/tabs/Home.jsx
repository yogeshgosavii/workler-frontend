import React from "react";
import UserImageInput from "../Input/UserImageInput";
import profileImageDefault from "../../assets/user_male_icon.png";
import { formatDistanceToNow } from "date-fns";
import ImageCarousel from "../ImageCarousel";

function Home({
  user,
  loading,
  userDetails,
  setcurrentTab,
  setupdateFormType,
  setUpdateData,
  postData,
}) {
  return (
    <div className="  flex flex-col gap-4 mb-4">
      {user.account_type == "Employeer" ? (
        <div className="flex flex-col  bg-white md:border  md:shadow-lg   gap-2">
          <p className="text-xl font-bold px-4 mt-4 md:px-6">About</p>
          {loading.userDetails ? (
            <div className="px-4 md:px-6 py-4">
              <div className="h-2 bg-gray-200 rounded-md mb-2 "></div>
              <div className="h-2 bg-gray-200 rounded-md mb-4 "></div>
              <div className="h-2 bg-gray-200 w-1/2 rounded-md mb-2 "></div>
            </div>
          ) : (
            <div className="mb-4 px-4 md:px-6 ">
              <p className=" line-clamp-3 mt-1 text-sm mb-2">
                {userDetails == "" ? (
                  <div>
                    <div className="animate-pulse z-10 mt-2">
                      <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded-md "></div>
                      <div className="h-2 w-1/2 bg-gray-200 rounded-md mt-5"></div>
                    </div>
                  </div>
                ) : (
                  <span> {userDetails.description}</span>
                )}
              </p>
              <a className="text-sm text-blue-500">
                {userDetails.company_details?.website}
              </a>
            </div>
          )}
          <p
            onClick={() => {
              setcurrentTab("About");
            }}
            className="w-full text-center border-t font-medium py-2 text-gray-400"
          >
            Learn more
          </p>
        </div>
      ) : (
        <div className="relative border-b md:px-6 overflow-hidden bg-white px-4 py-4 pb-6">
          <div className="flex justify-between items-center mb-2 ">
            <p className="text-xl font-bold ">About</p>
            <svg
              class="h-5 w-5 text-blue-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              onClick={() => {
                setupdateFormType("personalDetails");
                console.log(user);
                setUpdateData({ personalDetails: userDetails });
                // setUpdateForm({ personalDetails: true });
              }}
            >
              {" "}
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </div>
          {!loading.userDetails ? (
            <div className="flex flex-col gap-4 mt-5">
              <div className={`text-sm font-normal  `}>
                <p className="font-semibold mb-1">Description</p>
                {userDetails.description ? (
                  <div onClick={() => setdescriptionInput(true)}>
                    <p className="text-gray-400">{userDetails.description}</p>
                  </div>
                ) : (
                  userDetails.account_type == "Employeer"?(
                    <div
                    className="text-sm font-normal text-gray-300 w-full"
                  >
                    Add a description. For example: "We are a dynamic company
                    committed to excellence and innovation."
                  </div>
                  ):(
                    <div
                    className="text-sm font-normal text-gray-300 w-full"
                  >
                    Add a description. For example: "Experienced professional with a strong background in developing."
                  </div>
                  )
                 
                )}
              </div>
              {userDetails?.linkedInLink && (
                <div className={`text-sm font-normal  `}>
                  <p className="font-bold">LinkedIn</p>
                  {!loading.userDetails && (
                    <a
                      className="text-sm font-normal text-blue-500 w-full"
                      href={userDetails?.linkedInLink}
                    >
                      {userDetails?.linkedInLink}
                    </a>
                  )}
                </div>
              )}
              {userDetails.githubLink && (
                <div className={`text-sm font-normal  `}>
                  <p className="font-bold">Github</p>
                  {!loading.userDetails && (
                    <a
                      className="text-sm font-normal text-blue-500 w-full"
                      href={userDetails?.githubLink}
                    >
                      {userDetails?.githubLink}
                    </a>
                  )}
                </div>
              )}
              {userDetails?.location && (
                <div className={`text-sm font-normal  `}>
                  <p className="font-bold">Address</p>
                  {!loading.userDetails && (
                    <div className="text-sm font-normal text-gray-400 w-full">
                      {userDetails?.location?.address}
                    </div>
                  )}
                </div>
              )}
              {userDetails?.personal_details?.phone && (
                <div className={`text-sm font-normal  `}>
                  <p className="font-bold">Phone</p>
                  {!loading.userDetails && (
                    <div className="text-sm font-normal text-gray-400 w-full">
                      {userDetails?.personal_details?.phone}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-pulse flex flex-col gap-3 z-10 mt-5">
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
            </div>
          )}
        </div>
      )}
      {postData && (
        <div className="bg-white border-y md:border md:shadow-lg ">
          <div className="flex flex-col px-4 md:px-6 py-4 ">
            <p className="text-xl font-bold">Posts</p>
          </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 px-4 gap-4 sm:px-4 md:px-6 mb-4">
         {postData.map((post, index) => (
            <div key={index} className=" border  bg-white border-gray-300 py-4 px-4 ">
              <div className="flex  items-center justify-between ">
                <div className="flex gap-2 items-center">
                  <UserImageInput
                    className="w-[35px] h-[35px] rounded-full"
                    imageHeight={35}
                    imageBorder={1}
                    // src={post.userAvatar || profileImageDefault}
                    image={userDetails.profileImage?.compressedImage || profileImageDefault}
                    alt={`${post.username}'s avatar`}
                    isEditable={false}
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {userDetails.username}
                    </p>
                    <p className="text-xs text-gray-400"> {formatDistanceToNow(new Date(post.createdAt), {
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
              <p className="mt-1 text-sm ">{post.content}</p>
              {post.images && (
                <div
                  style={{
                    overflowX: "auto",
                    scrollbarWidth: "none",
                  }}
                  className="mt-2  flex overflow-x-auto"
                >
                  <ImageCarousel
                  images={post.images.originalImage}
                  />
                  {/* {post.images.compressedImage.map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      height={"10px"}
                      className="w-full max-h-52  border-gray-400  object-cover"
                      src={image}
                      alt={`Post ${index} image ${imgIndex}`}
                    />
                  ))} */}
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
          <p
            onClick={() => {
              setcurrentTab("Posts");
            }}
            className="w-full text-center  border-t font-medium py-2 text-gray-400"
          >
            See all posts
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
