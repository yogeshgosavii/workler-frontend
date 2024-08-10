import React, { useState } from "react";
import { useSelector } from "react-redux";

function CommentButton({ postData, setPostData }) {
  const user = useSelector((state) => state.auth.user);

  const [commented, setCommented] = useState(
    postData.comments[0]?.user == user._id || false
  );
  const [comment_count, setComment_count] = useState(
    postData.comment_count > 0 &&
      typeof postData.comment_count == String &&
      postData.comment_count
  );
  return (
    <div className="flex gap-1 -mt-px items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        class="bi bi-chat"
        viewBox="0 0 16 16"
      >
        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
      </svg>
      <div
        // ref={scrollReference}
        style={{
          scrollbarWidth: "none",
          pointerEvents: "none",
        }}
        className="flex flex-col  scroll-smooth  transition-all h-6 overflow-y-auto"
      >
        <span>{comment_count}</span>
        {/* <span>{commented ? comment_count : comment_count + 1}</span> */}
      </div>
    </div>
  );
}

export default CommentButton;
