import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { addLike } from "../../services/postService";
import "../../css/button.css";

const LikeButton = ({ postData, setPostData }) => {
  const user = useSelector((state) => state.auth.user);

  const initialLiked = postData?.likes.some((like) => like.user === user._id);
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(postData?.likes_count || 0);
  const [clicked, setClicked] = useState(false);

  const scrollReference = useRef();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (scrollReference.current) {
      scrollReference.current.scrollTo({
        top: liked ? scrollReference.current.scrollHeight : 0,
        behavior: "smooth",
      });
    }
  }, [liked]);

  const handleLike = async (e) => {
    e.stopPropagation();

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        setLiked((prevLiked) => !prevLiked);
        setClicked(true);

        setTimeout(() => {
          setClicked(false);
        }, 400);

        const updatedLikes = liked
          ? postData.likes.filter((like) => like.user !== user._id)
          : [...postData.likes, { post: postData._id, user: user._id }];

        setLikesCount(liked ? likesCount - 1 : likesCount + 1);

        const response = await addLike({
          ...postData,
          likes_count: liked ? likesCount - 1 : likesCount + 1,
          likes: updatedLikes,
        });

        if (response.ok) {
          setPostData((prev) => ({ ...prev, response }));
        } else {
          console.error("Failed to update like status");
        }
      } catch (error) {
        console.error("Error occurred while updating like status:", error);
      }
    }, 300);
  };

  return (
    <button
      className={`flex items-center gap-1 h-full ${liked ? "text-red-500" : ""}`}
      onClick={handleLike}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        className={`w-4 h-4 transition-transform duration-200 ${
          clicked ? (liked ? "liked-animation" : "") : ""
        }`}
        viewBox="0 0 16 16"
      >
        {liked ? (
          <path
            fillRule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
          />
        ) : (
          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
        )}
      </svg>
      <div
        ref={scrollReference}
        style={{
          scrollbarWidth: "none",
          pointerEvents: "none",
        }}
        className={`flex flex-col scroll-smooth transition-all h-6 overflow-y-auto ${
          likesCount <= 0 ? "invisible" : ""
        }`}
      >
        <span>{liked ? likesCount - 1 : likesCount}</span>
        <span>{liked ? likesCount : likesCount + 1}</span>
      </div>
    </button>
  );
};

export default LikeButton;
