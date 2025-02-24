import React, { useEffect, useState } from "react";
import savedService from "../../services/savedService";
import useJobApi from "../../services/jobService";
import UserImageInput from "../../components/Input/UserImageInput";
import { useNavigate } from "react-router-dom";
import LikeButton from "../../components/Button/LikeButton";
import CommentButton from "../../components/Button/CommentButton";
import JobListItem from "../../components/jobComponent/JobListItem";
import companyDefaultImage from "../../assets/companyDefaultImage.png";
import Button from "../../components/Button/Button";
import ImageCarousel from "../../components/ImageCarousel";
import { useSelector } from "react-redux";

function Saved() {
  const [selectedTab, setSelectedTab] = useState("Posts");
  const jobService = useJobApi();
  const currentUser = useSelector((state) => state.auth.user);
  const [savedItems, setSavedItems] = useState({
    posts: [],
    profiles: [],
    jobs: [],
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [unsavedItems, setUnsavedItems] = useState([]); // Track unsaved items
  useEffect(() => {
    document.title = "User saveds ";
  }, []);
  // Fetch saved data based on the selected tab
  useEffect(() => {
    setLoading(true);
    const fetchSavedData = async () => {
      try {
        const contentType = selectedTab.toLowerCase().slice(0, -1);
        const savedContent = await savedService.getSpecificSaved(contentType);
        setSavedItems((prev) => ({
          ...prev,
          [`${contentType}s`]: savedContent,
        }));
      } catch (error) {
        console.error("Error fetching saved data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedData();
  }, [selectedTab]);

  // Fetch job details for posts of type "job"
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const updatedPosts = await Promise.all(
          savedItems.posts.map(async (post) => {
            if (
              post.saved_content.post_type === "job" &&
              !post.saved_content.job
            ) {
              const job = await jobService.job.getById(
                post.saved_content.jobs[0]
              );
              return { ...post, saved_content: { ...post.saved_content, job } };
            }
            return post;
          })
        );
        setSavedItems((prev) => ({ ...prev, posts: updatedPosts }));
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    // Only fetch job details if there are posts that need job info
    if (
      savedItems.posts.some(
        (post) =>
          post.saved_content?.post_type === "job" && !post.saved_content?.job
      )
    ) {
      fetchJobDetails();
    }
  }, [savedItems.posts, jobService]);

  const handleUnsave = async (post, type) => {
    try {
      setUnsavedItems((prev) => [...prev, post._id]); // Track unsaved item
      await savedService.unsave(post.saved_content._id, type);
      setTimeout(() => {
        setSavedItems((prev) => ({
          ...prev,
          [type]: prev[type].filter((item) => item._id !== post._id),
        }));
      }, 0);

      // Remove the unsaved item from the tracked list after a delay
      setTimeout(() => {
        setUnsavedItems((prev) => prev.filter((id) => id !== post._id));
      }, 200); // Adjust time according to animation duration
    } catch (error) {
      console.error("Error unsaving item:", error.message);
      alert("Failed to unsave the item. Please try again.");
    }
  };

  const renderPosts = () => (
    <div className="flex flex-col gap-4">
      {savedItems.posts.length <= 0 && (
        <p className="max-w-xl pt-20 text-center sm:h-full h-fit px-6 md:px-6">
          <p className="text-2xl font-bold text-gray-500">No Saved Posts</p>
          <p className="mt-1 text-gray-400">
            Your saved posts will appear here once you've save them.
          </p>
        </p>
      )}
      {savedItems.posts.map((post) => (
        <div
          key={post._id}
          onClick={() => {
            navigate("/post/" + post.saved_content._id);
          }}
          className={`col-span-1 flex flex-col border-y sm:border  h-full  sm:rounded-xl ${
            unsavedItems.includes(post._id) ? "animate-unsave" : ""
          }`} // Add animation class
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate("/user/" + post.saved_content.user._id);
            }}
            className="flex gap-2 px-4 py-2 mb-1 "
          >
            <UserImageInput
              className="w-[35px] h-[35px]  rounded-full"
              imageHeight={40}
              imageBorder={1}
              image={post?.saved_content?.user.profileImage?.compressedImage}
              alt={`${post?.saved_content?.user.username}'s avatar`}
              isEditable={false}
            />
            <div className="flex gap-2 ml-2 items-center ">
              <div>
                <p className="font-medium">
                  {post?.saved_content?.user.personal_details?.firstname}{" "}
                  {post?.saved_content?.user.personal_details?.lastname}
                </p>
                <p className=" text-gray-400 -mt-[3px] text-sm">
                  {post?.saved_content?.user.username}
                </p>
              </div>
              {/* <span className="font-bold text-gray-500">·</span>{" "}
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), {}).split(
                  " "
                )[0] != "about" &&
                  formatDistanceToNow(new Date(post.createdAt), {}).split(" ")[0]}
                {formatDistanceToNow(new Date(post.createdAt), {})
                  .split(" ")[1]
                  .slice(0, 1)}
                {formatDistanceToNow(new Date(post.createdAt), {})
                  ?.split(" ")[2]
                  ?.slice(0, 1)}
              </p> */}
            </div>
          </div>
          {post.saved_content?.post_type === "job" ? (
            <div className="border mx-4 rounded-xl  h-full relative ">
              <div className="flex  gap-2 m-3">
                <div className="min-w-12 h-12 rounded-full bg-pink-950 text-white flex justify-center items-center">
                  {post.saved_content.job?.company_name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {post.saved_content.job?.job_role}
                  </p>
                  <p className="text-sm text-gray-400">
                    {post.saved_content.job?.company_name}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mx-4 mb-2 line-clamp-2">
                {post.saved_content.job?.description ||
                  "No description available."}
              </p>

              <div className="absolute bottom-2 right-2">
                <div className="relative w-full border">
                  <div className="absolute h-10 w-10 rounded-full bg-black opacity-50 bottom-0 -right-0"></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    className="bi bi-images absolute bottom-[9px]  right-[9px] text-white "
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
                    <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : post.saved_content?.images ? (
            post?.saved_content?.images?.compressedImage[0] && (
              <div
                style={{ overflowX: "auto", scrollbarWidth: "none" }}
                className="mt-2 flex mb-4 flex-col relative w-full  transition-all  duration-300 overflow-x-auto flex-1"
              >
                {post?.saved_content.images?.compressedImage[0] && (
                  <ImageCarousel
                    dots={false}
                    edges=""
                    className="h-full  flex-grow w-full px-5"
                    gap={2}
                    images={post.saved_content.images?.originalImage}
                  />
                )}
              </div>
            )
          ) : (
            <p
              className="p-3  text-sm h-full "
              dangerouslySetInnerHTML={{ __html: post?.saved_content?.content }}
            />
            //   {post?.saved_content.content}
            // </p>
          )}
          <div className="flex justify-between h-full w-full gap-4 px-4 items-center  py-3">
            <div className="flex gap-4 justify-center  z-10 text-gray-400 font-normal items-center ">
              <LikeButton
                postData={post.saved_content}
                likes={post.saved_content?.likes}
                likesCount={post.saved_content?.likes_count}
              />
              <CommentButton
                onClick={(e) => {
                  e.stopPropagation();
                  setCommentButtonClicked((prev) =>
                    prev == index ? null : index
                  );
                }}
                postData={post.saved_content}
                // setPostData={setPostData}
              />
            </div>
            {true ? (
              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnsave(post, "posts");
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 -mr-1"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                  clip-rule="evenodd"
                />
              </svg>
            ) : (
              <svg
                onClick={(e) => {
                  savePost(post._id);
                  e.stopPropagation();
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-bookmark"
                viewBox="0 0 16 16"
              >
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
              </svg>
            )}
          </div>
          {/* <button
            className=" w-full rounded-b-2xl border py-3 font-semibold bg-gray-100 text-gray-500"
            onClick={() => handleUnsave(post, "posts")}
          >
            Unsave
          </button> */}
        </div>
      ))}
    </div>
  );

  const renderProfiles = () => (
    <div className=" sm:px-0 grid grid-cols-1 w-full gap-4">
      {savedItems.profiles.length <= 0 && (
        <p className="max-w-xl w-full pt-20 text-center sm:h-full h-fit px-6 md:px-6">
          <p className="text-2xl font-bold text-gray-500">No Saved Profiles</p>
          <p className="mt-1 text-gray-400">
            Your saved profiles will appear here once you've save them.
          </p>
        </p>
      )}
      <div className="px-4 sm:px-0 grid grid-cols-2 w-full gap-4">
        {savedItems.profiles.map((profile) => (
          <div
            key={profile._id}
            onClick={() => {
              navigate("/user/" + profile.saved_content?._id);
            }}
            className={`border relative flex flex-col justify-between  p-3 w-full  rounded-xl ${
              unsavedItems.includes(profile._id) ? "animate-unsave" : ""
            }`}
          >
            <div className=" gap-2 flex flex-col  w-full items-center">
              <UserImageInput
                imageHeight={90}
                image={profile.saved_content.profileImage?.compressedImage[0]}
                isEditable={false}
              />
              <div>
                {profile.saved_content.company_details && (
                  <p className="font-semibold text-center">
                    {profile.saved_content.company_details?.company_name}
                  </p>
                )}
                {profile.saved_content.personal_details &&
                  profile.saved_content.personal_details && (
                    <p className="font-semibold text-center">
                      {`${profile.saved_content.personal_details?.firstname} ${profile.saved_content.personal_details?.lastname}`}
                    </p>
                  )}
                <p className="text-gray-400 text-center">
                  {profile.saved_content?.username}
                </p>
              </div>
            </div>
            {/* <Button
          className="border w-full mt-3 bg-gray-100 text-gray-500"
          onClick={() => handleUnsave(profile, "profiles")}
        >
          Unsave
        </Button> */}
            {true && (
              <div
                // onClick={() => handleRemoveImage(image)}
                className="absolute top-4 right-4  cursor-pointer"
              >
                <div className="absolute w-10 h-10 -top-[3px] -right-[4px] bg-black opacity-45 rounded-full"></div>
                <svg
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsave(profile, "profiles");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="h-4 w-4 text-gray-100  absolute top-[9px] right-2 z-10"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderJobs = () => {
    return (
      <div className="flex flex-col gap-4">
        {savedItems.jobs.length <= 0 && (
          <p className="max-w-xl pt-20 text-center sm:h-full h-fit px-6 md:px-6">
            <p className="text-2xl font-bold text-gray-500">No Saved Job</p>
            <p className="mt-1 text-gray-400">
              Your saved jobs will appear here once you've save them.
            </p>
          </p>
        )}
        {savedItems.jobs.map((job) => (
          <JobListItem
            job={job.saved_content}
            className={"border-y sm:border shadow-none"}
            companyDefaultImage={companyDefaultImage}
          />
          //   <div
          //     key={job._id}
          //     className={`border w-full p-4   rounded-xl ${
          //       unsavedItems.includes(job._id) ? "animate-unsave" : ""
          //     }`}
          //   >
          //     <div className="flex justify-between items-center">
          //       <div className="flex gap-2">
          //         <UserImageInput image={job.comlogo} isEditable={false} />
          //         <div>
          //           <p className="font-semibold">{job.saved_content.job_role}</p>
          //           <p className="text-gray-400">
          //             {job.saved_content.company_name}
          //           </p>
          //         </div>
          //       </div>
          //       <svg
          //         onClick={(e) => {
          //           handleUnsave(job, "jobs");
          //           e.stopPropagation();
          //         }}
          //         xmlns="http://www.w3.org/2000/svg"
          //         width="24"
          //         height="24"
          //         fill="currentColor"
          //         className="bi bi-bookmark-fill"
          //         viewBox="0 0 16 16"
          //       >
          //         <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
          //       </svg>
          //     </div>
          //     <div className="flex flex-wrap gap-2 flex-row text-nowrap mt-5">
          //       <div className="flex gap-2   items-center">
          //         <svg
          //           className="h-6 w-6 text-gray-400"
          //           fill="none"
          //           viewBox="0 0 24 24"
          //           stroke="currentColor"
          //         >
          //           <path
          //             strokeLinecap="round"
          //             strokeLinejoin="round"
          //             strokeWidth="2"
          //             d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
          //           />
          //         </svg>
          //         <p className="text-nowrap text-lg sm:text-base sm:font-normal font-semibold">
          //           {job.saved_content.min_salary
          //             ? ` ${job.saved_content.min_salary}`
          //             : "Not disclosed"}
          //         </p>
          //       </div>
          //       <div className="min-h-full border-l mx-1 w-px"></div>
          //       <div className="flex gap-2   items-center">
          //         <svg
          //           className="h-6 w-6 text-gray-400"
          //           width="24"
          //           height="24"
          //           viewBox="0 0 24 24"
          //           strokeWidth="2"
          //           stroke="currentColor"
          //           fill="none"
          //           strokeLinecap="round"
          //           strokeLinejoin="round"
          //         >
          //           <path stroke="none" d="M0 0h24v24H0z" />
          //           <rect x="3" y="7" width="18" height="13" rx="2" />
          //           <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
          //           <line x1="12" y1="12" x2="12" y2="12.01" />
          //           <path d="M3 13a20 20 0 0 0 18 0" />
          //         </svg>
          //         <p className="text-nowrap">
          //           {job.saved_content.min_experience ||
          //             "Experience not specified"}
          //         </p>
          //       </div>
          //       {job.saved_content.location && (
          //         <div className="min-h-full border-l mx-1 w-px"></div>
          //       )}
          //       {job.saved_content.location && (
          //         <div className="flex gap-2 ">
          //           <svg
          //             className="h-6 w-6 text-gray-400"
          //             fill="none"
          //             viewBox="0 0 24 24"
          //             stroke="currentColor"
          //           >
          //             <path
          //               strokeLinecap="round"
          //               strokeLinejoin="round"
          //               strokeWidth="2"
          //               d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          //             />
          //             <path
          //               strokeLinecap="round"
          //               strokeLinejoin="round"
          //               strokeWidth="2"
          //               d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          //             />
          //           </svg>
          //           <p className="text-wrap">
          //             {job.saved_content.location?.address}
          //           </p>
          //         </div>
          //       )}
          //     </div>
          //     {job.saved_content.description &&
          //       job.saved_content.description != "" && (
          //         <div className="flex gap-2 mt-4">
          //           <svg
          //             className="h-6 w-6 shrink-0 text-gray-400"
          //             viewBox="0 0 24 24"
          //             strokeWidth="2"
          //             stroke="currentColor"
          //             fill="none"
          //             strokeLinecap="round"
          //             strokeLinejoin="round"
          //           >
          //             <path stroke="none" d="M0 0h24h24H0z" />
          //             <rect x="5" y="3" width="14" height="18" rx="2" />
          //             <line x1="9" y1="7" x2="15" y2="7" />
          //             <line x1="9" y1="11" x2="15" y2="11" />
          //             <line x1="9" y1="15" x2="13" y2="15" />
          //           </svg>
          //           <p
          //             className="text-gray-700 line-clamp-1 truncate text-wrap"
          //             dangerouslySetInnerHTML={{
          //               __html: job.saved_content.description,
          //             }}
          //           ></p>
          //         </div>
          //       )}
          //     {/* <Button
          //   className="border w-full mt-3 bg-gray-100 text-gray-500"
          //   onClick={() => handleUnsave(job, "jobs")}
          // >
          //   Unsave
          // </Button> */}
          //   </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Posts":
        return loading ? (
          <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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
        ) : (
          <div className=" gap-2">{renderPosts()}</div>
        );

      case "Profiles":
        return loading ? (
          <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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
        ) : (
          <div className="">{renderProfiles()}</div>
        );
      case "Jobs":
        return loading ? (
          <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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
        ) : (
          <div className=" gap-2">{renderJobs()}</div>
        );
      default:
        return <div>Select a tab to view content.</div>;
    }
  };

  return (
    <div>
      {/* Background Overlay */}
      <div
        onClick={() => window.history.back()}
        className="fixed w-full h-full bg-black opacity-75 z-20 top-0 left-0"
      ></div>

      {/* Main Content */}
      <div className="fixed w-full pb-14 sm:max-w-lg right-0 flex flex-col gap-5 h-full py-5 sm:py-8 bg-white top-0 z-30  overflow-y-auto">
        <div className=" ">
          <div className="flex gap-4 mb-6 items-center -mt-0.5 px-4 sm:px-6">
            <svg
              onClick={() => {
                window.history.back();
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <h2 className="text-2xl font-bold" >
              Bookmarks
            </h2>
          </div>
          {/* Tab Navigation */}
          <div className="flex w-full gap-3 px-4 sm:px-6">
            {[
              "Posts",
              "Profiles",
              currentUser.account_type == "Candidate" ? "Jobs" : null,
            ]
              .filter(Boolean)
              .map((tab) => (
                <p
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`w-1/3 border cursor-pointer px-2 py-1 rounded-lg font-medium text-center ${
                    selectedTab === tab
                      ? "border-gray-800 bg-gray-800 text-white"
                      : ""
                  }`}
                >
                  {tab}
                </p>
              ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-2 overflow-y-auto w-full  max-h-full sm:px-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default Saved;
