import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../services/postService';
import Posts from '../components/profileTabs/Posts';
import useJobApi from '../services/jobService';
import PostView from '../components/PostView';

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
          setContent(posts.filter(post => post.post_type !== "job"));
        } else if (selectedType === "Jobs") {
          const jobPosts = await jobService.job.getAll();
          setContent(posts.filter(post => post.post_type === "job"));
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
    <div className='w-full flex flex-col'>
      <div className={`px-4  flex  w-full sm:w-[100%]  py-4  z-50 bg-white   top-0  ${selectedPost && "hidden sm:block"}`}>
        {["All", "Posts", "Jobs"].map((type) => (
          <p
            key={type}
            onClick={() => setSelectedType(type)}
            className={`${selectedType === type ? "bg-blue-50 text-blue-500 rounded-md" : ""} px-4 py-1 cursor-pointer`}
          >
            {type}
          </p>
        ))}
      </div>
      <div className='flex overflow-y-auto flex-1 justify-center  gap-4'>
        {loading ? (
          <div className=' pb-14'>Loading...</div>
        ) : (
          <div className={`  w-full sm:pt-5 justify-center flex ${selectedPost&&"hidden sm:block"}`}>
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
