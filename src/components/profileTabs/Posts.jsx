import React, { useState, useRef } from "react";
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

function Posts({ setFormType, postData, setPostData, userDetails }) {
  const [commentButtonClicked, setCommentButtonClicked] = useState(null);
  const [sendClicked, setSendClicked] = useState(null);
  const [commentText, setcommentText] = useState("");
  const sendBtnRef = useRef(null);
  console.log(postData);

  const handleCommentButtonClick = (index) => {
    setCommentButtonClicked(commentButtonClicked === index ? null : index);
  };

  const handleSendClick = async (index) => {
    setSendClicked(index);
    console.log(postData[index]);

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
    <div className="w-full relative">
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
        <div className="flex flex-col sm:gap-4">
          <div className="sm:flex px-4 hidden  bg-white justify-between py-4 sm:border items-center">
            <p className="font-medium">Recent posts</p>
            <button
              onClick={() => setFormType("post")}
              className=" text-sm text-blue-500 px-4 py-1 bg-blue-50  rounded-full font-medium border-blue-500"
            >
              Add post
            </button>
          </div>
          <svg
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
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
            {postData.map((post, index) => (
              <div
                key={index}
                className={`border-b sm:border sm:shadow-xl h-fit bg-white border-gray-300 py-4 px-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
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
                        {formatDistanceToNow(
                          new Date(post.createdAt),
                          {}
                        ).split(" ")[0] != "about" &&
                          formatDistanceToNow(
                            new Date(post.createdAt),
                            {}
                          ).split(" ")[0]}
                        {formatDistanceToNow(new Date(post.createdAt), {})
                          .split(" ")[1]
                          .slice(0, 1)}
                        {formatDistanceToNow(new Date(post.createdAt), {})
                          ?.split(" ")[2]
                          ?.slice(0, 1)}
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
                <p className="mt-4 text-sm flex-1">{post.content}</p>
                {post.post_type !== "job" && (
                  <div
                    style={{ overflowX: "auto", scrollbarWidth: "none" }}
                    className="mt-2 flex flex-col transition-all duration-300 overflow-x-auto flex-1"
                  >
                    {post.images && (
                      <ImageCarousel
                        dots={false}
                        edges="rounded-lg"
                        className="h-full flex-1 z-10"
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
                      className="flex overflow-x-auto pl-[43px] mt-4"
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
                              className="mt-2 border p-5 rounded-2xl flex-shrink-0"
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
                              <p className="text-sm mt-2 line-clamp-3">
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
                <div className="flex gap-4 z-10 text-gray-400 font-normal items-center  mt-2">
                  <LikeButton postData={post} setPostData={setPostData} />
                  <CommentButton
                    onClick={() => {
                      setCommentButtonClicked((prev) =>
                        prev == index ? null : index
                      );
                    }}
                    postData={post}
                    setPostData={setPostData}
                  />
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
                          userDetails.profileImage?.compressedImage ||
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
                            (comment) => comment.user == userDetails._id
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
                      userDetails.profileImage?.compressedImage ||
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;
