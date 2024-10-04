import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { addLike, getLikesByPostId, getCommentsByPostId, deleteLike } from "../../services/postService"; // Import new functions
import "../../css/button.css";

const LikeButton = ({ postData, setPostData }) => {
  const user = useSelector((state) => state.auth.user);
  const [liked, setLiked] = useState(false);
  const [currentLikesCount, setCurrentLikesCount] = useState(0);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [clicked, setClicked] = useState(false);
  
  const scrollReference = useRef();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const fetchLikesAndComments = async () => {
      try {
        const likesResponse = await getLikesByPostId(postData._id);
        setLikes(likesResponse);
        console.log("likes:",likesResponse);
        
        setCurrentLikesCount(likesResponse.length);
        
        const commentsResponse = await getCommentsByPostId(postData._id);
        setComments(commentsResponse.comments || []);
        
        // Check if the user has already liked the post
        const hasLiked = likesResponse.some((like) => like.user._id === user._id);
        setLiked(hasLiked);
      } catch (error) {
        console.error("Error fetching likes and comments:", error);
      }
    };

    fetchLikesAndComments();
  }, [postData, user._id]);

  const handleLike = useCallback(
    async (e) => {
      e.stopPropagation();

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(async () => {
        try {
          const isLiked = !liked;
          const newLikesCount = isLiked ? currentLikesCount + 1 : currentLikesCount - 1;

          setLiked(isLiked);
          setCurrentLikesCount(newLikesCount);
          setClicked(true);

          setTimeout(() => setClicked(false), 400);

          const updatedLikes = isLiked 
            ? [...likes, { post: postData._id, user: user._id }] 
            : likes.filter((like) => like.user !== user._id);

          const response = await addLike({
            post: postData._id,
            user: user._id,
          });

          if (response) {
            setLikes((prev) => ({
              ...prev,
             response,
            }));
          } else {
            console.log("Failed to update like status");
            // Revert changes if request fails
            setLiked(!isLiked);
            setCurrentLikesCount(newLikesCount);
          }
        } catch (error) {
          console.error("Error occurred while updating like status:", error);
          // Revert changes if request fails
          setLiked(!liked);
          setCurrentLikesCount(newLikesCount);
        }
      }, 300);
    },
    [liked, currentLikesCount, postData, likes, user._id]
  );

  const handleUnlike = useCallback(
    async (e) => {
      e.stopPropagation();

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(async () => {
        try {
          const isLiked = !liked;
          const newLikesCount = currentLikesCount - 1;

          setLiked(isLiked);
          setCurrentLikesCount(newLikesCount);
          setClicked(true);

          setTimeout(() => setClicked(false), 400);

          const updatedLikes = likes.filter((like) => like.user._id !== user._id);

          const response = await deleteLike({
            post: postData._id,
            user: user._id,
          });

          if (response) {
            setLikes(updatedLikes);
          } else {
            console.log("Failed to update unlike status");
            // Revert changes if request fails
            setLiked(true);
            setCurrentLikesCount(currentLikesCount);
          }
        } catch (error) {
          console.error("Error occurred while updating unlike status:", error);
          // Revert changes if request fails
          setLiked(true);
          setCurrentLikesCount(currentLikesCount);
        }
      }, 300);
    },
    [liked, currentLikesCount, postData, likes, user._id]
  );
  return (
    <button
      className={`flex items-center gap-1 h-full ${liked ? "text-red-500" : ""}`}
      onClick={(e)=>{
        liked?
        handleUnlike(e)
        :
        handleLike(e)
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        className={`w-4 h-4 transition-transform duration-200 ${clicked ? "liked-animation" : ""}`}
        viewBox="0 0 16 16"
      >
        {liked ? (
          <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
        ) : (
          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
        )}
      </svg>
      <div
        ref={scrollReference}
        style={{ scrollbarWidth: "none", pointerEvents: "none" }}
        className="flex flex-col h-6 items-center justify-center overflow-y-auto"
      >
        <span key={currentLikesCount} className={`${clicked && (liked ? "animate-likeCountFromTop" : "animate-likeCountFromBottom")} transition-all duration-500 ease-in-out`}>
          <span className={`${currentLikesCount <= 0 ? "opacity-0" : ""}`}>
            {currentLikesCount}
          </span>
        </span>
      </div>
    </button>
  );
};

export default LikeButton;
