import React, { useRef, useState } from "react";
import "../../css/LikeButton.css"; // Make sure your CSS is clean and scoped appropriately

const LikeButton = ({postLikes}) => {

  const [liked, setLiked] = useState(postLikes.data || false);
  const [likes, setLikes] = useState(postLikes.count || 0);
  const scrollReference = useRef();

  const handleLike = () => {
    setLiked((prevLiked) => {
      const newLiked = !prevLiked;
      if (scrollReference.current) {
        scrollReference.current.scrollTop = newLiked
          ? scrollReference.current.scrollHeight
          : 0;
      }
    //   setLikes((prevLikes) => prevLikes + (newLiked ? 1 : -1));
      return newLiked;
    });

    // Optionally, make an API call here to update the like status on the backend
  };

  return (
    <button
      className={`flex items-center space-x-2  ${
        liked ? "border-red-500 text-red-500" : "border-gray-500 text-gray-500"
      }`}
      onClick={handleLike}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className={`w-5 h-5 ${liked ? "liked-animation" : ""}`}
      >
        <path
          d={
            liked
              ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              : "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"
          }
        />
      </svg>
      <div
        ref={scrollReference}
        style={{
          scrollbarWidth: "none",
        }}
        className={`flex flex-col scroll-smooth transition-all h-6 overflow-y-auto`}
      >
        <span>{likes}</span>
        <span>{likes + 1}</span>
      </div>
    </button>
  );
};

export default LikeButton;
