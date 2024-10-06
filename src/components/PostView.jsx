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

function PostView({ postId = useParams().postId, index, className }) {
  const [commentButtonClicked, setCommentButtonClicked] = useState(null);
  const [sendClicked, setSendClicked] = useState(null);
  const [commentText, setcommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [comments, setcomments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [savedList, setSavedList] = useState([]);
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

    setcomments((prev) => ({
      ...prev,
      response,
    }));
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
        saved_content: {_id:postId},
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
      className={`${className}  flex justify-center w-screen max-w-screen-lg  gap-8 -mt-5`}
    >
      {post && (
        <div
          key={index}
          className="w-full sm:w-1/2 relative sm:border-x h-fit bg-white border-gray-300 py-4"
        >
          <p className="py-3 px-4 sticky -top-5 -mt-5 mb-5 left-0 right-0 bg-white z-40 font-bold text-2xl  border-gray-300">
            Post
          </p>{" "}
          <div className="flex items-center px-4 justify-between">
            <div className="flex gap-2 items-center">
              <UserImageInput
                className="w-[35px] h-[35px] rounded-full"
                imageHeight={35}
                imageBorder={1}
                image={
                  post?.user.profileImage?.compressedImage ||
                  profileImageDefault
                }
                alt={`${post?.user.username}'s avatar`}
                isEditable={false}
              />
              <div className="flex gap-2 items-center ">
                <p className="font-medium text-sm">{post?.user.username}</p>
                <p className="text-sm text-gray-400">
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
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {savedList.some((item) => item.saved_content?._id == post._id) ? (
                <svg
                  onClick={(e) => {
                    unsavePost(post._id);
                    e.stopPropagation();
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-bookmark-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
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
              <svg
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
          <p className="mt-4 px-4 text-sm flex-1">{post.content}</p>
          {post.post_type !== "job" && (
            <div
              style={{ overflowX: "auto", scrollbarWidth: "none" }}
              className="mt-2 px-4 flex flex-col transition-all duration-300 overflow-x-auto flex-1"
            >
              {post.images && (
                <ImageCarousel
                  dots={false}
                  edges="rounded-lg"
                  className="h-full flex-1 "
                  gap={2}
                  images={post.images?.originalImage}
                />
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
          <div className="flex gap-4 z-10 px-4 text-gray-400 font-normal items-center  mt-2">
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
          <div
            id="commentInput"
            className={` bg-white z-40 px-4  py-2 sticky top-[31px] border-b flex gap-2 transition-all items-center overflow-hidden ${" opacity-100"} `}
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
          <div className="pb-10 sm:pb-0">
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

                          setcomments((prev) => ({
                            ...prev,
                            response,
                          }));
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
      <div className="hidden sm:block">Releted Posts</div>
    </div>
  );
}

export default PostView;
