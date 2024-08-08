import React, { useEffect, useRef, useState } from "react";
import "../../css/LikeButton.css"; // Ensure this CSS file handles animations and styling
import { addLike } from "../../services/postService";
import { useSelector } from "react-redux";

const LikeButton = ({ postData, setPostData }) => {
  const user = useSelector((state) => state.auth.user);
  console.log(postData);

  const [liked, setLiked] = useState(
    postData.likes[0]?.user == user._id || false
  );
  const [likes_count, setLikes_count] = useState(postData.likes_count || 0);
  const scrollReference = useRef();
  const debounceTimeout = useRef(null);
  const [clicked, setClicked] = useState(false);

  const [likes, setlikes] = useState(postData.likes);
  console.log(postData.likes[0]?.user, user._id);
  useEffect(() => {

  if ( scrollReference.current ) {
    const scrollElement = scrollReference.current;

    // Smoothly scroll to the bottom or top based on the liked state
    scrollElement.scrollTo({
      top: liked ? scrollElement.scrollHeight : 0,
      behavior: "smooth",
    });
  }
}, [liked]);

  const handleLike = async () => {
    // Clear the previous debounce timeout if it exists
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      // Send API request to update like status
      try {
        setLiked(!liked);
        setClicked(true);
        setTimeout(() => {
          setClicked(false);
        }, 400);

        let response;
        if (liked) {
          setLikes_count((prev) => prev - 1);
          setlikes(likes.filter((like) => like.user != user._id));
          console.log(likes.filter((like) => like.user != user._id));

          response = addLike({
            ...postData,
            likes_count: likes_count - 1,
            likes: likes.filter((like) => like.user != user._id),
          });
        } else {
          setLikes_count((prev) => prev + 1);
          setlikes([
            ...likes,
            {
              post: postData._id,
              user: user._id,
            },
          ]);
          response = addLike({
            ...postData,
            likes_count: likes_count + 1,
            likes: [
              ...likes,
              {
                post: postData._id,
                user: user._id,
              },
            ],
          });
        }

        if (response.ok) {
          console.log("response", response);

          setPostData((prev) => ({ ...prev, response }));
        } else {
          console.error("Failed to update like status");
        }
      } catch (error) {
        console.error("Error occurred while updating like status:", error);
      }
    }, 300); // Adjust debounce delay as needed
  };

  return (
    <button
      className={`flex items-center space-x-2 rounded-full ${
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
        className={`w-5 h-5 transition-transform duration-200 ${
          clicked ? (liked ? "liked-animation" : "unliked-animation") : ""
        }`}
      >
        <path
          d={
            liked
              ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              : "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.09 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          }
        />
      </svg>
      <div
        ref={scrollReference}
        style={{
          scrollbarWidth: "none",
          pointerEvents: "none",
        }}
        className="flex flex-col scroll-smooth transition-all h-6 overflow-y-auto"
      >
        <span>{liked ? likes_count - 1 : likes_count}</span>
        <span>{liked ? likes_count : likes_count + 1}</span>
      </div>
    </button>
  );
};

export default LikeButton;
