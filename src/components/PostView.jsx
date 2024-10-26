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
} from "../services/postService";
import { useParams } from "react-router-dom";
import savedService from "../services/savedService";
import UserPostUpdateSettings from "./UserPostUpdateSettings";
import PostMentionList from "./PostMentionList";

function PostView({ postId = useParams().postId, index, className }) {
  const [commentButtonClicked, setCommentButtonClicked] = useState(null);
  const [sendClicked, setSendClicked] = useState(null);
  const [commentText, setcommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [comments, setcomments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [postSettings, setPostSettings] = useState(null);
  const [postMentions, setPostMentions] = useState(null);
  const [post, setPost] = useState();
  const sendBtnRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);
  console.log(post);

  useEffect(() => {
    const fetchPostData = async () => {
      const updatedPosts = await getPostById(postId);
      setPost(updatedPosts);
    };

    const fetchComments = async () => {
      const comments = await getCommentsByPostId(postId);
      console.log("comments", comments);

      setcomments(comments);
    };

    const fetchLikes = async () => {
      const likes = await getLikesByPostId(postId);
      setLikes(likes);
    };

    fetchPostData();
    fetchComments();
    fetchLikes();
  }, [postId]); // Empty dependency array means this effect runs only once when the component mounts

  const handleSendClick = async (index) => {
    setSendClicked(index);
    // console.log(postData[index]);
    setcommentText("");
    const response = await addComment({
      post: postId,
      user: currentUser._id,
      content: commentText,
    });
    console.log("commentRes:", response);
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
      console.log("saveds", savedResponse);
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
    console.log("saved data:", response);
  };

  const unsavePost = async (postId) => {
    setSavedList(savedList.filter((post) => post.saved_content._id != postId));
    const response = await savedService.unsave(postId);
    console.log("unsaved data:", response);
  };

  const handleAnimationEnd = () => {
    document.getElementById("sendBtn").classList.add("hidden");
  };
  return (
    <div
      className={`${className}  flex justify-center  h-screen w-screen max-w-screen-lg  gap-8 `}
    >
      {post && (
        <div
          key={index}
          className="w-full sm:w-1/2 relative sm:border-x h-fit bg-white border-gray-300 "
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
          <p className="py-3 px-4 sticky top-0 mb-5 left-0 right-0 bg-white z-40 font-bold text-2xl  border-gray-300">
            Post
          </p>{" "}
          <div className="flex items-center px-4 justify-between">
            <div className="flex gap-4 items-center">
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
                <p className="font-medium">
                  {post?.user.company_details
                    ? post?.user.company_details?.company_name
                    : `${post?.user.personal_details?.firstname} ${post?.user.personal_details?.lastname}`}
                </p>
                <p className="text-gray-400 text-sm">{post?.user.username}</p>
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
             { currentUser._id != post.user._id && (savedList.some((item) => item.saved_content?._id == post._id) ? (
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
          <div className="relative mx-4">
            <p
              className={`mt-4 text-sm flex-1 ${
                !post.images && " border p-4 rounded-xl"
              }`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            {post.mentions.length > 0 && !post.images && (
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
            )}
          </div>
          {post.post_type !== "job" && (
            <div
              style={{ overflowX: "auto", scrollbarWidth: "none" }}
              className="mt-2 px-4 flex flex-col transition-all duration-300 overflow-x-auto flex-1"
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
              className="relative flex flex-col"
            >
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
                        style={{
                          flex: "0 0 auto", // Ensure items do not shrink
                          scrollSnapAlign: "start", // Snap to the start of each item
                          minWidth: "100%", // Ensure items take full width
                        }}
                        className="mt-2 border p-5 w-full rounded-2xl flex-shrink-0"
                      >
                        <div className="flex gap-4">
                          <p className="bg-pink-950 text-white font-bold text-3xl -ml-px rounded-full flex items-center justify-center w-14 h-14">
                            {logoLetter}
                          </p>
                          <div>
                            <h3 className="font-bold text-2xl">
                              {job.job_role}
                            </h3>
                            <p className="text-gray-500">{job.company_name}</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2 line-clamp-3 max-w-fit text-wrap truncate">
                          {job.description}
                        </p>
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
          <div className="flex justify-between z-10 px-4 text-gray-400 font-normal items-center  mt-2">
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
              at{" "}
              <span>
                {new Date(post.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </p>
          </div>
          <div
            id="commentInput"
            className={` bg-white z-40 px-4  py-2 sticky top-[42px] border-b flex gap-2 transition-all items-center overflow-hidden ${" opacity-100"} `}
          >
            <UserImageInput
              className=" rounded-full"
              imageHeight={20}
              imageBorder={0}
              image={
                currentUser.profileImage?.compressedImage || profileImageDefault
              }
              alt={`${post.username}'s avatar`}
              isEditable={false}
            />
            <div className="flex w-full">
              <input
                id={post._id + "commentText"}
                key={post._id + "commentText"}
                autoFocus={commentButtonClicked === index}
                value={commentText}
                onChange={(e) => {
                  setcommentText(e.target.value);
                  console.log(commentText);
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
                width="18"
                height="18"
                fill="currentColor"
                ref={sendBtnRef}
                className={`bi bi-send-fill  text-blue-500 absolute top-1/4 rotate-45 right-5 ${
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
          <div className="pb-14 sm:pb-0">
            {comments?.map((comment, index, arr) => (
              <div
                className={` text-sm px-4 ${index > 0 && "border-t"} py-5 z-10`}
              >
                {comment.parentComment && (
                  <p className="text-gray-400">
                    Replied to {comment.parentComment.user.username}
                  </p>
                )}
                <div
                  className={`relative  gap-2  transition-all items-center rounded-xl  overflow-hidden mt-2 `}
                >
                  <div className="flex gap-2">
                    <UserImageInput
                      className=" rounded-full"
                      imageHeight={20}
                      imageBorder={0}
                      image={
                        comment.user.profileImage?.compressedImage ||
                        profileImageDefault
                      }
                      alt={`${post.username}'s avatar`}
                      isEditable={false}
                    />
                    <p className="font-medium">{comment.user.username}</p>
                  </div>
                  <p
                    value={comment.content}
                    // onBlur={() => setCommentButtonClicked(null)}
                    className={`rounded-xl ml-5 mt-2  outline-none  flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300`}
                  >
                    {comment.content}
                  </p>
                </div>
                <div className="flex gap-4 z-10 px-4 ml-2 text-gray-400 font-normal items-center  mt-2">
                  <LikeButton
                    postData={comment}
                    likes={comment}
                    likesCount={post.likes_count}
                  />
                  <CommentButton
                    onClick={() => {
                      setCommentButtonClicked((prev) =>
                        prev == index ? null : index
                      );
                    }}
                    state="comment"
                    postData={comment}
                    // setPostData={setPostData}
                  />
                </div>
                <div
                  id="commentInput"
                  className={`relative flex gap-2 transition-all items-center overflow-hidden ${
                    commentButtonClicked === index
                      ? " opacity-100"
                      : "-mt-8 opacity-0 pointer-events-none "
                  } `}
                >
                  <UserImageInput
                    className=" rounded-full"
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
                    <input
                      id={comment._id + "replyText"}
                      key={comment._id + "replyText"}
                      autoFocus={commentButtonClicked === index}
                      value={replyText?.index == index ? replyText?.text : ""}
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
                      // onBlur={() => setCommentButtonClicked(null)}
                      className={`rounded-xl text-sm bg-white placeholder:text-sm outline-none py-2 flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300`}
                      placeholder={`Reply on @${comment.user.username}`}
                    />
                    <svg
                      id="sendBtn"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      ref={sendBtnRef}
                      className={`bi bi-send-fill  text-blue-500 absolute top-1/4 rotate-45 right-1 ${
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
                          // console.log(postData[index]);
                          setcommentText("");
                          const response = await addReply({
                            post: postId,
                            user: currentUser._id,
                            parentComment: comment._id,
                            content: replyText.text,
                          });
                          console.log("commentRes:", response);

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
      )}
      <div className="hidden sticky top-20 w-full mt-5 max-w-sm flex-col gap-5 lg:flex">
        <div className="border rounded-lg p-4">
          <p className="text-xl font-semibold mb-5">Releated Accounts</p>
          <div className="flex gap-5 justify-between items-center">
            <div className="flex gap-2">
              <UserImageInput isEditable={false} />
              <div className="">
                <p className="text-lg font-medium">Yogesh Gosavi</p>
                <p className="text-gray-400">yogesh_gosavii</p>
              </div>
            </div>
            <p className="bg-blue-500 h-fit rounded-full text-white font-medium px-3 py-1">
              Follow
            </p>
          </div>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-xl font-semibold">Similar Jobs</p>
        </div>
      </div>
    </div>
  );
}

export default PostView;
