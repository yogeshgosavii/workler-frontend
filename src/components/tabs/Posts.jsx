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
        <div className="flex flex-col">
          <div className="flex px-4 bg-white justify-between py-4 sm:border items-center">
            <p className="font-medium">Recent posts</p>
            <button
              onClick={() => setFormType("post")}
              className="text-blue-500 bg-blue-50 text-sm py-1 px-4 border rounded-full font-medium border-blue-500"
            >
              Add post
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
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
                        {
                          formatDistanceToNow(
                            new Date(post.createdAt),
                            {}
                          ).split(" ")[0]
                        }
                        {formatDistanceToNow(new Date(post.createdAt), {})
                          .split(" ")[1]
                          .slice(0, 1)}
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
                <p className="ml-[42px] -mt-4 text-sm flex-1">{post.content}</p>
                {post.post_type !== "job" && (
                  <div
                    style={{ overflowX: "auto", scrollbarWidth: "none" }}
                    className="mt-2 flex flex-col transition-all duration-300 overflow-x-auto flex-1"
                  >
                   {post.images && <ImageCarousel
                      dots={false}
                      edges="rounded-lg"
                      className="h-full flex-1 z-10"
                      gap={2}
                      images={post.images?.originalImage}
                    />}
                    <div className="flex gap-4 z-10 text-gray-400 font-normal items-center ml-[43px] mt-2">
                      <LikeButton postData={post} setPostData={setPostData} />
                      <CommentButton
                        onClick={() => handleCommentButtonClick(index)}
                        postData={post}
                        setPostData={setPostData}
                      />
                    </div>
                    {post.comments_count > 0 && (
                      <div className=" text-sm">
                        <div
                          className={`relative flex gap-2  transition-all items-center translate-x-10 rounded-xl w-[88%] overflow-hidden mt-2 `}
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
                        {/* {post.comments.map(
                          (comment) =>
                            comment.user == userDetails._id && (
                              <div
                                className={`relative flex gap-2  transition-all items-center translate-x-10 rounded-xl w-[88%] overflow-hidden mt-2 `}
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
                                    autoFocus={commentButtonClicked === index}
                                    value={commentText}
                                    onChange={(e) => {
                                      setcommentText(e.target.value);
                                    }}
                                    // onBlur={() => setCommentButtonClicked(null)}
                                    className={`rounded-xl text-sm outline-none  flex-grow pr-10 caret-blue-500 px-1 transition-all duration-300`}
                                    placeholder="Comments"
                                  >{comment.comment_text}</p>
                               
                              </div>
                            )
                        )} */}
                      </div>
                    )}
                    <div
                      id="commentInput"
                      className={`relative flex gap-2 transition-all items-center ml-[40px] overflow-hidden ${
                        commentButtonClicked === index
                          ? " opacity-100"
                          : "-mt-8 opacity-0"
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
                            setSendClicked(false)
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
                )}
                {post.post_type === "job" && (
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
                      className="flex gap-4 pl-[43px] mt-4 overflow-x-auto"
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
                    <div className="flex gap-4 text-gray-400 items-center ml-[43px] mt-2">
                      <LikeButton postData={post} setPostData={setPostData} />
                      <CommentButton
                        postData={post}
                        setPostData={setPostData}
                      />
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
