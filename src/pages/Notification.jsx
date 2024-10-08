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
        <p className="px-4 md:px-6">Loading notifications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
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
