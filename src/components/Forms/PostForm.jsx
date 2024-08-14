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
import JobList from "../JobList.jsx";

function PostForm({ userDetails,setData, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ content: "", images: [] });
  const [postType, setPostType] = useState("content");
  const [jobs, setJobs] = useState([]);

  const jobService = useJobApi();
  const [tagsText, settagsText] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const textareaRef = useRef(null);

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
    if (jobs.length == 0) {
      setPostType("content");
    }
  }, [jobs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setImages((prevImages) => [...prevImages, ...files]);
    setFormData((prevState) => ({ ...prevState, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("content", formData.content);
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    // console.log({content:formData.content,jobs});

    if (postType == "content") {
      try {
        const data = await createPost(formDataToSend);
        setData(prev =>([...prev,data]))
        onClose()
        setFormData({ content: "", images: [] });
        setImages([]);
      } catch (error) {
        setError("Failed to create post");
      } finally {
        setLoading(false);
      }
    } else {
      const response = await jobService.job.addMultiple(jobs);
      const jobIds = response.map((job) => job._id);
      console.log(jobIds);

      try {
        const data = await createJobPost({
          content: formData.content,
          post_type: postType,
          jobs: jobIds,
        });
        setData(prev =>([...prev,data]))
        onClose();
        setFormData({ content: "", images: [] });
        setImages([]);
      } catch (error) {
        setError("Failed to create post");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-full flex  sm:max-h-[450px] flex-col gap-6 pt-4  overflow-auto bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 h-full"
        encType="multipart/form-data"
      >
        <div className=" flex-1">
          <div className="flex px-4 md:px-6 justify-between">
            <svg
              class="h-8 w-8 text-gray-700"
              onClick={()=>{onClose()}}
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
            </svg>
            <div className="flex gap-4">
              <div className="relative rounded-full bg-blue-50 px-2 gap-4 flex min-w-[80px] w-16 justify-between py-1  items-center ">
                <div className="w-full flex justify-center ">
                  <svg
                    class={`h-5 w-5 z-10 ${
                      postType == "content" ? "text-white" : "text-gray-400"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, content: "" }));
                      setPostType("content");
                    }}
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                    <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
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
                  className={`bg-blue-500 absolute  ${
                    postType == "content" ? "rounded-full" : "rounded-full"
                  } w-1/2 h-full  `}
                ></div>
              </div>
              <button
                type="submit"
                // disabled={loading}
                className={` text-white w-fit  font-semibold px-4 flex items-center rounded-full ${
                  loading ? "" : "bg-blue-500 hover:bg-blue-600 "
                } focus:outline-none `}
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
          <div className="flex flex-col mt-4 items-start">
            <div className="flex px-4 md:px-6 gap-4 w-full mb-4">
              <UserImageInput
                className="w-[35px] h-[35px] rounded-full"
                imageHeight={35}
                imageBorder={1}
                image={
                  user.profileImage?.compressedImage || profileImageDefault
                }
                alt={`${user.username}'s avatar`}
                isEditable={false}
              />
              <textarea
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
                className="w-full h-max caret-blue-500 mt-1 focus:outline-none resize-none overflow-hidden"
              />
            </div>
            {postType == "content" ? (
              <div className="flex w-full  overflow-auto px-4">
                <ImageCarousel
                  // className={"ml-10"}
                  dots={false}
                  isEditable={true}
                  edges={"rounded-2xl"}
                  gap={2}
                  setImages = {setImages}
                  images={images}
                />
              </div>
            ) : (
              <JobList
              jobs={jobs}
              setJobs={setJobs}
              tagsText={tagsText}
              settagsText={settagsText}
              />
             
            )}
          </div>
        </div>
        <div className="flex gap-4 text-blue-500 border-y py-4 px-4 md:px-6 items-center">
          <div className="disabled:text-blue-300">
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
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <svg
            class="h-8 w-8 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default PostForm;
