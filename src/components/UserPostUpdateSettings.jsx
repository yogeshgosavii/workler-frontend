import React, { useEffect, useState } from "react";
import { deletePost, updatePost } from "../services/postService";
import savedService from "../services/savedService";
import searchService from "../services/searchService";
import UserImageInput from "./Input/UserImageInput";
import { useSelector } from "react-redux";

function UserPostUpdateSettings({
  setPostSetting,
  postSettings,
  postData,
  setPostData,
  currentMentionList,
}) {
  const [selectMentions, setSelectMentions] = useState(false);
  const [mentionSearchText, setMentionSearchText] = useState("");
  const [mentionList, setMentionList] = useState([]);
  const [mentionSearchList, setMentionSearchList] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
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
    setMentionList(postSettings?.mentions);
  }, [postSettings]);

  const unsavePost = async (postId) => {
    const response = await savedService.unsave(postId);
    console.log("Unsaved post:", response);
  };

  return (
    <div>
      <div className="fixed h-fit left-0 top-0  z-50">
        {postSettings && (
          <div
            onClick={() => {
              setPostSetting(null);
              setSelectMentions(null);
            }}
            className={`w-screen h-screen bg-black transition-opacity ${
              postSettings ? "opacity-50" : "opacity-0"
            }`}
          ></div>
        )}
        <div
          className={`fixed w-full z-50 p-4 md:p-6 sm:max-w-sm transition-transform transform ${
            postSettings ? "translate-y-0" : "translate-y-full"
          } bottom-0 md:top-1/2 sm:left-[52%] h-fit md:-translate-x-1/2 md:-translate-y-1/2 ${
            !postSettings && "md:hidden"
          } bg-white border pt-5 shadow-xl`}
        >
          <p className="text-xl font-semibold mb-5">Post options</p>

          {currentUser._id == postSettings?.user._id && (
            <div>
              <div
                onClick={() => setSelectMentions(true)}
                className="flex gap-5 cursor-pointer py-3 text-lg font-medium items-center"
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
                  <circle cx="12" cy="12" r="4" />
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                </svg>
                Add mentions
              </div>
              {selectMentions && (
                <div className="mt-1 mb-2 flex gap-2 text-sm flex-wrap">
                  {mentionList?.map((user) => (
                    <div
                      key={user._id}
                      className="bg-blue-50 border gap-2 flex items-center border-blue-500 px-2 py-1.5 rounded-md text-blue-500"
                    >
                      <p className="rounded-md font-medium">@{user.username}</p>
                      <svg
                        onClick={() =>
                          setMentionList(
                            mentionList.filter((u) => u._id !== user._id)
                          )
                        }
                        className="h-5 w-5 cursor-pointer"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-label="Close"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
              <div
                className={`${
                  selectMentions ? "animate-popup" : "opacity-0 hidden"
                } transition-all border mt-1 mb-4 border-gray-200 z-20 rounded-xl shadow-md`}
              >
                <div className="flex items-center px-2 rounded-lg">
                  <input
                    value={mentionSearchText}
                    onChange={(e) => setMentionSearchText(e.target.value)}
                    className="w-full py-2.5 outline-none px-3 caret-blue-500 rounded-lg"
                    placeholder="Search for user to mention"
                  />
                  <svg
                    onClick={() => setSelectMentions(false)}
                    className="h-6 w-6 mx-3 text-gray-400 cursor-pointer"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-label="Close"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div className="px-4 ">
                  {mentionSearchList.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => {
                        if (
                          !mentionList.some(
                            (listUser) => listUser._id === user._id
                          )
                        ) {
                          setMentionList((prev) => [...prev, user]);
                        }
                      }}
                      className="flex gap-3 items-center py-3 cursor-pointer"
                    >
                      <UserImageInput
                        imageHeight={30}
                        isEditable={false}
                        image={user.profileImage.compressedImage}
                      />
                      <p className="font-medium">{user.username}</p>
                    </div>
                  ))}
                </div>
              </div>
              {selectMentions && (
                <button
                  onClick={() => {
                    updatePost(postSettings._id, {
                      ...postSettings,
                      mentions: mentionList,
                    });
                    setPostData((prev)=>({
                      ...prev,
                      mentions : mentionList
                    }))
                    setPostSetting(null);
                    setSelectMentions(false);
                  }}
                  className="w-full bg-gray-800 mb-6 font-medium py-2.5 rounded-lg text-white"
                >
                  Update
                </button>
              )}
            </div>
          )}
          {currentUser._id == postSettings?.user._id && (
            <div
              onClick={() => {
                setPostData(
                  postData.filter((post) => post.id == postSettings._id)
                );

                deletePost(postSettings._id);
                unsavePost(postSettings._id);
                setPostSetting(null);
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
              <p>Delete post</p>
            </div>
          )}
          {currentUser._id != postSettings?.user._id && (
            <div
              onClick={() => {
                // setPostData(postData.filter(post=> post.id == postSettings._id))
                // deletePost(postSettings._id);
                // unsavePost(postSettings._id);
                // setPostSetting(null);
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
              <p>Report post</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPostUpdateSettings;
