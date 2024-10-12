import React, { useEffect, useState } from "react";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../services/notificationService";
import { useSelector } from "react-redux";
import UserImageInput from "../components/Input/UserImageInput";
import { useNavigate } from "react-router-dom";

function Notification({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const formatNotificationDate = (createdAt) => {
    const date = new Date(createdAt);
    const currentYear = new Date().getFullYear();

    const day = date.getDate(); // Get the day of the month
    const month = date.toLocaleString("default", { month: "short" }); // Get the short month name (e.g., "Jan", "Feb")

    // Check if the year of the notification is the current year
    if (date.getFullYear() === currentYear) {
      return `${day} ${month}`; // Format as DD:MMM
    } else {
      return `${day} ${month} ${date.getFullYear()}`; // Format as DD:MMM:YYYY for previous years
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const userNotifications = await getUserNotifications(currentUser._id);
        console.log(userNotifications);

        setNotifications(userNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="text-start w-full h-full   mt-4 max-w-lg">
      <p className="text-2xl font-bold px-4 md:px-6 sticky sm:border-x  -mt-4 -top-0 bg-white z-40 py-4 ">Notifications</p>

      {loading ? (
        <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg  lg:overflow-visible">
        <svg
          class="text-white animate-spin"
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
      ) : error ? (
        <p className="text-red-500 px-4 md:px-6">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-400 mt-4 px-4 md:px-6">No notifications yet</p>
      ) : (
        <ul className=" overflow-y-auto h-full sm:border-x  pb-20 sm:pb-0">
          {notifications.map((notification, index, arr) => (
            <li
              key={notification._id}
              onClick={() => {
                handleMarkAsRead(notification._id);
                if (notification.notificationType == "follow") {
                  navigate("/user/" + notification.populatedContent[0]._id);
                } else if (notification.notificationType == "comment") {
                  navigate("/post/" + notification.populatedContent[0]._id);
                }
                else if(notification.notificationType == "reply"){
                  navigate("/post/" + notification.populatedContent[0].post);
                }
                else if (notification.notificationType == "approach") {
                  navigate("/job/" + notification.populatedContent[0]._id);
                }
              }}
              className={`p-3 px-4 md:px-6 ${
                index <= 0 ? index == arr.length-1?"border-t":"border-y" : "border-b"
              } ${notification.read ? "bg-white" : "bg-gray-50"}`}
            >
              <div className="flex gap-4  h-full  ">
                <UserImageInput
                  imageHeight={40}
                  className={"mt-0.5 justify-self-start"}
                  image={
                    notification.relatedUser?.profileImage?.compressedImage
                  }
                  isEditable={false}
                />
                <div className="h-full  w-full flex flex-col ">
                  <p>
                    <span className="font-medium">
                      {notification.relatedUser.username}{" "}
                    </span>
                    <span className="text-gray-400 ">
                      {" "}
                      <span className="font-bold">·</span>{" "}
                      {formatNotificationDate(notification.createdAt)}
                    </span>
                  </p>
                  <div className="w-full ">
                    <p className=" text-gray-400  h-full ">
                      {notification.message}{" "}
                    </p>
                    {notification.notificationType == "approach" ? (
                      <div className="border p-4 bg-white rounded-lg mt-3">
                        {/* <p className="font-medium">
                          {notification.populatedContent[0].job_role}
                        </p> */}
                        <div
                          // onClick={() => {
                          //   navigate("/job/" + job._id);
                          // }}
                          className={` cursor-pointer hover:bg-gray-50 `}
                        >
                          <div className="flex gap-3">
                            <UserImageInput
                              isEditable={false}
                              imageHeight={40}
                              className="mt-1"
                              src={
                                notification.relatedUser?.profileImage
                                  ?.compressedImage[0]
                              }
                            />
                            <div className="w-full">
                              <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold text-black max-w-[700px] ">
                                  {notification.populatedContent[0].job_role}
                                </h2>
                                {/* Add other job details */}
                              </div>
                              <div className="flex items-center justify-between gap-2 ">
                                <p className="text-gray-500 ">
                                  {
                                    notification.populatedContent[0]
                                      .company_name
                                  }
                                </p>
                              </div>
                            </div>
                          </div>

                          {notification.populatedContent[0].description &&
                            notification.populatedContent[0].description !=
                              "" && (
                              <div className="flex gap-2 mt-4">
                                <svg
                                  className="h-6 w-6 mt-0.5 shrink-0 text-gray-400"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path stroke="none" d="M0 0h24h24H0z" />
                                  <rect
                                    x="5"
                                    y="3"
                                    width="14"
                                    height="18"
                                    rx="2"
                                  />
                                  <line x1="9" y1="7" x2="15" y2="7" />
                                  <line x1="9" y1="11" x2="15" y2="11" />
                                  <line x1="9" y1="15" x2="13" y2="15" />
                                </svg>
                                <p className="text-base truncate text-wrap line-clamp-2">
                                  {notification.populatedContent[0].description}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    ) : notification.notificationType == "reply" ? (
                      <div  className="p-4 bg-white rounded-lg border mt-4">
                        <div className="flex gap-4 items-center">
                          <UserImageInput
                            isEditable={false}
                            imageHeight={30}
                            image={currentUser.profileImage.compressedImage}
                          />
                          <p className="font-medium -mt-2">{currentUser.username}</p>
                        </div>
                        <p className=" ml-11">{notification.populatedContent[0].content}</p>
                      </div>
                    ) : null}
                  </div>
                  {/* {!notification.read && <button
                onClick={() => handleMarkAsRead(notification._id)}
                className=' text-blue-500'
              >
                Mark as Read
              </button>} */}
                  {/* {notification.read && <span className='text-gray-500 text-sm'> Visited</span>} */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;
