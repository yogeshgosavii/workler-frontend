import React, { useEffect, useState } from "react";
import { deletePost, updatePost } from "../services/postService";
import savedService from "../services/savedService";
import searchService from "../services/searchService";
import UserImageInput from "./Input/UserImageInput";
import { useSelector } from "react-redux";
import applicationService from "../services/applicationService";
import approachService from "../services/approachService";

function ApplicationApproachSettings({
  setSetting,
  settings,
  applicationData,
  setApplicationData,
  type
}) {
  const currentUser = useSelector((state) => state.auth.user);

  return (
    <div>
      <div className="fixed h-fit left-0 top-0  z-50">
        {settings && (
          <div
            onClick={() => {
              setSetting(null);
            }}
            className={`w-screen h-screen bg-black transition-opacity ${
              settings ? "opacity-50" : "opacity-0"
            }`}
          ></div>
        )}
        <div
          className={`fixed w-full z-50 p-4 md:p-6 sm:max-w-sm transition-transform transform ${
            settings ? "translate-y-0" : "translate-y-full"
          } bottom-0 md:top-1/2 sm:left-[52%] h-fit md:-translate-x-1/2 md:-translate-y-1/2 ${
            !settings && "md:hidden"
          } bg-white border pt-5 shadow-xl`}
        >
          <p className="text-xl font-semibold mb-5">Options</p>

          
          { (
            <div
              onClick={() => {
                console.log(applicationData,settings );
                if(applicationData){
                  setApplicationData(
                    applicationData.filter((application) => application._id !== settings._id)
                  );
                }else{
                  window.history.back()
                }

                if(type=="application"){
                    applicationService.deleteApplication(settings._id)
                }else{
                    approachService.deleteApproach(settings._id)
                }
                setSetting(null);
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
              <p>Delete</p>
            </div>
          )}
          {/* {currentUser._id != settings?.user._id && (
            <div
              onClick={() => {
                // setPostData(postData.filter(post=> post.id == settings._id))
                // deletePost(settings._id);
                // unsavePost(settings._id);
                // setSetting(null);
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
          )} */}
        </div>
      </div>
    </div>
  );
}

export default ApplicationApproachSettings;
