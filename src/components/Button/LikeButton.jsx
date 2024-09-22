import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { addLike } from "../../services/postService";
import "../../css/button.css";

const LikeButton = ({ postData, setPostData, likesCount, likes }) => {
  const user = useSelector((state) => state.auth.user);
  const [liked, setLiked] = useState(
    likes?.some((like) => like.user === user._id)
  );
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [clicked, setClicked] = useState(false);

  const scrollReference = useRef();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    setLiked(likes?.some((like) => like.user === user._id));
    setCurrentLikesCount(likesCount);
  }, [postData, likesCount, likes, user._id]);

  const handleLike = useCallback(
    (e) => {
      e.stopPropagation();

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(async () => {
        try {
          const isLiked = !liked; // toggle like status
          const newLikesCount = isLiked
            ? currentLikesCount + 1
            : currentLikesCount - 1;

          setLiked(isLiked);
          setCurrentLikesCount(newLikesCount);
          setClicked(true);

          setTimeout(() => setClicked(false), 400);

          const updatedLikes = isLiked
            ? [...postData.likes, { post: postData._id, user: user._id }]
            : postData.likes.filter((like) => like.user !== user._id);

          const response = await addLike({
            ...postData,
            likes_count: newLikesCount,
            likes: updatedLikes,
          });

          if (response) {
            setPostData((prev) => ({
              ...prev,
              likes: updatedLikes,
              likes_count: newLikesCount,
            }));
          } else {
            console.log("Failed to update like status");
            // Optionally, revert the state changes if the request fails
            setLiked(!isLiked);
            setCurrentLikesCount(
              isLiked ? currentLikesCount - 1 : currentLikesCount + 1
            );
          }
        } catch (error) {
          console.error("Error occurred while updating like status:", error);
          // Optionally, revert the state changes if the request fails
          setLiked(!liked);
          setCurrentLikesCount(
            liked ? currentLikesCount - 1 : currentLikesCount + 1
          );
        }
      }, 300);
    },
    [liked, currentLikesCount, postData, setPostData, user._id]
  );

  useEffect(() => {
    if (scrollReference.current) {
      scrollReference.current.scrollTo({
        top: liked ? scrollReference.current.scrollHeight : 0,
        behavior: "smooth",
      });
    }
  }, [liked]);

  return (
    <button
      className={`flex items-center gap-1 h-full ${
        liked ? "text-red-500" : ""
      }`}
      onClick={handleLike}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        className={`w-4 h-4 transition-transform duration-200 ${
          clicked ? "liked-animation" : ""
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
        className="flex flex-col h-6 overflow-y-auto"
      >
        <span
          key={currentLikesCount} // Trigger re-render on count change
          className={`${
           clicked && ( liked? " animate-likeCountFromTop" : "animate-likeCountFromBottom")
          }   transition-all duration-500 ease-in-out`}
        >
          <span className={`${currentLikesCount <= 0 ? "opacity-0" : ""}`}>
            {currentLikesCount}
          </span>
        </span>
      </div>
    </button>
  );
};

export default LikeButton;
