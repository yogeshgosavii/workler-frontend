import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import followService from "../services/followService";
import UserImageInput from "../components/Input/UserImageInput";
import { useSelector } from "react-redux";

function Connections({ userId = useParams().userId }) {
  const [tab, setTab] = useState("followers");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const followingResponse = await followService.getFollowing(userId);
        console.log("following", followingResponse);

        setFollowings(followingResponse);

        const followerResponse = await followService.getFollowers(userId);
        console.log("followerResponse", followerResponse);

        setFollowers(followerResponse);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, []);

  let content;

  switch (tab) {
    case "followers":
      content = (
        <div>
          {followers.length > 0 ? (
            <div className="flex flex-col gap-1 px-4 pt-2">
              {followers.map((user) => (
                <div
                  onClick={() => {
                    navigate("/user/" + user.user._id);
                  }}
                  className="flex gap-4 cursor-pointer"
                >
                  <UserImageInput
                    image={user.user.profileImage.compressedImage[0]}
                    isEditable={false}
                  />
                  <div className="-mt-1">
                    <p className="font-medium text-lg">{user.user.username}</p>
                    {user.user.personal_details ? (
                      <p className="text-gray-400">
                        {user.user.personal_details?.firstname}{" "}
                        {user.user.personal_details?.lastname}
                      </p>
                    ) : (
                      <p className="text-gray-400">
                        {user.user.company_details.company_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="max-w-xl pt-20 text-center sm:h-full h-fit px-6 md:px-6">
              <p className="text-2xl font-bold text-gray-500">
                No Followers Yet
              </p>
              <p className="mt-1 text-gray-400">
                The followers will be shown here once the start following
              </p>
            </p>
          )}
        </div>
      );
      break;
    case "followings":
      content = (
        <div className="flex flex-col pt-2 gap-1 px-4">
          {followings.length > 0 ? (
            <div>
              {followings.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    navigate("/user/" + user.following._id);
                  }}
                  className="flex items-center gap-4 cursor-pointer"
                >
                  <UserImageInput
                    imageHeight={45}
                    image={user.following.profileImage?.compressedImage[0]}
                    isEditable={false}
                  />
                  <div className="-mt-1">
                    <p className="font-medium text-lg">
                      {user.following.username}
                    </p>
                    {user.following.personal_details ? (
                      <p className="text-gray-400">
                        {user.following.personal_details?.firstname}{" "}
                        {user.following.personal_details?.lastname}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        {user.following.company_details?.company_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="max-w-xl pt-20 text-center sm:h-full h-fit px-6 md:px-6">
              <p className="text-2xl font-bold text-gray-500">
                No Followings Yet
              </p>
              <p className="mt-1 text-gray-400">
                The people you follow will be shown here once you start
                following them
              </p>
            </p>
          )}
        </div>
      );
      break;
    default:
      content = <p>Invalid tab selected</p>;
      break;
  }

  return (
    <div className="bg-gray-50 flex justify-center h-dvh">
      <div className={`w-full max-w-xl py-3 sm:w-full  h-full `}>
        <div className="flex gap-4 mb-3  px-4 sm:px-0 py-1">
          <p
            onClick={() => setTab("followers")}
            className={`px-3 py-1 cursor-pointer bg rounded-lg font-medium border ${
              tab === "followers"
                ? "bg-gray-800 border-gray-800 text-white"
                : "bg-white"
            }`}
          >
            Followers
          </p>
          {currentUser._id == userId && (
            <p
              onClick={() => setTab("followings")}
              className={`px-3 py-1 cursor-pointer rounded-lg font-medium border ${
                tab === "followings"
                  ? "bg-gray-800 border-gray-800 text-white"
                  : "bg-white"
              }`}
            >
              Followings
            </p>
          )}
        </div>
        {content}
      </div>
    </div>
  );
}

export default Connections;
