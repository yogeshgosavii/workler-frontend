import React, { useEffect, useRef, useState } from "react";
import imageService from "../../services/imageService.js"; // Adjust the import path as needed
import { createPost } from "../../services/postService"; // Adjust the import path as needed
import { useSelector } from "react-redux";
import UserImageInput from "../Input/UserImageInput.jsx";
import profileImageDefault from "../../assets/user_male_icon.png";
import OptionInput from "../Input/OptionInput.jsx";
import ImageCarousel from "../ImageCarousel.jsx";

function PostForm({ userDetails }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ content: "", images: [] });
  const [postType, setPostType] = useState("content");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setFormData((prevState) => ({ ...prevState, images: files }));
    setImages(files); // Update preview
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

    try {
      await createPost(formDataToSend);
      setFormData({ content: "", images: [] });
      setImages([]);
      alert("Post created successfully!");
    } catch (error) {
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex  sm:max-h-[450px] flex-col gap-6 pt-4  overflow-auto bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 h-full"
        encType="multipart/form-data"
      >
        <div className="px-4 md:px-6 flex-1">
          <div className="flex justify-between">
            <svg
              class="h-8 w-8 text-gray-700"
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
              {/* <OptionInput
              optionClassName={"rounded-full"}
                initialValue={"Post type"}
                options={[
                  {
                    name: "content post",
                    value: "content",
                  },
                  {
                    name: "job post",
                    value: "job",
                  },
                ]}
              /> */}
              <div className="relative rounded-full bg-blue-50 px-4 gap-8 flex min-w-20 justify-between py-1 border items-center ">
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
                      setPostType("content");
                    }}
                    // class="bi bi-camera-fill"
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
                disabled={loading}
                className={` text-white font-semibold px-4 rounded-full ${
                  loading
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                } focus:outline-none focus:ring`}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
          <div className="flex flex-col mt-4 items-start">
            <div className="flex gap-4 w-full mb-6">
              <UserImageInput
                className="w-[35px] h-[35px] rounded-full"
                imageHeight={35}
                imageBorder={1}
                // src={post.userAvatar || profileImageDefault}
                image={
                  user.profileImage?.compressedImage || profileImageDefault
                }
                alt={`${user.username}'s avatar`}
                isEditable={false}
              />
              <textarea
                name="content"
                value={formData.content}
                onChange={(e) => {
                  handleInputChange(e);
                  resizeTextarea();
                }}
                placeholder="What's happening?"
                ref={textareaRef}
                className="w-full h-max caret-blue-500 mt-1 focus:outline-none resize-none overflow-hidden"
              />
            </div>
            <div className="flex w-full  overflow-auto mt-4 ">
              <ImageCarousel
                // className={"ml-10"}
                dots={false}
                edges={"rounded-lg"}
                gap={2}
                images={images}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-blue-500 border-y py-4 px-4 md:px-6 items-center">
          <div>
            <svg
              className="h-8 w-8 z-20 cursor-pointer"
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
