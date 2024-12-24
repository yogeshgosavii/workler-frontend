import React, { useEffect, useRef, useState } from "react";
import UserImageInput from "./Input/UserImageInput";
import profileImageDefault from "../assets/user_male_icon.png";
import { formatDistanceToNow } from "date-fns";
import ImageCarousel from "./ImageCarousel";
import LikeButton from "./Button/LikeButton";
import CommentButton from "./Button/CommentButton";
import { useSelector } from "react-redux";
import {
  addComment,
  addReply,
  getCommentsByPostId,
  getLikesByPostId,
  getPostById,
  getReplies,
} from "../services/postService";
import { useNavigate, useParams } from "react-router-dom";
import savedService from "../services/savedService";
import UserPostUpdateSettings from "./UserPostUpdateSettings";
import PostMentionList from "./PostMentionList";
import CommentSettings from "./CommentSettings";
import ReplySetting from "./ReplySetting";
import PostTextArea from "./Input/PostTextArea";

function PostView({ postId = useParams().postId, index, className }) {
  const [commentButtonClicked, setCommentButtonClicked] = useState(null);
  const [showReplies, setShowReplies] = useState(null);
  const [newReply, setnewReply] = useState(null);
  const [replies, setReplies] = useState([]);
  const [sendClicked, setSendClicked] = useState(null);
  const [commentText, setcommentText] = useState("");
  const [replyText, setReplyText] = useState({
    index: null,
    text: "",
    mentions: [],
  });
  const [comments, setcomments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [postSettings, setPostSettings] = useState(null);
  const [postMentions, setPostMentions] = useState(null);
  const [replyLoading, setReplyLoading] = useState(null);
  const [post, setPost] = useState();
  const [commentSetting, setCommentSetting] = useState(null);
  const [replySetting, setReplySetting] = useState(null);
  const [tab, setTab] = useState("comments");
  const [mentionList, setMentionList] = useState([]);
  const [isTextEmpty, setIsTextEmpty] = useState([]);
  const [loading, setLoading] = useState(true);

  const sendBtnRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      const updatedPosts = await getPostById(postId);

      setPost(updatedPosts);
    };

    const fetchComments = async () => {
      const comments = await getCommentsByPostId(postId);

      setcomments(comments);
    };

    const fetchLikes = async () => {
      const likes = await getLikesByPostId(postId);
      setLikes(likes);
    };

    fetchPostData();
    fetchComments();
    fetchLikes();
    setLoading(false);
  }, [postId]); // Empty dependency array means this effect runs only once when the component mounts

  useEffect(() => {
    const fetchReplies = async () => {
      // Avoid fetching if `newReply` is null or replies already fetched
      setReplies([]);
      setReplyLoading(showReplies); // Show spinner for the specific comment
      try {
        const response = await getReplies(showReplies);
        setReplies(response);
      } catch (error) {
        console.error("Failed to fetch replies:", error);
      } finally {
        setReplyLoading(null); // Remove loading state after fetch
      }
    };

    fetchReplies();
  }, [showReplies]);

  const handleSendClick = async (index) => {
    setSendClicked(index);
    setcommentText("");
    const response = await addComment({
      post: postId,
      user: currentUser._id,
      content: commentText,
      mentions: mentionList,
    });
    setPost((prev) => ({
      ...prev,
      comments_count: prev.comments_count + 1,
    }));
    response.user = currentUser;
    setcomments((prev) => [...prev, response]);
    // setPost((prev) => ({
    //   ...prev,
    //   comments: [
    //     ...prev.comments,
    //     {
    //       user: currentUser._id,
    //       comment_text: commentText,
    //     },
    //   ],
    // }));
    setcommentText("");
  };

  useEffect(() => {
    const getSaveds = async () => {
      const savedResponse = await savedService.getSpecificSaved("post");
      setSavedList(savedResponse);
    };

    getSaveds();
  }, [postId]); // Empty dependency array means this effect runs only once when the component mounts

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

  const handleAnimationEnd = () => {
    document.getElementById("sendBtn").classList.add("hidden");
  };
  if (loading || !post) {
    return (
      <div className=" pb-14 pt-10">
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
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} w-full  flex justify-center  min-h-screen    gap-14 `}
    >
      {post && (
        <div
          key={index}
          className="w-full sm:max-w-xl relative bg-white min:h-screen  sm:border-x "
        >
          <UserPostUpdateSettings
            setPostSetting={setPostSettings}
            postSettings={postSettings}
            // setPostData={setPostData}
            // postData={postData}
          />
          <PostMentionList
            showMentions={postMentions}
            setShowMentions={setPostMentions}
          />
          <CommentSettings
            setCommentSettings={setCommentSetting}
            commentSettings={commentSetting}
            commentData={comments}
            setPost={setPost}
            setcommentData={setcomments}
          />
          <ReplySetting
            setCommentSettings={setReplySetting}
            commentSettings={replySetting}
            commentData={replies}
            setPost={setPost}
            setcommentData={setReplies}
          />
          <p className="py-3 px-4 sm:px-6 sticky top-0 mb-5 left-0 right-0 bg-white z-40 font-bold text-2xl  border-gray-300">
            Post
          </p>{" "}
          <div className="flex items-center px-4 sm:px-6 justify-between">
            <div
              onClick={() => {
                navigate("/user/" + post?.user._id);
              }}
              className="flex gap-4 items-center"
            >
              <UserImageInput
                className="w-[35px] -mt-1 h-[35px] rounded-full"
                imageHeight={40}
                imageBorder={1}
                image={
                  post?.user.profileImage?.compressedImage ||
                  profileImageDefault
                }
                alt={`${post?.user.username}'s avatar`}
                isEditable={false}
              />
              <div className="flex flex-col  ">
                {/* <p className="font-medium">
                  {post?.user.company_details
                    ? post?.user.company_details?.company_name
                    : `${post?.user.personal_details?.firstname} ${post?.user.personal_details?.lastname}`}
                </p>
                <p className="text-gray-400 text-sm">{post?.user.username}</p> */}
                <div className="flex flex-col  text-wrap truncate max-w-full line-clamp-1 items-center">
                  {/* {"  "}
                  <span className="font-bold px-0.5">·</span>
                  {"  "} */}
                  <p className=" text-gray-800 font-semibold text-lg truncate line-clamp-1 max-w-full text-wrap">
                    {post.user.personal_details
                      ? `${post.user.personal_details.firstname} ${post.user.personal_details.lastname}`
                      : post.user.company_details?.company_name}
                  </p>
                  <p className=" text-gray-400 -mt-1">@{post.user.username}</p>
                </div>
                {/* <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {}).split(
                    " "
                  )[0] != "about" &&
                    formatDistanceToNow(new Date(post.createdAt), {}).split(
                      " "
                    )[0]}
                  {formatDistanceToNow(new Date(post.createdAt), {})
                    .split(" ")[1]
                    .slice(0, 1)}
                  {formatDistanceToNow(new Date(post.createdAt), {})
                    ?.split(" ")[2]
                    ?.slice(0, 1)}
                </p> */}
              </div>
            </div>
            <div className="flex gap-2 items-center">
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
                onClick={() => {
                  setPostSettings(post);
                }}
                className="h-6 w-6 text-gray-500"
                width="26"
                height="26"
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
          <div className="relative mx-4 sm:mx-6">
            <p
              className={`mt-4 ${
                !post.images && post.post_type !== "job" && "flex-1 rounded-xl"
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
                      mentionedUser.profileImage?.originalImage?.[0] || "";

                    return (
                      <span
                        key={index}
                        className="text-blue-500 relative cursor-pointer group"
                        role="button"
                        tabIndex="0"
                        aria-label={`View profile of ${mentionedUser.username}`}
                      >
                        {segment}
                        {/* <div
                          className="absolute top-7 z-20 hidden items-start group-hover:flex  border bg-white shadow-lg px-8 pr-9  justify-center py-2 left-0 rounded-md"
                          role="tooltip"
                        >
                          <img
                            src={profileImage}
                            alt={`${mentionedUser.username}'s profile`}
                            className="w-8 h-8 mt-1 rounded-full"
                          />
                          <p className="ml-3 text-gray-800">
                            <p className="font-medium text-nowrap">
                              {mentionedUser.personal_details
                                ? mentionedUser.personal_details.firstname +
                                  " " +
                                  mentionedUser.personal_details.lastname
                                : mentionedUser.company_details.company_name}
                            </p>
                            <p className="text-sm text-gray-400 -mt-0.5">
                              {mentionedUser.username}
                            </p>
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
          {post.post_type !== "job" && (
            <div
              style={{ overflowX: "auto", scrollbarWidth: "none" }}
              className="mt-2 px-4 sm:px-6 flex flex-col  transition-all duration-300 overflow-x-auto flex-1"
            >
              {/* {post.images && (
                <ImageCarousel
                  dots={false}
                  edges="rounded-lg"
                  className="h-full flex-1 "
                  gap={2}
                  images={post.images?.originalImage}
                />
              )} */}
              {post.images && (
                <div
                  style={{ overflowX: "auto", scrollbarWidth: "none" }}
                  className="mt-2 flex mb-4 flex-col  relative h-full w-full  transition-all  duration-300 overflow-x-auto flex-1"
                >
                  {post.images && (
                    <ImageCarousel
                      dots={false}
                      edges=""
                      className="h-full flex-grow w-full "
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
              className="relative px-4 sm:px-6 mb-5 flex flex-col"
            >
              {post.mentions.length > 0 &&
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
                    className="absolute top-10 right-12  cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPostMentions(post.mentions);
                    }}
                  >
                    {/* <div className="absolute w-10 h-10 -top-[3px] -right-[4px] bg-black opacity-45 rounded-full"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="h-4 w-4 text-gray-100  absolute top-[9px] right-2 z-10"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg> */}
                  </div>
                )}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  scrollbarWidth: "none",
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                }}
                className={`flex px-4 overflow-x-auto ${
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
                        onClick={() => {
                          navigate("/job/" + job._id);
                        }}
                        style={{
                          flex: "0 0 auto", // Ensure items do not shrink
                          scrollSnapAlign: "start", // Snap to the start of each item
                        }}
                        className="mt-2 border p-5 w-full flex flex-col max-w-80 justify-between rounded-2xl flex-shrink-0"
                      >
                        <div className="flex gap-4">
                          <p className="bg-pink-950 text-white font-bold text-3xl -ml-px rounded-full flex items-center justify-center min-w-14 w-14 h-14">
                            {logoLetter}
                          </p>
                          <div>
                            <h3 className="font-bold text-2xl">
                              {job.job_role}
                            </h3>
                            <p className="text-gray-500">{job.company_name}</p>
                          </div>
                        </div>
                        {/* // <p className="text-sm mt-2 line-clamp-3 max-w-fit text-wrap truncate">
                        //   {job.description}
                        // </p> */}
                        <a
                          href={job.job_url}
                          target="_blank"
                          aria-label={`Apply for ${job.job_role} at ${job.company_name}`}
                          className="bg-blue-500 rounded-lg w-full px-4 py-2 pb-3 flex items-center justify-center text-xl font-bold text-white mt-4"
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
          <div className="flex justify-between z-10 px-4 sm:px-6 text-gray-400 font-normal items-center  mt-2">
            <div className="flex gap-4">
              <LikeButton
                postData={post}
                likes={likes}
                likesCount={post.likes_count}
              />
              <CommentButton
                onClick={() => {
                  setCommentButtonClicked((prev) =>
                    prev == index ? null : index
                  );
                }}
                comments={comments}
                postData={post}
                // setPostData={setPostData}
              />
            </div>
            <p className="">
              {/* Posted on{" "} */}
              {new Date(post.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              {"  "}
              <span className="font-bold px-0.5">·</span>
              {"  "}
              <span>
                {new Date(post.createdAt)
                  .toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .toUpperCase()}
              </span>
            </p>
          </div>
          <div className="flex gap-4 justify-between mt-2   px-4 sm:px-4 py-1">
            <div className="flex gap-4">
              <p
                onClick={() => setTab("likes")}
                className={`px-3 py-1 cursor-pointer bg rounded-lg font-medium border ${
                  tab === "likes"
                    ? "bg-gray-800 border-gray-800 text-white"
                    : "bg-white"
                }`}
              >
                Likes
              </p>
              <p
                onClick={() => setTab("comments")}
                className={`px-3 py-1 cursor-pointer rounded-lg font-medium border ${
                  tab === "comments"
                    ? "bg-gray-800 border-gray-800 text-white"
                    : "bg-white"
                }`}
              >
                Comments
              </p>
            </div>
            {post.mentions.length > 0 && (
              <div className="relative">
                <div
                  // onClick={() => handleRemoveImage(image)}
                  className="     cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPostMentions(post.mentions);
                  }}
                >
                  {/* <div className="absolute w-10 h-10 -top-[3px] -right-[4px] bg-black opacity-45 rounded-full"></div> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="h-8 w-8 border p-1.5 border-gray-800 rounded-full text-gray-800    z-10"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          {tab == "likes" && (
            <div>
              {likes.length > 0 ? (
                <div className="flex flex-col gap-3 px-4 pb-5 pt-5">
                  {likes.map((user) => (
                    <div
                      onClick={() => {
                        navigate("/user/" + user.user._id);
                      }}
                      className="flex gap-4   cursor-pointer"
                    >
                      <UserImageInput
                        imageHeight={35}
                        className={"border-none"}
                        imageBorder={0}
                        image={user.user.profileImage?.compressedImage[0]}
                        isEditable={false}
                      />
                      <div className="-mt-1">
                        {user.user.personal_details ? (
                          <p className=" font-medium ">
                            {user.user.personal_details?.firstname}{" "}
                            {user.user.personal_details?.lastname}
                          </p>
                        ) : (
                          <p className="font-medium">
                            {user.user.company_details?.company_name}
                          </p>
                        )}
                        <p className="text-sm text-gray-400 -mt-0.5">
                          @{user.user.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="max-w-xl pt-20 pb-20 text-center sm:h-full h-fit px-6 md:px-6">
                  <p className="text-2xl font-bold text-gray-500">
                    No likes Yet
                  </p>
                  <p className="mt-1 text-gray-400">
                    The likes one this post will be shown here
                  </p>
                </p>
              )}
            </div>
          )}
          {tab == "comments" && (
            <div>
              <div
                id="commentInput"
                className={` bg-white  z-40 px-4  py-2 sticky top-[42px] border-b flex gap-2 transition-all  ${" opacity-100"} `}
              >
                <UserImageInput
                  className=" rounded-full mt-0.5"
                  imageHeight={30}
                  imageBorder={0}
                  image={
                    currentUser.profileImage?.compressedImage ||
                    profileImageDefault
                  }
                  alt={`${post.username}'s avatar`}
                  isEditable={false}
                />
                <div className="flex w-full ">
                  {/* <input
                    id={post._id + "commentText"}
                    key={post._id + "commentText"}
                    autoFocus={commentButtonClicked === index}
                    value={commentText || ""}
                    onChange={(e) => {
                      setcommentText(e.target.value);
                    }}
                    style={{
                      WebkitAutofill: "number",
                      WebkitBoxShadow: "0 0 0px 1000px white inset",
                    }}
                    disabled={sendClicked}
                    // onBlur={() => setCommentButtonClicked(null)}
                    className={`rounded-xl text-sm bg-white  outline-none py-2 flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300`}
                    placeholder={`Comment on @${post.user.username}`}
                  /> */}
                  <PostTextArea
                    className=" ml-0"
                    placeholder={`Comment on @${post.user.username}`}
                    showRemainingLetters={false}
                    content={commentText}
                    setContent={setcommentText}
                    mentionList={mentionList}
                    setMentionList={setMentionList}
                    textIsEmpty={isTextEmpty}
                    settextIsEmpty={setIsTextEmpty}
                  />
                  <svg
                    id="sendBtn"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    ref={sendBtnRef}
                    className={`bi bi-send-fill  text-blue-500 absolute top-3.5 rotate-45 right-5 ${
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
                      // setPost((prevPosts) =>
                      //   prevPosts.map((post, i) =>
                      //     i === index
                      //       ? {
                      //           ...post,
                      //           comments_count: post.comments_count + 1,
                      //           comments: [
                      //             ...post.comments,
                      //             {
                      //               user: userDetails._id,
                      //               comment_text: commentText.text,
                      //             },
                      //           ],
                      //         }
                      //       : post
                      //   )
                      // );
                    }}
                    onClick={() => {
                      if (commentText?.length > 0) {
                        handleSendClick(index);
                      }
                    }}
                  >
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                  </svg>
                </div>
              </div>
              <div className="pb-14 sm:pb-0 h-full relative">
                {comments.length <= 0 && (
                  <p className="max-w-xl pt-14 pb-14  text-center sm:h-full  px-6 md:px-6">
                    <p className="text-2xl font-bold text-gray-500">
                      No Comments Yet
                    </p>
                    <p className="mt-1 text-gray-400">
                      The comments on this posts will be shown here
                    </p>
                  </p>
                )}
                {comments
                  ?.filter((comment) => !comment.parentComment)
                  .map((comment, index, arr) => (
                    <div
                      className={` text-sm px-4   ${
                        index > 0 && "border-t"
                      } py-5 z-10`}
                    >
                      <div>
                        {/* {comment.parentComment && (
                    <p className="text-gray-400">
                      Replied to {comment.parentComment.user.username}
                    </p>
                  )} */}
                        <div className="flex justify-between w-full">
                          <div
                            className={`relative  gap-2  transition-all items-center  overflow-hidden mt-2 `}
                          >
                            <div className="flex items-center gap-3">
                              <UserImageInput
                                className=" rounded-full"
                                imageHeight={25}
                                imageBorder={0}
                                image={
                                  comment.user.profileImage?.compressedImage ||
                                  profileImageDefault
                                }
                                alt={`${post.username}'s avatar`}
                                isEditable={false}
                              />
                              <p className="font-medium text-[15px] -mt-1">
                                {comment.user.username}{" "}
                                <span className="font-normal text-gray-500 text-sm">
                                  {" "}
                                  {"  "}
                                  <span className="font-bold px-0.5">·</span>
                                  {"  "}
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                  })}{" "}
                                </span>
                              </p>
                            </div>
                            {/* <p
                              value={comment.content}
                              // onBlur={() => setCommentButtonClicked(null)}
                              className={`rounded-xl  mt-2  outline-none  flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300`}
                            >
                              {comment.content}
                            </p> */}
                            <p
                              className={`mt-flex-1  relative 
              `}
                            >
                              {comment.content
                                .split(/(@\w+)/)
                                .map((segment, index) => {
                                  if (segment.startsWith("@")) {
                                    const mention = segment.slice(1); // Remove "@" from the mention
                                    console.log(
                                      "men",
                                      mention,
                                      comment.mentions
                                    );
                                    // Find the corresponding user in the mentions list
                                    const mentionedUser = comment.mentions.find(
                                      (user) => user.username === mention
                                    );

                                    if (mentionedUser) {
                                      const profileImage =
                                        mentionedUser.profileImage
                                          ?.originalImage?.[0] || "";

                                      return (
                                        <span
                                          key={index}
                                          className="text-blue-500 relative cursor-pointer group"
                                          role="button"
                                          onClick={() => {
                                            window.open(
                                              `/user/${mentionedUser._id}`
                                            );
                                          }}
                                          tabIndex="0"
                                          aria-label={`View profile of ${mentionedUser.username}`}
                                        >
                                          {segment}
                                          <div
                                            className="absolute top-7 z-20  items-start group-hover:flex  border bg-white shadow-lg px-8 pr-9  justify-center py-2 left-0"
                                            role="tooltip"
                                          >
                                            <img
                                              src={profileImage}
                                              alt={`${mentionedUser.username}'s profile`}
                                              className="w-8 h-8 mt-1 rounded-full"
                                            />
                                            <p className="ml-3 text-gray-800">
                                              <p className="font-medium text-nowrap">
                                                {mentionedUser.personal_details
                                                  ? mentionedUser
                                                      .personal_details
                                                      .firstname +
                                                    " " +
                                                    mentionedUser
                                                      .personal_details.lastname
                                                  : mentionedUser
                                                      .company_details
                                                      .company_name}
                                              </p>
                                              <p className="text-sm text-gray-400 -mt-0.5">
                                                {mentionedUser.username}
                                              </p>
                                            </p>
                                          </div>
                                        </span>
                                      );
                                    }
                                  }

                                  // Render regular text segments
                                  return <span key={index}>{segment}</span>;
                                })}
                            </p>
                          </div>
                          <svg
                            onClick={() => {
                              setCommentSetting(comment);
                            }}
                            className="h-6 w-6 text-gray-500   mt-3"
                            width="26"
                            height="26"
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
                        <div className="flex gap-4 z-10 px-1 text-gray-400 font-normal items-center  mt-2">
                          <LikeButton
                            postData={comment}
                            likes={comment}
                            likesCount={post.likes_count}
                          />
                          <CommentButton
                            onClick={() => {
                              console.log("click");

                              setCommentButtonClicked((prev) =>
                                prev == index ? null : index
                              );
                            }}
                            state="comment"
                            postData={comment}
                            comments={replies}
                            commentId={comment._id}
                            // setPostData={setPostData}
                          />
                        </div>
                        <div
                          id="commentInput"
                          className={`relative  w-full flex gap-2 transition-all  ${
                            commentButtonClicked === index
                              ? " opacity-100"
                              : "-mt-8 opacity-0 pointer-events-none n "
                          } `}
                        >
                          <UserImageInput
                            className=" rounded-full mt-1"
                            imageHeight={20}
                            imageBorder={0}
                            image={
                              currentUser.profileImage?.compressedImage ||
                              profileImageDefault
                            }
                            alt={`${post.username}'s avatar`}
                            isEditable={false}
                          />
                          <div className="flex w-full">
                            {/* <input
                              id={comment._id + "replyText"}
                              key={comment._id + "replyText"}
                              autoFocus={commentButtonClicked === index}
                              value={
                                replyText?.index === index
                                  ? replyText?.text
                                  : ""
                              } // Default to empty string if replyText is undefined
                              onChange={(e) => {
                                setReplyText({
                                  index: index,
                                  text: e.target.value,
                                });
                              }}
                              style={{
                                WebkitAutofill: "number",
                                WebkitBoxShadow: "0 0 0px 1000px white inset",
                              }}
                              disabled={sendClicked}
                              className=" text-sm  bg-white placeholder:text-sm outline-none py-2 flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300"
                              placeholder={`Reply on @${comment.user.username}`}
                            /> */}
                            <PostTextArea
                              showRemainingLetters={false}
                              className="ml-0 "
                              placeholder={`Reply on @${comment.user.username}`}
                              content={
                                replyText?.index === index
                                  ? replyText?.text
                                  : ""
                              }
                              setContent={(text) => {
                                console.log("replytex", replyText);

                                setReplyText((prev) => ({
                                  ...prev,
                                  index: index,
                                  text: text,
                                }));
                              }}
                              mentionList={replyText.mentions}
                              setMentionList={(mentionList) => {
                                console.log(
                                  "men2",
                                  mentionList,
                                  replyText.mentions
                                );

                                setReplyText((prev) => ({
                                  ...prev,
                                  mentions: mentionList,
                                }));
                              }}
                              textIsEmpty={isTextEmpty}
                              settextIsEmpty={setIsTextEmpty}
                            />

                            <svg
                              id="sendBtn"
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="currentColor"
                              ref={sendBtnRef}
                              className={`bi bi-send-fill  text-blue-500 absolute top-1 rotate-45 right-1 ${
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
                              }}
                              onClick={async () => {
                                if (replyText?.text.length > 0) {
                                  setSendClicked(index);
                                  setReplyText("");

                                  // Optimistically update comments count
                                  setPost((prev) => ({
                                    ...prev,
                                    comments_count: prev.comments_count + 1,
                                  }));

                                  try {
                                    // Make API call to add reply
                                    const response = await addReply({
                                      post: postId,
                                      user: currentUser._id,
                                      parentComment: comment._id,
                                      content: replyText.text,
                                      mentions: replyText.mentions,
                                    });

                                    // Create the new comment object, including user and parentComment details
                                    const newComment = {
                                      ...response,
                                      user: {
                                        _id: currentUser._id,
                                        username: currentUser.username,
                                        profileImage: currentUser.profileImage,
                                      },
                                      parentComment: {
                                        _id: comment._id,
                                        user: {
                                          _id: comment.user._id,
                                          username: comment.user.username,
                                          profileImage:
                                            comment.user.profileImage,
                                        },
                                      },
                                    };

                                    // Update comments state with new comment
                                    setcomments((prevComments) => [
                                      ...prevComments,
                                      newComment,
                                    ]);
                                    setReplyText(""); // Clear reply input field
                                  } catch (error) {
                                    console.error(
                                      "Failed to add reply:",
                                      error
                                    );

                                    // Revert the optimistic update for comments count if API call fails
                                    setPost((prev) => ({
                                      ...prev,
                                      comments_count: prev.comments_count - 1,
                                    }));
                                  }
                                }
                              }}
                            >
                              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-500 my-1 cursor-pointer">
                        {showReplies == comment._id ? (
                          <span
                            onClick={() =>
                              // setReplies((prev) => {
                              //   const updatedReplies = { ...prev };
                              //   delete updatedReplies[comment._id]; // Remove key to hide replies
                              //   return updatedReplies;
                              // })
                              setShowReplies(null)
                            }
                          >
                            Hide replies
                          </span>
                        ) : (
                          <span
                            onClick={() => {
                              setShowReplies(comment._id); // Trigger fetch by setting showReplies
                            }}
                          >
                            Show replies
                          </span>
                        )}

                        {replyLoading == comment._id && (
                          <svg
                            className="inline w-5 h-5 ml-3 -mt-1 text-transparent animate-spin fill-gray-400"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        )}
                      </p>

                      <div className="ml-8">
                        {showReplies == comment._id &&
                          replies?.map((reply) => (
                            <div>
                              <div className="flex justify-between w-full">
                                <div
                                  className={`relative  gap-2  transition-all items-center    mt-2 `}
                                >
                                  <div className="flex items-center gap-3">
                                    <UserImageInput
                                      className=" rounded-full"
                                      imageHeight={25}
                                      imageBorder={0}
                                      image={
                                        reply.user?.profileImage
                                          ?.compressedImage ||
                                        profileImageDefault
                                      }
                                      alt={`${post.username}'s avatar`}
                                      isEditable={false}
                                    />
                                    <p className="font-medium text-[15px] -mt-1">
                                      {reply.user?.username}{" "}
                                      <span className="font-normal text-gray-500 text-sm">
                                        {" "}
                                        {"  "}
                                        <span className="font-bold px-0.5">
                                          ·
                                        </span>
                                        {"  "}
                                        {new Date(
                                          reply.createdAt
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                        })}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  {/* <p
                                    value={reply.content}
                                    // onBlur={() => setCommentButtonClicked(null)}
                                    className={`rounded-xl  mt-2  outline-none  flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300`}
                                  >
                                    {reply.content}
                                  </p> */}
                                  <p className={`mt-flex-1  relative `}>
                                    {reply.content
                                      .split(/(@\w+)/)
                                      .map((segment, index) => {
                                        if (segment.startsWith("@")) {
                                          const mention = segment.slice(1); // Remove "@" from the mention
                                          console.log(
                                            "replymen",
                                            mention,
                                            reply.mentions
                                          );
                                          // Find the corresponding user in the mentions list
                                          const mentionedUser =
                                            reply.mentions.find(
                                              (user) =>
                                                user.username === mention
                                            );

                                          if (mentionedUser) {
                                            const profileImage =
                                              mentionedUser.profileImage
                                                ?.originalImage?.[0] || "";

                                            return (
                                              <span
                                                key={index}
                                                className="text-blue-500 relative cursor-pointer group"
                                                role="button"
                                                onClick={() => {
                                                  window.open(
                                                    `/user/${mentionedUser._id}`
                                                  );
                                                }}
                                                tabIndex="0"
                                                aria-label={`View profile of ${mentionedUser.username}`}
                                              >
                                                {segment}
                                                {/* <div
                                                  className="absolute top-7 z-20 hidden items-start group-hover:flex  border bg-white shadow-lg px-8 pr-9  justify-center py-2 left-0"
                                                  role="tooltip"
                                                >
                                                  <img
                                                    src={profileImage}
                                                    alt={`${mentionedUser.username}'s profile`}
                                                    className="w-8 h-8 mt-1 rounded-full"
                                                  />
                                                  <p className="ml-3 text-gray-800">
                                                    <p className="font-medium text-nowrap">
                                                      {mentionedUser.personal_details
                                                        ? mentionedUser
                                                            .personal_details
                                                            .firstname +
                                                          " " +
                                                          mentionedUser
                                                            .personal_details
                                                            .lastname
                                                        : mentionedUser
                                                            .company_details
                                                            .company_name}
                                                    </p>
                                                    <p className="text-sm text-gray-400 -mt-0.5">
                                                      {mentionedUser.username}
                                                    </p>
                                                  </p>
                                                </div> */}
                                              </span>
                                            );
                                          }
                                        }

                                        // Render regular text segments
                                        return (
                                          <span key={index}>{segment}</span>
                                        );
                                      })}
                                  </p>
                                </div>
                                <svg
                                  onClick={() => {
                                    setReplySetting(reply);
                                  }}
                                  className="h-6 w-6 text-gray-500   mt-3"
                                  width="26"
                                  height="26"
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
                              <div className="flex gap-4 z-10 px-1 text-gray-400 font-normal items-center  mt-2">
                                <LikeButton
                                  postData={reply}
                                  likes={reply}
                                  likesCount={post.likes_count}
                                />
                                <CommentButton
                                  onClick={() => {
                                    if (commentButtonClicked != reply._id) {
                                      setCommentButtonClicked(reply._id);
                                    } else {
                                      setCommentButtonClicked(null);
                                    }
                                  }}
                                  state="comment"
                                  postData={reply}
                                  // comments={comments}
                                  // setPostData={setPostData}
                                />
                              </div>
                              <div
                                id="replyInput"
                                className={`relative  w-full flex gap-2 transition-all  ${
                                  commentButtonClicked === reply._id
                                    ? " opacity-100"
                                    : "-mt-8 opacity-0 pointer-events-none "
                                } `}
                              >
                                <UserImageInput
                                  className=" rounded-full mt-1"
                                  imageHeight={20}
                                  imageBorder={0}
                                  image={
                                    currentUser.profileImage?.compressedImage ||
                                    profileImageDefault
                                  }
                                  alt={`${post.username}'s avatar`}
                                  isEditable={false}
                                />
                                <div className="flex w-full">
                                  {/* <input
                                    id={reply._id + "replyText"}
                                    key={reply._id + "replyText"}
                                    autoFocus={commentButtonClicked === index}
                                    value={
                                      replyText?.index == index
                                        ? replyText?.text
                                        : ""
                                    }
                                    onChange={(e) => {
                                      setReplyText({
                                        index: index,
                                        text: e.target.value,
                                      });
                                    }}
                                    style={{
                                      WebkitAutofill: "number",
                                      WebkitBoxShadow:
                                        "0 0 0px 1000px white inset",
                                    }}
                                    disabled={sendClicked}
                                    // onBlur={() => setCommentButtonClicked(null)}
                                    className={`rounded-xl text-sm bg-white placeholder:text-sm outline-none py-2 flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300`}
                                    placeholder={`Reply on @${reply.user.username}`}
                                  /> */}
                                  <PostTextArea
                                    placeholder={`Reply on @${reply.user?.username}`}
                                    className="ml-0"
                                    showRemainingLetters={false}
                                    content={
                                      replyText?.index === index
                                        ? replyText?.text
                                        : ""
                                    }
                                    setContent={(text) => {
                                      console.log("replytex", replyText);

                                      setReplyText((prev) => ({
                                        ...prev,
                                        index: index,
                                        text: text,
                                      }));
                                    }}
                                    mentionList={replyText.mentions}
                                    setMentionList={(mentionList) => {
                                      console.log(
                                        "men2",
                                        mentionList,
                                        replyText.mentions
                                      );

                                      setReplyText((prev) => ({
                                        ...prev,
                                        mentions: mentionList,
                                      }));
                                    }}
                                    textIsEmpty={isTextEmpty}
                                    settextIsEmpty={setIsTextEmpty}
                                  />

                                  <svg
                                    id="sendBtn"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    ref={sendBtnRef}
                                    className={`bi bi-send-fill  text-blue-500 absolute top-1 rotate-45 right-1 ${
                                      sendClicked === index
                                        ? "send-animation"
                                        : ""
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
                                    }}
                                    onClick={async () => {
                                      if (replyText?.text.length > 0) {
                                        setSendClicked(index);

                                        // Optimistically update the comments count
                                        setPost((prevPost) => ({
                                          ...prevPost,
                                          comments_count:
                                            prevPost.comments_count + 1,
                                        }));

                                        try {
                                          // API call to add reply
                                          const response = await addReply({
                                            post: postId,
                                            user: currentUser._id,
                                            parentComment: comment._id,
                                            content: replyText.text,
                                            mentions : replyText.mentions
                                          });

                                          // Create new comment structure with user details
                                          const newComment = {
                                            ...response,
                                            user: {
                                              _id: currentUser._id,
                                              username: currentUser.username,
                                              profileImage:
                                                currentUser.profileImage,
                                            },
                                            parentComment: {
                                              _id: comment._id,
                                              user: {
                                                _id: comment.user._id,
                                                username: comment.user.username,
                                                profileImage:
                                                  comment.user.profileImage,
                                              },
                                            },
                                          };

                                          // Append the new comment to comments list with functional update
                                          setcomments((prevComments) => [
                                            ...prevComments,
                                            newComment,
                                          ]);

                                          setReplies((prev) => [
                                            ...prev,
                                            newComment,
                                          ]);

                                          // Clear the reply text after successful update
                                          setReplyText("");
                                        } catch (error) {
                                          console.error(
                                            "Failed to add reply:",
                                            error
                                          );

                                          // Revert optimistic comments count increment if API fails
                                          setPost((prevPost) => ({
                                            ...prevPost,
                                            comments_count:
                                              prevPost.comments_count - 1,
                                          }));
                                        }
                                      }
                                    }}
                                  >
                                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
      {!loading && comments && post && (
        <div className="hidden lg:block">
          <div className=" sticky top-5  mt-5  flex-col gap-5 ">
            <div className=" bg-white py-4 pt-0 max-h-96  overflow-y-auto px-2 border max-w-2xl w-[500px]">
              <p className="text-lg font-semibold z-20 mb-2 py-3 pt-5 sticky top-0 bg-white px-4">
                Releated Accounts
              </p>
              <div
                className="flex flex-col gap-6 max-w-full overflow-x-auto py-2 px-4"
                style={{ scrollbarWidth: "none" }}
              >
                {comments.length > 0 &&
                  comments
                    .filter(
                      (comment, index, self) =>
                        comment.user?._id !== currentUser?._id &&
                        self.findIndex(
                          (c) => c.user?._id === comment.user?._id
                        ) === index
                    )
                    .map((comment) => (
                      <div
                        key={comment.user?._id}
                        className="flex  gap-5  w-full rounded-xl transition-all bg-white justify-between"
                      >
                        <div className="flex  justify-center   gap-3 w-fit">
                          <UserImageInput
                            imageHeight={45}
                            image={comment.user?.profileImage.originalImage[0]}
                            isEditable={false}
                          />
                          <div className="">
                            <div className="flex gap-1 text-wrap truncate max-w-full line-clamp-1 items-center">
                              <p className=" text-gray-800  font-medium truncate line-clamp-1 max-w-full text-wrap">
                                {comment.user?.personal_details
                                  ? `${comment?.user.personal_details.firstname} ${comment.user?.personal_details.lastname}`
                                  : comment.user?.company_details?.company_name}
                              </p>

                              {"  "}
                              <span className="font-bold px-0.5">·</span>
                              {"  "}
                              <p className="text-gray-500 ">
                                @{comment.user?.username}
                              </p>
                            </div>
                            <p className="truncate text-sm text-gray-400 line-clamp-2 text-wrap">
                              {comment.user?.about || comment.user?.bio}
                            </p>
                          </div>
                        </div>
                        <p className=" text-nowrap w-fit h-fit cursor-pointer  rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-center font-medium px-3 py-1">
                          View profile
                        </p>
                      </div>
                    ))}
                {post.mentions?.length > 0 &&
                  post.mentions
                    .filter(
                      (mention, index, self) =>
                        mention?._id !== currentUser._id &&
                        !comments.some(
                          (comment) => comment._id != mention._id
                        ) &&
                        self.findIndex((c) => c._id === mention._id) === index
                    )
                    .map((mention) => (
                      <div
                        key={mention._id}
                        className="flex  gap-5  w-full rounded-xl transition-all bg-white justify-between"
                      >
                        <div className="flex  justify-center   gap-3 w-fit">
                          <UserImageInput
                            imageHeight={45}
                            image={mention.profileImage.originalImage[0]}
                            isEditable={false}
                          />
                          <div className="">
                            <div className="flex gap-1 text-wrap truncate max-w-full line-clamp-1 items-center">
                              <p className=" text-gray-800  font-medium truncate line-clamp-1 max-w-full text-wrap">
                                {mention.personal_details
                                  ? `${mention.personal_details.firstname} ${mention.personal_details.lastname}`
                                  : mention.company_details?.company_name}
                              </p>

                              {"  "}
                              <span className="font-bold px-0.5">·</span>
                              {"  "}
                              <p className="text-gray-500 ">
                                @{mention.username}
                              </p>
                            </div>
                            <p className="truncate text-sm text-gray-400 line-clamp-2 text-wrap">
                              {mention.about || mention.bio}
                            </p>
                          </div>
                        </div>
                        <p className=" text-nowrap w-fit h-fit cursor-pointer  rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-center font-medium px-3 py-1">
                          View profile
                        </p>
                      </div>
                    ))}
                {comments.filter(
                  (comment, index, self) =>
                    comment.user?._id !== currentUser._id &&
                    self.findIndex((c) => c.user?._id === comment.user?._id) ===
                      index
                ).length <= 0 &&
                  post.mentions.filter(
                    (mention, index, self) =>
                      mention?._id !== currentUser._id &&
                      !comments.includes(mention) &&
                      self.findIndex((c) => c._id === mention._id) === index
                  ).length <= 0 && (
                    <div className="text-gray-400">
                      <p className="font-medium text-xl text-gray-400">
                        No related accounts
                      </p>
                      <p className="leading-tight mt-1 text-sm">
                        The account that are related to the post like comments
                        and mentions are shown here{" "}
                      </p>
                    </div>
                  )}
              </div>
              {/* <div
              className="flex flex-col gap-6 max-w-full overflow-x-auto py-2 px-4"
              style={{ scrollbarWidth: "none" }}
            >
              {likes.length > 0 &&
                likes
                  .filter(
                    (like, index, self) =>
                      like.user._id !== currentUser._id &&
                    comments.includes(like.user) &&
                      self.findIndex((c) => c.user._id === like.user._id) ===
                        index
                  )
                  .map((like) => (
                    <div
                      key={like.user._id}
                      className="flex  gap-5  w-full rounded-xl transition-all bg-white justify-between"
                    >
                      <div className="flex  justify-center   gap-3 w-fit">
                        <UserImageInput
                          imageHeight={45}
                          image={like.user.profileImage.originalImage[0]}
                          isEditable={false}
                        />
                        <div className="">
                          <div className="flex gap-1 text-wrap truncate max-w-full line-clamp-1 items-center">
                            <p className="text-gray-800 text-lg font-medium ">
                              @{like.user.username}
                            </p>
                            {"  "}
                            <span className="font-bold px-0.5">·</span>{"  "}
                            <p className=" text-gray-500 truncate line-clamp-1 max-w-full text-wrap">
                              {like.user.personal_details
                                ? `${like.user.personal_details.firstname} ${like.user.personal_details.lastname}`
                                : like.user.company_details?.company_name}
                            </p>
                          </div>
                          <p className="truncate text-sm text-gray-400 line-clamp-2 text-wrap">
                            {like.user.about || like.user.bio}
                          </p>
                        </div>
                      </div>
                      <p className=" text-nowrap w-fit h-fit cursor-pointer  rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-center font-medium px-3 py-1">
                        View profile
                      </p>
                    </div>
                  ))}
            </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostView;
