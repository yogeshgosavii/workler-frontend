import React from "react";
import { useNavigate } from "react-router-dom";
import UserImageInput from "./Input/UserImageInput";

function PostMentionList({ setShowMentions, showMentions = [] }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="fixed h-fit left-0 top-0  z-50">
        {showMentions?.length > 0 && (
          <div
            onClick={() => setShowMentions(null)}
            className={`w-screen h-screen bg-black transition-opacity  ${
              showMentions ? "opacity-75" : "opacity-0"
            }`}
          ></div>
        )}
        <div
          className={`fixed shadow-lg sm:rounded-xl w-full z-50 p-4 md:p-6 sm:max-w-sm transition-transform transform ${
            showMentions ? "translate-y-0" : "translate-y-full"
          } bottom-0 md:top-1/2 sm:left-[52%] h-fit md:-translate-x-1/2 md:-translate-y-1/2 ${
            !showMentions && "md:hidden"
          } bg-white border pt-5 shadow-xl`}
        >
          <p className="text-xl font-semibold mb-5">Mentions</p>
          <div>
            {showMentions?.length > 0 ? (
              showMentions?.map((user) => (
                <div
                  key={user._id}
                  onClick={() => navigate("/user/" + user._id)}
                  className="flex gap-3 items-center py-3 cursor-pointer"
                >
                  <UserImageInput
                    imageHeight={40}
                    isEditable={false}
                    image={user.profileImage?.compressedImage}
                  />
                  <div className="flex flex-col">
                    <p className="font-medium">
                      {user.company_details
                        ? user.company_details?.company_name
                        : `${user.personal_details?.firstname} ${user.personal_details?.lastname}`}
                    </p>
                    <p className="text-sm text-gray-400 -mt-0.5">
                      @{user.username}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No mentions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostMentionList;
