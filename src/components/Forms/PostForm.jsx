import React, { useEffect, useRef, useState } from "react";
import imageService from "../../services/imageService.js"; // Adjust the import path as needed
import { createJobPost, createPost } from "../../services/postService"; // Adjust the import path as needed
import { useSelector } from "react-redux";
import UserImageInput from "../Input/UserImageInput.jsx";
import profileImageDefault from "../../assets/user_male_icon.png";
import OptionInput from "../Input/OptionInput.jsx";
import ImageCarousel from "../ImageCarousel.jsx";
import TextInput from "../Input/TextInput.jsx";
import UrlInput from "../Input/UrlInput.jsx";
import AddInput from "../Input/AddInput.jsx";
import useJobApi from "../../services/jobService.js";
import JobPost from "../JobList.jsx";
import authservice from "../../services/authService.js";
import JobList from "../JobList.jsx";
import DOMPurify from "dompurify";
import searchService from "../../services/searchService.js";
import { useNavigate } from "react-router-dom";
import PostTextArea from "../Input/PostTextArea.jsx";
import JobLinkDetails from "../Input/JobLinkDetails.jsx";

function PostForm({ userDetails,isCloseable = true ,showBackground = true, className , setData, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ content: "", images: [] });
  const [postType, setPostType] = useState("content");
  const [jobs, setJobs] = useState([]);
  const [selectMentions, setSelectMentions] = useState(false);
  const [showSelectMention, setShowSelectMention] = useState(false);
  const [mentionSecrchText, setMentionSecrchText] = useState("");
  const [mentionList, setmentionList] = useState([]);
  const [hashTags, setHashTags] = useState([]);
  const [mentionSearchList, setMentionSearchList] = useState([]);
  const [textIsEmpty, settextIsEmpty] = useState(true);
  const navigate = useNavigate();

  const jobService = useJobApi();
  const [tagsText, settagsText] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const textareaRef = useRef(null);
  console.log(user);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea(); // Resize on mount
  }, []);

  useEffect(() => {
    const fetchSearchedUser = async () => {
      const response = await searchService.searchByUsername(mentionSecrchText);
      setMentionSearchList(response);
    };

    fetchSearchedUser();
  }, [mentionSecrchText]);

  useEffect(() => {
    if (jobs.length == 0) {
      setPostType("content");
    }
    console.log(jobs);
  }, [jobs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value); // Sanitize input
    setFormData((prevState) => ({ ...prevState, [name]: sanitizedValue }));
  };

  const handleImageChange = (e) => {
    const remainingSlots = 10 - images.length;

    if (remainingSlots <= 0) {
      alert("You can only upload up to 10 images.");
      return;
    }

    // Slice the selected files to fit within the limit
    // const files = selectedFiles.slice(0, remainingSlots);
    const files = Array.from(e.target.files).slice(0, remainingSlots);

    setImages((prevImages) => [...prevImages, ...files]);
    setFormData((prevState) => ({ ...prevState, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    for (const mention of mentionList) {
      if (!formData.content.includes(mention)) {
        setmentionList((prevList) => prevList.filter(m => m !== mention));
      }
    }
    console.log(mentionList)
    

    const formDataToSend = new FormData();
    formDataToSend.append(
      "content",
      formData.content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold text** to <strong>
        .replace(/(?:\r\n|\r|\n)/g, "<br />")
    );

    if (mentionList.length > 0) {
      // Ensure you are mapping the mentions to their correct ObjectId format, not as a single string
      formDataToSend.append(
        "mentions",
        mentionList.map(user => user._id.toString()) // assuming user._id or user is a valid ObjectId
      );
    }
    
    
    images.forEach((image) => {
      formDataToSend.append("files", image);
    });

    try {
      if (postType === "content") {
        const data = await createPost(formDataToSend);
        // Example: update user details or handle response
        // const user = await authservice.updateUserDetails({...});
      } else {
        const response = await jobService.job.addMultiple(jobs);
        const jobIds = response.map((job) => job._id);

        const data = await createJobPost({
          content: formData.content,
          post_type: postType,
          jobs: jobIds,
        });
        // Example: update user details or handle response
        // const user = await authservice.updateUserDetails({...});
      }

      navigate("/profile", { replace: true });
      navigate(0);
      // Navigate after successful submission
      setFormData({ content: "", images: [] });
      setImages([]);
    } catch (error) {
      console.error(error);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showBackground && <div
        onClick={() => window.history.back()}
        className="fixed w-full h-full transition-all   top-0  inset-0  bg-background/95  backdrop-blur supports-[backdrop-filter]:bg-background/60     z-30  left-0"
      ></div>}
      <div className={`fixed w-full border  shadow-2xl sm:max-w-lg right-0 h-full z-50      bg-white top-0   overflow-y-auto ${className}`}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between h-full  min-w-full  gap-4 "
          encType="multipart/form-data"
        >
          <div className=" flex-1 -mt-4">
            <div className={`flex px-4 sm:px-6   sticky top-0 py-3 items-center bg-white   border-b  z-20 ${isCloseable ? "justify-between" : "justify-end"}`}> 
            { isCloseable && <svg
                class="h-8 w-8 text-gray-700 -ml-[1px]"
                onClick={() => {
                  window.history.back();
                }}
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
                <line x1="18" y1="6" x2="6" y2="18" />{" "}
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>}
              <div className="flex justify-self-end gap-4">
                <div className="relative rounded-full bg-gray-50 px-2 gap-4 flex min-w-[80px] w-16 justify-between py-1  items-center ">
                  <div className="w-full flex justify-center ">
                    <svg
                      class={`h-5 w-5 z-10 ${
                        postType == "content" ? "text-white" : "text-gray-400"
                      }`}
                      width="16"
                      height="16"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, content: "" }));
                        setPostType("content");
                      }}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {" "}
                      <path d="M12 20h9" />{" "}
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <div className="w-full flex  justify-center">
                    <svg
                      class={`h-5 w-5 z-10  ${
                        postType == "job" ? "text-white" : "text-gray-400"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      onClick={() => {
                        setPostType("job");
                        setFormData((prev) => ({ ...prev, content: "" }));
                        setJobs([
                          {
                            jobId: 0,
                            job_source: "job_post",
                            job_role: "",
                            company_name: "",
                            job_tags: "",
                            job_url: "",
                          },
                        ]);
                        setImages([]);
                      }}
                    >
                      <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
                      <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
                    </svg>
                  </div>
                  <div
                    style={{
                      left: `${(100 / 2) * (postType === "content" ? 0 : 1)}%`,
                      transition: "left 0.2s ease-in-out",
                    }}
                    className={`bg-gray-800 absolute  ${
                      postType == "content" ? "rounded-full" : "rounded-full"
                    } w-1/2 h-full  `}
                  ></div>
                </div>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (textIsEmpty && postType === "content") ||
                    (
                      !jobs.every(
                        (job) =>
                          job.job_role &&
                          job.description &&
                          job.job_url &&
                          job.company_name
                      ))
                  }
                  className={`text-white w-fit disabled:bg-gray-600 font-semibold px-4 flex items-center rounded-full ${
                    loading ? "" : "bg-gray-800 hover:sm:bg-blue-600"
                  } focus:outline-none`}
                >
                  {loading ? (
                    <svg
                      className="inline w-8 h-7 my-1.5 text-transparent animate-spin fill-blue-500 "
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
                  ) : (
                    <p className="py-2">Post</p>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col mt-6 items-start">
              <div className="flex px-4 md:px-6 gap-4 w-full ">
                <UserImageInput
                  className="w-[35px] h-[35px] rounded-full"
                  imageHeight={35}
                  imageBorder={1}
                  image={
                    userDetails?.profileImage?.compressedImage ||
                    user.profileImage?.compressedImage ||
                    profileImageDefault
                  }
                  alt={`${user.username}'s avatar`}
                  isEditable={false}
                />
                {/* <textarea
                  name="content"
                  autoFocus
                  value={formData.content}
                  onChange={(e) => {
                    handleInputChange(e);
                    resizeTextarea();
                  }}
                  placeholder={
                    postType == "content"
                      ? "What's happening?"
                      : "Describe more about the job like deadline and more..."
                  }
                  ref={textareaRef}
                  className="w-full h-max caret-gray-800 mt-1 focus:outline-none resize-none overflow-hidden"
                /> */}
                <PostTextArea
                  mentionList={mentionList}
                  hashTags={hashTags}
                  content = {formData.content.toString()}
                  setContent = {(text)=>{    setFormData((prev) => ({ ...prev, content: text }));
                }
                }
                  setMentionList={setmentionList}
                  textIsEmpty={textIsEmpty}
                  settextIsEmpty={settextIsEmpty}
                />
              </div>
              {/* {mentionList.length > 0 && (
                <div className="px-4 sm:px-6 my-3 flex gap-2 -mb-2 text-sm flex-wrap">
                  {mentionList.map((user) => (
                    <div className=" bg-gray-50 border gap-2 flex items-center border-blue-500 px-2 py-1.5 rounded-md text-blue-500">
                      <p className="  rounded-md font-medium">
                        @{user.username}
                      </p>
                      <svg
                        onClick={() =>
                          setmentionList(
                            mentionList.filter((user) => user != user)
                          )
                        }
                        className="h-5 w-5   cursor-pointer"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-label="Close"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  ))}
                </div>
              )} */}
              {postType == "content" ? (
                <div className="w-full">
                  <div className="flex w-full mt-4  overflow-auto px-4">
                    <ImageCarousel
                      // className={"ml-10"}
                      showCount={false}
                      dots={false}
                      isEditable={true}
                      edges={"rounded-2xl"}
                      gap={2}
                      setImages={setImages}
                      images={images}
                    />
                  </div>
                  {images.length > 0 && (
                    <div className="w-full flex px-4 justify-end">
                      <p className=" px-4 py-1 bg-gray-100  border rounded-full text-gray-800 mt-3 text-lg">
                        10/{images.length}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-5 w-full">
                  <JobList
                    jobs={jobs}
                    setJobs={setJobs}
                    tagsText={tagsText}
                    settagsText={settagsText}
                  />
                  {/* <JobLinkDetails/> */}
                </div>
              )}
            </div>
          </div>

          <div className="w-full  sticky bottom-20 bg-white  px-4">
            {/* <div
                onClick={() => {
                  setSelectMentions(false);
                }}
                className="absolute h-full w-full bg-black opacity-45  top-0 left-0"
              ></div> */}

            {showSelectMention && (
              <div
                className={`${
                  selectMentions ? "animate-popup" : "animate-popdown"
                } transition-all border py-1 border-gray-200  z-20 rounded-xl shadow-md`}
              >
                <div className="flex items-center px-2 rounded-lg">
                  <input
                    value={mentionSecrchText}
                    onChange={(e) => {
                      setMentionSecrchText(e.target.value);
                    }}
                    className="w-full py-2.5 outline-none px-3 caret-blue-500 rounded-lg"
                    placeholder="Search for user to mention"
                  />
                  <svg
                    onClick={() => {
                      setSelectMentions(false);

                      setTimeout(() => {
                        setShowSelectMention(false);
                      }, 2000);
                    }}
                    className="h-6 w-6 mx-3 text-gray-400 cursor-pointer"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-label="Close"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div className="px-4">
                  {mentionSearchList.map((user) => (
                    <div
                      onClick={() => {
                        if (
                          !mentionList.some((listUser) => listUser === user)
                        ) {
                          setmentionList((prev) => [...prev, user]);
                        }
                      }}
                      className="flex gap-3 items-center py-2"
                    >
                      <UserImageInput
                        imageHeight={30}
                        isEditable={false}
                        image={user.profileImage.compressedImage}
                      />
                      <p className="font-medium">{user.username}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex sticky bg-white bottom-0 gap-4 text-gray-800  py-4 px-4 md:px-6 items-center">
            {/* <div className={`${(postType == "job" ||images.length>=10) && "text-gray-600"}`}>
              <svg
                className="h-8 w-8 z-20  cursor-pointer"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>

              <input
                type="file"
                id="fileInput"
                name="images"
                multiple
                disabled={postType === "job" || images.length>=10 ? true : false}
                onChange={handleImageChange}
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
            </div> */}

            {/* <svg
              onClick={() => {
                setSelectMentions(true);
                setShowSelectMention(true);
              }}
              class={`h-7 w-7 ${showSelectMention && "text-gray-400"} `}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <circle cx="12" cy="12" r="4" />{" "}
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
            </svg> */}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default PostForm;
