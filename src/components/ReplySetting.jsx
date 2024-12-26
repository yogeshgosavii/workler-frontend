import React, { useEffect, useState } from "react";
import { deleteComment, deletePost, updatePost } from "../services/postService";
import savedService from "../services/savedService";
import searchService from "../services/searchService";
import UserImageInput from "./Input/UserImageInput";
import { useSelector } from "react-redux";

function ReplySetting({
  setCommentSettings,
  commentSettings,
  commentData,
  setcommentData,
  currentMentionList,
  setPost
}) {
  const [selectMentions, setSelectMentions] = useState(false);
  const [mentionSearchText, setMentionSearchText] = useState("");
  const [mentionList, setMentionList] = useState([]);
  const [mentionSearchList, setMentionSearchList] = useState([]);
  const [selectReport, setSelectReport] = useState(false);

  const [currentUser, setcurrentUser] = useState(useSelector((state) => state.auth.user));

  useEffect(() => {
    const getUserDetails = async ()=>{
      const userDetails = await authService.fetchUserDetailsById(currentUser._id);
      setcurrentUser(userDetails)

    }

    getUserDetails()
    if (mentionSearchText) {
      const fetchSearchedUser = async () => {
        const response = await searchService.searchByUsername(
          mentionSearchText
        );
        setMentionSearchList(response);
      };

      fetchSearchedUser();
    } else {
      setMentionSearchList([]); // clear search list when search text is empty
    }
  }, [mentionSearchText]);

  useEffect(() => {
    setMentionList(commentSettings?.mentions);
  }, [commentSettings]);

  const unsavePost = async (postId) => {
    const response = await savedService.unsave(postId);
  };

  return (
    <div>
      <div className="fixed h-fit left-0 top-0  z-50">
        {commentSettings && (
          <div
            onClick={() => {
              setCommentSettings(null);
              setSelectMentions(null);
            }}
            className={`w-screen h-screen bg-black  transition-opacity ${
              commentSettings ? "opacity-75" : "opacity-0"
            }`}
          ></div>
        )}
        <div
          className={`fixed sm:rounded-xl shadow-lg w-full z-50 p-4 md:p-6 sm:max-w-sm transition-transform transform ${
            commentSettings ? "translate-y-0" : "translate-y-full"
          } bottom-0 md:top-1/2 sm:left-[52%] h-fit md:-translate-x-1/2 md:-translate-y-1/2 ${
            !commentSettings && "md:hidden"
          } bg-white border pt-5 shadow-xl`}
        >
          <p className="text-xl font-semibold mb-5">Comment options</p>

          
          {currentUser._id == commentSettings?.user._id && (
            <div
              onClick={() => {
                setcommentData(
                  commentData.filter((comment) => comment._id != commentSettings._id)
                );
                setPost(prev => ({
                  ...prev,
                  comment_count : prev.comment_count -1
                }))
                deleteComment(commentSettings._id);
                setCommentSettings(null);
              }}
              className="flex gap-5 text-red-500 py-3 text-lg font-medium items-center cursor-pointer"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              <p>Delete comment</p>
            </div>
          )}
          {currentUser?._id != commentSettings?.user._id && (
            <div>
              <div
                onClick={() => {
                  // setcommentData(commentData.filter(post=> post.id == commentSettings._id))
                  // deletePost(commentSettings._id);
                  // unsavePost(commentSettings._id);
                  // setCommentSettings(null);
                  setSelectReport(!selectReport);
                }}
                className="flex gap-5 text-red-700 py-3 text-lg font-medium items-center cursor-pointer"
              >
                <svg
                  class="h-6 w-6 text-red-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />{" "}
                  <line x1="12" y1="8" x2="12" y2="12" />{" "}
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>Report comment</p>
              </div>
              {selectReport && (
                !currentUser.reports.includes(commentSettings?._id) ? (
                <div className="mt-3">
                  <OptionInput
                    options={[
                      "Spam or misleading",
                      "Harassment or hate speech",
                      "Violence or dangerous content",
                      "False information",
                      "Sexual content",
                      "Promotes self-harm or suicide",
                      "Impersonation or identity theft",
                      "Infringes intellectual property rights",
                      "Illegal activities",
                      "Hate speech or discrimination",
                    ]}
                    placeholder="Reason"
                    initialValue="Select a reason"
                    value={reportReason}
                    onChange={(e) => {
                      setReportReason(e.target.value);
                    }}
                  />
                  <button
                  onClick={async()=>{
                    console.log("reported")
                    await reportService.createReport({
                      reportType: "comment",
                      reason: reportReason,
                      reportedBy: currentUser._id,
                      reportedUser : commentSettings.user._id,
                      reportedContent : [post._id,commentSettings._id]
                    });
                    await authService.updateUserDetails({
                      ...currentUser,
                      reports: [
                        ...(currentUser.reports || []), // Default to an empty array if it's null or undefined
                        commentSettings._id
                      ]
                    });
                    setcurrentUser({...currentUser,reports: [
                      ...(currentUser.reports || []), // Default to an empty array if it's null or undefined
                      commentSettings._id
                    ]})
                                      // deletePost(postSettings._id);
                    setCommentSettings(null);
                  }}
                    disabled={!reportReason}
                    className="w-full bg-red-600 disabled:bg-red-400 font-medium text-white mt-3 rounded-lg py-2"
                  >
                    Report
                  </button>
                </div>):(
                  <p className = {"bg-gray-100 rounded-lg font-medium text-gray-800 w-full text-center py-2"}>We have recieved you report</p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReplySetting;
