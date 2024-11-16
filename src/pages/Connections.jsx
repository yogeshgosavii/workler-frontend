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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const followingResponse = await followService.getFollowing(userId);

        setFollowings(followingResponse);

        const followerResponse = await followService.getFollowers(userId);

        setFollowers(followerResponse);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
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
                    image={user.user.profileImage?.compressedImage[0]}
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
          ) : loading ? (
            <div class="grid min-h-[140px]   h-full w-full justify-center pt-16 overflow-x-scroll   lg:overflow-visible">
              <svg
                class="text-transparent animate-spin"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
              >
                <path
                  d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                  stroke="currentColor"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-400"
                ></path>
              </svg>
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
          ) : loading ? (
            <div class="grid min-h-[140px]   h-full w-full justify-center pt-16 overflow-x-scroll   lg:overflow-visible">
              <svg
                class="text-transparent animate-spin"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
              >
                <path
                  d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                  stroke="currentColor"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-400"
                ></path>
              </svg>
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
