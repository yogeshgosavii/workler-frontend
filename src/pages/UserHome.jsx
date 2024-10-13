import React, { useEffect, useState } from "react";
import { getAllPosts } from "../services/postService";
import Posts from "../components/profileTabs/Posts";
import useJobApi from "../services/jobService";
import PostView from "../components/PostView";

function UserHome() {
  const [content, setContent] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const jobService = useJobApi();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const posts = await getAllPosts();
        if (selectedType === "Posts") {
          setContent(posts.filter((post) => post.post_type !== "job"));
        } else if (selectedType === "Jobs") {
          const jobPosts = await jobService.job.getAll();
          setContent(posts.filter((post) => post.post_type === "job"));
        } else {
          setContent(posts);
        }
        console.log("posts", posts);
      } catch (error) {
        setError("Failed to load content.");
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedType]);

  if (error) return <div>{error}</div>;

  return (
    <div className="w-full flex flex-col">
      <div
        className={`px-4  flex gap-4  w-full sm:w-[100%]  py-4  z-50 bg-white   top-0  ${
          selectedPost && "hidden sm:block"
        }`}
      >
        {["All", "Posts", "Jobs"].map((type) => (
          <p
            key={type}
            onClick={() => setSelectedType(type)}
            className={`${
              selectedType === type ? "bg-blue-50  border-blue-500 text-blue-500 " : ""
            } px-4 py-1 border cursor-pointer text-sm rounded-lg font-medium`}
          >
            {type}
          </p>
        ))}
      </div>
      <div className="flex overflow-y-auto flex-1 justify-center  gap-4">
        {loading ? (
          <div className=" pb-14">
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
          </div>
        ) : (
          <div
            className={`  w-full sm:pt-5 justify-center flex ${
              selectedPost && "hidden sm:block"
            }`}
          >
            <Posts
              isEditable={false}
              postData={content}
              className={"sm:max-w-lg"}
              columns={1}
            />
          </div>
        )}
        {/* {selectedPost && (
          <PostView
            className={"sticky top-0 max-w-lg"}
            post={selectedPost?.post}
            index={selectedPost?.index}
          />
        )} */}
      </div>
    </div>
  );
}

export default UserHome;
