import React, { useState, useRef, useEffect } from "react";
import profileImageDefault from "../../assets/user_male_icon.png";
import UserImageInput from "../Input/UserImageInput";
import { formatDistanceToNow } from "date-fns";
import ImageCarousel from "../ImageCarousel";
import LikeButton from "../Button/LikeButton";
import Button from "../Button/Button";
import "../../css/button.css";
import CommentButton from "../Button/CommentButton";
import TextInput from "../Input/TextInput";
import { addComment } from "../../services/postService";
import { comment } from "postcss";
import useJobApi from "../../services/jobService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import savedService from "../../services/savedService";
import UserPostUpdateSettings from "../UserPostUpdateSettings";
import PostMentionList from "../PostMentionList";

function Posts({
  setSelectedPost,
  postData,
  className,
  postClassName,
  postPaddingbottom,
  setPostData,
  columns,
  userDetails,
  no_post_error,
  isEditable = true,
  style,
  ...props
}) {
  const [commentButtonClicked, setCommentButtonClicked] = useState(null);
  const [sendClicked, setSendClicked] = useState(null);
  const [commentText, setcommentText] = useState("");
  const [savedList, setSavedList] = useState([]);
  const jobService = useJobApi();
  const navigate = useNavigate();
  const sendBtnRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.auth.user);
  const [postSettings, setPostSettings] = useState(null);
  const [postMentions, setPostMentions] = useState(null);

  const handleCommentButtonClick = (index) => {
    setCommentButtonClicked(commentButtonClicked === index ? null : index);
  };
  useEffect(() => {
    const getSaveds = async () => {
      const savedResponse = await savedService.getSpecificSaved("post");
      setSavedList(savedResponse);
    };

    getSaveds();
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  const savePost = async (postId) => {
    setSavedList((prev) => [
      ...prev,
      {
        user: currentUser._id,
        contentType: "post",
        saved_content: { _id: postId },
      },
    ]);
    const response = await savedService.save({
      user: currentUser._id,
      contentType: "post",
      saved_content: postId,
    });
  };

  const unsavePost = async (postId) => {
    setSavedList(savedList.filter((post) => post.saved_content._id != postId));
    const response = await savedService.unsave(postId);
  };

  const handleSendClick = async (index) => {
    setSendClicked(index);

    const response = await addComment({
      ...postData[index],
      comments_count: postData[index].comments_count + 1,
      comments: [
        ...postData[index]?.comments,
        {
          user: userDetails._id,
          comment_text: commentText.text,
        },
      ],
    });
  };

  const handleAnimationEnd = () => {
    document.getElementById("sendBtn").classList.add("hidden");
  };

  return (
    <div className={`w-full   ${className}`}>
      {postData && postData?.length === 0 ? (
        isEditable ? (
          <p className=" pt-12 text-center w-full  h-full  px-6 md:px-6">
            <p className="text-2xl font-bold text-gray-500">No Posts Yet</p>
            <p className="mt-1 text-gray-400">
              Your posts will appear here once you've posted them.
            </p>
            <p
              onClick={() => {
                navigate("post");
              }}
              className="text-blue-500 lg:hidden font-medium cursor-pointer"
            >
              Create Post
            </p>
          </p>
        ) : no_post_error ? (
          no_post_error
        ) : (
          <p className=" pt-14 h-full text-center  px-6 md:px-6">
            <p className="text-2xl font-bold text-gray-500">
              No Posts Available
            </p>
            <p className="mt-1 text-gray-400">
              Once available, relevant posts will appear here.
            </p>
          </p>
        )
      ) : (
        <div className="flex flex-col snap-y  h-full overflow-y-auto  sm:gap-2" 
        style={{scrollbarWidth:"none"}}
        >
          {isEditable && (
            <div className="flex px-4   bg-white justify-between py-4 sm:border items-center">
              <p className="font-medium">Recent posts</p>
              <button
                onClick={() => {
                  navigate("post");
                }}
                className=" text-sm text-blue-500 lg:hidden px-4 py-1 bg-blue-50  rounded-full font-medium border-blue-500"
              >
                Add post
              </button>
            </div>
          )}
          {/* {  isEditable && <svg
            onClick={() => setFormType("post")}
            class="h-14 w-14 fixed bottom-8 sm:hidden right-5 bg-blue-500 p-4  z-20 rounded-full text-white shadow-lg"
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
            <line x1="12" y1="5" x2="12" y2="19" />{" "}
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>} */}
          <UserPostUpdateSettings
            setPostSetting={setPostSettings}
            postSettings={postSettings}
            setPostData={setPostData}
            postData={postData}
          />
          <PostMentionList
            showMentions={postMentions}
            setShowMentions={setPostMentions}
          />

        
            {postData?.map((post, index) => {
              return (
                <div
                  key={index}
                  onClick={() => window.open("/post/" + post._id, "_blank")}
                  className={`sm:border w-full max-w-full snap-center mb-5  border-y  ${postClassName} flex flex-col bg-white  transition-all     p-4 sm:p-7`}
                >
                  <div className="flex   gap-2  justify-between">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open("/user/" + post.user._id, "_blank");
                      }}
                      className="flex gap-4 "
                    >
                      <UserImageInput
                        className="w-[35px] h-[35px] rounded-full"
                        imageHeight={40}
                        imageBorder={1}
                        image={
                          post?.user.profileImage?.compressedImage ||
                          profileImageDefault
                        }
                        alt={`${post?.user.username}'s avatar`}
                        isEditable={false}
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center flex-wrap max-w-full overflow-hidden">
                          <p
                            className="font-medium truncate line-clamp-1  whitespace-nowrap overflow-hidden text-ellipsis"
                          >
                            {post?.user.company_details
                              ? post?.user.company_details?.company_name
                              : `${post?.user.personal_details?.firstname} ${post?.user.personal_details?.lastname}`}
                          </p>
                          <span className="font-bold text-gray-500 mx-2">
                            ·
                          </span>
                          <p className="text-gray-400 truncate whitespace-nowrap overflow-hidden text-ellipsis font-normal">
                            @{post?.user.username}
                          </p>
                        </div>

                        <p className="text-sm text-gray-400">
                          {/* {formatDistanceToNow(
                            new Date(post.createdAt),
                            {}
                          ).split(" ")[0] != "about" &&
                            formatDistanceToNow(
                              new Date(post.createdAt),
                              {}
                            ).split(" ")[0]} */}
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ">
                      {currentUser._id != post.user._id &&
                        (savedList.some(
                          (item) => item.saved_content?._id == post._id
                        ) ? (
                          <svg
                            onClick={(e) => {
                              unsavePost(post._id);
                              e.stopPropagation();
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class={`bi size-6 bi-bookmark-fill liked-animation`}
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
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class={`size-6 bi bi-bookmark-fill unliked-animation`}
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                            />
                          </svg>
                        ))}
                      <svg
                        onClick={(e) => {
                          setPostSettings(post);
                          e.stopPropagation();
                        }}
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
                  </div>
                  <div
                    className={`relative ${
                      !post.images && post.post_type !== "job" && " flex-1"
                    } `}
                  >
                    <p
                      className={`mt-4 ${
                        !post.images &&
                        post.post_type !== "job" &&
                        "flex-1 rounded-xl"
                      }`}
                    >
                      {post.content.split(/(@\w+)/).map((segment, index) => {
                        if (segment.startsWith("@")) {
                          const mention = segment.slice(1); // Remove "@" from the mention

                          // Find the corresponding user in the mentions list
                          const mentionedUser = post.mentions.find(
                            (user) => user.username === mention
                          );

                          if (mentionedUser) {
                            const profileImage =
                              mentionedUser.profileImage?.originalImage?.[0] ||
                              "";

                            return (
                              <span
                                key={index}
                                className="text-blue-500 relative cursor-pointer group"
                                role="button"
                                tabIndex="0"
                                aria-label={`View profile of ${mentionedUser.username}`}
                              >
                                {segment}
                                <div
                                  className="absolute top-7 gap-3 z-20 hidden w-fit items-start group-hover:sm:flex  border bg-white shadow-xl flex-col px-5 pr-9  justify-center py-2 left-0 pb-5 pt-4 rounded-lg"
                                  role="tooltip"
                                >
                                  <div className="flex gap-3">
                                    <img
                                      src={profileImage}
                                      alt={`${mentionedUser.username}'s profile`}
                                      className="w-8 h-8 mt-1 rounded-full"
                                    />
                                    {/* <p className="ml-3 text-gray-800">
                                    <p className="font-medium text-nowrap">
                                      {mentionedUser.personal_details
                                        ? mentionedUser.personal_details
                                            .firstname +
                                          " " +
                                          mentionedUser.personal_details
                                            .lastname
                                        : mentionedUser.company_details
                                            .company_name}
                                    </p>
                                    <p className="text-sm text-gray-400 -mt-0.5">
                                      {mentionedUser.username}
                                    </p>
                                  </p> */}
                                    <div className="flex gap-1 text-wrap text-gray-400 pr-5  items-center">
                                      <p className=" text-gray-800  font-medium   text-nowrap">
                                        {mentionedUser.personal_details
                                          ? `${mentionedUser.personal_details.firstname} ${mentionedUser.personal_details.lastname}`
                                          : mentionedUser.company_details
                                              ?.company_name}
                                      </p>

                                      {"  "}
                                      <span className="font-bold px-0.5">
                                        ·
                                      </span>
                                      {"  "}
                                      <p className="text-gray-500 ">
                                        @{mentionedUser.username}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-gray-400 text-sm">
                                    {mentionedUser.bio || mentionedUser.about}
                                  </p>
                                  <p className=" text-nowrap w-fit h-fit cursor-pointer  rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-center font-medium px-3 py-1">
                                    View profile
                                  </p>
                                </div>
                                {/* <div
                                  key={mentionedUser._id}
                                  className="flex  gap-5  w-full  rounded-xl transition-all bg-white justify-between"
                                >
                                  <div className="flex  justify-center   gap-3 w-fit">
                                    <UserImageInput
                                      imageHeight={45}
                                      image={
                                        mentionedUser.profileImage.originalImage[0]
                                      }
                                      isEditable={false}
                                    />
                                    <div className="">
                                      <div className="flex gap-1 text-wrap truncate max-w-full line-clamp-1 items-center">
                                        <p className=" text-gray-800  font-medium truncate line-clamp-1 max-w-full text-wrap">
                                          {mentionedUser.personal_details
                                            ? `${mentionedUser.personal_details.firstname} ${mentionedUser.personal_details.lastname}`
                                            : mentionedUser.company_details
                                                ?.company_name}
                                        </p>

                                        {"  "}
                                        <span className="font-bold px-0.5">
                                          ·
                                        </span>
                                        {"  "}
                                        <p className="text-gray-500 ">
                                          @{mentionedUser.username}
                                        </p>
                                      </div>
                                      <p className="truncate text-sm text-gray-400 line-clamp-2 text-wrap">
                                        {mentionedUser.about || mentionedUser.bio}
                                      </p>
                                    </div>
                                  </div>
                                  <p className=" text-nowrap w-fit h-fit cursor-pointer  rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-center font-medium px-3 py-1">
                                    View profile
                                  </p>
                                </div> */}
                              </span>
                            );
                          }
                        }

                        // Render regular text segments
                        return <span key={index}>{segment}</span>;
                      })}
                    </p>

                    {/* {post.mentions.length > 0 &&
                      !post.images &&
                      post.post_type !== "job" && (
                        // <svg
                        //   onClick={(e) => {
                        //     e.stopPropagation();
                        //     setPostMentions(post.mentions);
                        //   }}
                        //   xmlns="http://www.w3.org/2000/svg"
                        //   width="30"
                        //   height="30"
                        //   fill="currentColor"
                        //   class="bi bi-person-fill border rounded-full p-1.5"
                        //   viewBox="0 0 16 16"
                        // >
                        //   <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        // </svg>

                        <div
                          // onClick={() => handleRemoveImage(image)}
                          className="absolute bottom-11 right-4  cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostMentions(post.mentions);
                          }}
                        >
                          <div className="absolute w-10 h-10 -top-[3px] -right-[4px] bg-black opacity-45 rounded-full"></div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="h-4 w-4 text-gray-100  absolute top-[9px] right-2 z-10"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                        </div>
                      )} */}
                  </div>
                  {post.images && (
                    <div
                      style={{ overflowX: "auto", scrollbarWidth: "none" }}
                      className="mt-2 flex mb-4 flex-col relative w-full  transition-all  duration-300 overflow-x-auto flex-1"
                    >
                      {post.images && (
                        <ImageCarousel
                          dots={false}
                          edges=""
                          className="h-full  flex-grow w-full "
                          gap={2}
                          images={post.images?.originalImage}
                        />
                      )}
                      {post.mentions.length > 0 && (
                        // <svg
                        //   onClick={(e) => {
                        //     e.stopPropagation();
                        //     setPostMentions(post.mentions);
                        //   }}
                        //   xmlns="http://www.w3.org/2000/svg"
                        //   width="30"
                        //   height="30"
                        //   fill="currentColor"
                        //   class="bi bi-person-fill border rounded-full p-1.5"
                        //   viewBox="0 0 16 16"
                        // >
                        //   <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        // </svg>

                        <div
                          // onClick={() => handleRemoveImage(image)}
                          className="absolute bottom-12 right-4 z-10  cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostMentions(post.mentions);
                          }}
                        >
                          <div className="absolute w-10 h-10 -top-[3px] -right-[4px] bg-black opacity-80 rounded-full"></div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="h-4 w-4 text-gray-100  absolute top-[9px] right-2 z-10"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                  {post.post_type === "job" && (
                    <div
                      style={{
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        scrollSnapType: "x mandatory",
                        scrollBehavior: "smooth",
                        display: "flex",
                      }}
                      className="relative w-full flex flex-col"
                    >
                      {/* {post.mentions.length > 0 &&
                        !post.images &&
                        post.post_type === "job" && (
                          // <svg
                          //   onClick={(e) => {
                          //     e.stopPropagation();
                          //     setPostMentions(post.mentions);
                          //   }}
                          //   xmlns="http://www.w3.org/2000/svg"
                          //   width="30"
                          //   height="30"
                          //   fill="currentColor"
                          //   class="bi bi-person-fill border rounded-full p-1.5"
                          //   viewBox="0 0 16 16"
                          // >
                          //   <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          // </svg>

                          <div
                            // onClick={() => handleRemoveImage(image)}
                            className="absolute top-10 right-4  cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPostMentions(post.mentions);
                            }}
                          >
                            <div className="absolute w-10 h-10 -top-[3px] -right-[4px] bg-black opacity-45 rounded-full"></div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="h-4 w-4 text-gray-100  absolute top-[9px] right-2 z-10"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg>
                          </div>
                        )} */}
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          scrollbarWidth: "none",
                          scrollSnapType: "x mandatory",
                          scrollBehavior: "smooth",
                        }}
                        className={`flex overflow-x-auto ${
                          post.jobs.length > 1 && "pl-[43px]"
                        } mt-4`}
                      >
                        {post.post_type === "job" &&
                          post.jobs.map((job) => {
                            const logoLetter = job.company_name
                              ?.charAt(0)
                              .toUpperCase();
                            return (
                              <div
                                key={job._id}
                                style={{
                                  flex: "0 0 auto", // Ensure items do not shrink
                                  scrollSnapAlign: "start", // Snap to the start of each item
                                  minWidth: "100%", // Ensure items take full width
                                }}
                                onClick={(e) => {
                                  window.open("/job/" + job._id, "_blank");
                                  e.stopPropagation();
                                }}
                                className="mt-2 border p-5 w-full rounded-2xl flex flex-col justify-between flex-shrink-0"
                              >
                                <div>
                                  <div className="flex gap-4">
                                    <p className="bg-pink-950 text-white font-bold text-3xl -ml-px rounded-full flex items-center justify-center min-w-14 w-14 h-14">
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
                                  <p className="text-sm mt-2 line-clamp-3 max-w-fit text-wrap truncate">
                                    {job.description}
                                  </p>
                                </div>
                                <a
                                  href={job.job_url}
                                  target="_blank"
                                  aria-label={`Apply for ${job.job_role} at ${job.company_name}`}
                                  className="bg-blue-500 rounded-lg w-full px-4 py-2 pb-3 flex items-center sticky  justify-center text-xl font-bold text-white mt-4"
                                >
                                  Apply
                                </a>
                              </div>
                            );
                          })}
                      </div>
                      {/* <div className="flex gap-4 text-gray-400 items-center  mt-2">
                    <LikeButton postData={post} setPostData={setPostData} />
                    <CommentButton postData={post} setPostData={setPostData} />
                  </div> */}
                    </div>
                  )}
                  <div className="flex gap-4 z-10   justify-between text-gray-400 font-normal items-center  mt-4">
                    <div className="flex gap-4">
                      <LikeButton
                        postData={post}
                        likes={post.likes}
                        likesCount={post.likes_count}
                      />
                      <CommentButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setCommentButtonClicked((prev) =>
                            prev == index ? null : index
                          );
                        }}
                        postData={post}
                        // setPostData={setPostData}
                      />
                    </div>

                    {/* <div className="absolute w-5 h-5 -top-[3px] -right-[4px] bg-black opacity-45 rounded-full"></div> */}
                    {post.mentions.length > 0 && (
                      <svg
                        onClick={(e) => {
                          e.stopPropagation();
                          setPostMentions(post.mentions);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="h-6 w-6 text-gray-800 border p-1 rounded-full border-gray-800    right-2 z-10"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg>
                    )}
                  </div>
                  {post.comments_count > 0 && (
                    <div className=" text-sm z-10">
                      <div
                        className={`relative flex gap-2  transition-all items-center rounded-xl  overflow-hidden mt-2 `}
                      >
                        <UserImageInput
                          className=" rounded-full"
                          imageHeight={20}
                          imageBorder={0}
                          image={
                            post.user.profileImage?.compressedImage ||
                            profileImageDefault
                          }
                          alt={`${post.username}'s avatar`}
                          isEditable={false}
                        />
                        <p
                          value={commentText}
                          // onBlur={() => setCommentButtonClicked(null)}
                          className={`rounded-xl  outline-none  flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300`}
                        >
                          {
                            post.comments.find(
                              (comment) => comment.user == post.user._id
                            )?.comment_text
                          }
                        </p>
                        {post.comments_count > 1 && (
                          <p className="text-gray-400 z-10">
                            +{post.comments_count - 1}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div
                    id="commentInput"
                    className={`relative flex border gap-2 px-2 py-1.5  rounded-full transition-all items-center overflow-hidden ${
                      commentButtonClicked === index
                        ? " opacity-100 mt-4"
                        : "-mt-14 opacity-0 pointer-events-none "
                    } `}
                  >
                    <UserImageInput
                      className=" rounded-full -mt-px"
                      imageHeight={35}
                      imageBorder={0}
                      image={
                        currentUser.profileImage?.compressedImage ||
                        profileImageDefault
                      }
                      alt={`${post.username}'s avatar`}
                      isEditable={false}
                    />
                    <div className="flex w-full">
                      <input
                        id={post._id + "commentText"}
                        key={post._id + "commentText"}
                        autoFocus={commentButtonClicked === index}
                        value={
                          commentText?.index == index ? commentText?.text : ""
                        }
                        onChange={(e) => {
                          setcommentText({
                            index: index,
                            text: e.target.value,
                          });
                        }}
                        style={{
                          WebkitAutofill: "number",
                          WebkitBoxShadow: "0 0 0px 1000px white inset",
                        }}
                        disabled={sendClicked}
                        // onBlur={() => setCommentButtonClicked(null)}
                        className={`rounded-xl text-sm bg-white placeholder:text-sm outline-none py-2 flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300`}
                        placeholder={`Comment on @${post.user.username}`}
                      />
                      <svg
                        id="sendBtn"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        ref={sendBtnRef}
                        className={`bi bi-send-fill  text-blue-500 absolute top-[30%] rotate-45 right-5 ${
                          sendClicked === index ? "send-animation" : ""
                        }`}
                        viewBox="0 0 16 16"
                        onAnimationEnd={() => {
                          setcommentText(null);
                          setSendClicked(false);
                          handleAnimationEnd();
                          // if (
                          //   post.comments.some(
                          //     (comment) => comment.user == userDetails._id
                          //   )
                          // ) {

                          //   const commentInput =
                          //     document.getElementById("commentInput");

                          //   if (commentInput) {
                          //     commentInput.classList.add(
                          //       "-mt-8",
                          //       "opacity-0"
                          //     ); // Hide the input field
                          //   }
                          // }
                          setPostData((prevPosts) =>
                            prevPosts.map((post, i) =>
                              i === index
                                ? {
                                    ...post,
                                    comments_count: post.comments_count + 1,
                                    comments: [
                                      ...post.comments,
                                      {
                                        user: userDetails._id,
                                        comment_text: commentText.text,
                                      },
                                    ],
                                  }
                                : post
                            )
                          );
                        }}
                        onClick={() => {
                          if (commentText?.text.length > 0) {
                            handleSendClick(index);
                          }
                        }}
                      >
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      )}
    </div>
  );
}

export default Posts;
