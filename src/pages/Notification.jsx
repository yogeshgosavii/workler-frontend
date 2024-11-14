import React, { useEffect, useState } from "react";
import {
  deleteNotification,
  getUserNotifications,
  markNotificationAsRead,
} from "../services/notificationService";
import { useSelector } from "react-redux";
import UserImageInput from "../components/Input/UserImageInput";
import { useNavigate } from "react-router-dom";
import TouchRipple from "@mui/material/ButtonBase/TouchRipple";

function Notification({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState(null);
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
    document.title = "User notification";
  }, []);

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
    <div className=" flex flex-col bg-gray-50 h-full items-center w-full sm:pl-1.5">
      <p className="text-2xl  font-bold border-x px-4 w-full  sticky max-w-xl  -top-0 bg-white z-40 py-4 ">
        Notifications
      </p>
      <div>
        <div className="fixed h-fit left-0 top-0  z-50">
          {notificationSettings && (
            <div
              onClick={() => {
                setNotificationSettings(null);
              }}
              className={`w-screen h-screen bg-black transition-opacity ${
                notificationSettings ? "opacity-50" : "opacity-0"
              }`}
            ></div>
          )}
          <div
            className={`fixed w-full z-50 p-4 md:p-6 sm:max-w-sm transition-transform transform ${
              notificationSettings ? "translate-y-0" : "translate-y-full"
            } bottom-0 md:top-1/2 sm:left-[52%] h-fit md:-translate-x-1/2 md:-translate-y-1/2 ${
              !notificationSettings && "md:hidden"
            } bg-white border pt-5 shadow-xl`}
          >
            <p className="text-xl font-semibold mb-5">Notifications options</p>

            {true && (
              <div
                onClick={() => {
                  setNotifications(
                    notifications.filter(
                      (notification) =>
                        notification._id != notificationSettings._id
                    )
                  );

                  deleteNotification(notificationSettings._id);
                  setNotificationSettings(null);
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
                <p>Delete notification</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div class="grid min-h-[140px]  h-full w-full justify-center pt-16 overflow-x-scroll   lg:overflow-visible">
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
      ) : error ? (
        <p className="text-red-500 px-4 md:px-6">{error}</p>
      ) : notifications.length === 0 ? (
        // true
        <p className="max-w-xl pt-20 sm:h-full text-center h-fit px-6 md:px-6">
          <p className="text-3xl font-bold text-gray-500">
            No notifications yet
          </p>
          <p className="mt-2 text-gray-400 ">
            When someone likes or comments on your post, or you receive a job
            approach, notifications will appear here.
          </p>
        </p>
      ) : (
        <ul className=" overflow-y-auto w-full h-full bg-white  max-w-xl  border-x   pb-20 sm:pb-0">
          {notifications.map((notification, index, arr) => (
            <li
              key={notification._id}
              onClick={() => {
                handleMarkAsRead(notification._id);
                if (notification.notificationType == "follow") {
                  navigate("/user/" + notification.populatedContent[0]._id);
                } else if (
                  notification.notificationType == "comment" ||
                  notification.notificationType == "like"
                ) {
                  navigate("/post/" + notification?.populatedContent[0]._id);
                } else if (notification.notificationType == "reply") {
                  navigate("/post/" + notification.populatedContent[0].post);
                } else if (notification.notificationType == "approach") {
                  navigate("/job/" + notification.populatedContent[0]._id);
                }
                else if (notification.notificationType == "mention") {
                  navigate("/post/" + notification.populatedContent[0]._id);
                }
              }}
              className={`p-3 px-4 flex items-center justify-between md:px-6 ${
                index <= 0
                  ? index == arr.length - 1
                    ? ""
                    : "border-y"
                  : "border-b"
              } ${
                notification.read
                  ? "bg-white"
                  : notification.notificationType == "like"
                  ? "bg-red-50 "
                  : notification.notificationType == "comment" ||
                    notification.notificationType == "reply"
                  ? "bg-indigo-50 "
                  : notification.notificationType == "approach"
                  ? "bg-blue-50 "
                  : "bg-gray-50"
              }`}
            >
              <div className="flex gap-4  h-full  ">
                <div className="relative">
                  <UserImageInput
                    imageHeight={40}
                    className={"mt-0.5 justify-self-start"}
                    image={
                      notification.relatedUser?.profileImage?.compressedImage
                    }
                    isEditable={false}
                  />
                  <div
                    className={`absolute -top-1 ${
                      [
                        "like",
                        "comment",
                        "reply",
                        "approach",
                        "mention",
                      ].includes(notification.notificationType ) && "bg-white border"
                    } rounded-full  p-1 -right-2`}
                  >
                    {notification.notificationType == "like" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-3 text-red-500"
                      >
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                    ) : notification.notificationType == "comment" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-3 text-indigo-500"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 0 0-.266.112L8.78 21.53A.75.75 0 0 1 7.5 21v-3.955a48.842 48.842 0 0 1-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    ) : notification.notificationType == "reply" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-4 text-indigo-800"
                      >
                        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                      </svg>
                    ) : notification.notificationType == "approach" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-4 text-blue-500"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                          clip-rule="evenodd"
                        />
                        <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                      </svg>
                    ) : notification.notificationType == "mention" ? (
                      <svg
                        class={`size-4  text-gray-800`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        {" "}
                        <circle cx="12" cy="12" r="4" />{" "}
                        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                      </svg>
                    ) : null}
                  </div>
                </div>
                <div className="h-full  w-full flex flex-col ">
                  <p>
                    <span className="font-medium">
                      {notification.relatedUser.username}{" "}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {" "}
                      <span className="font-bold">·</span>{" "}
                      {formatNotificationDate(notification.createdAt)}
                    </span>
                  </p>
                  <div className="w-full ">
                    <p
                      className={` ${
                        notification.read
                          ? "text-gray-400"
                          : notification.notificationType == "like"
                          ? "text-red-400"
                          : notification.notificationType == "comment"
                          ? "text-indigo-500"
                          : notification.notificationType == "reply"
                          ? "text-indigo-800"
                          : notification.notificationType == "approach"
                          ? "text-blue-500"
                          : "text-gray-400 "
                      } h-full text-sm`}
                    >
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
                    ) : notification.notificationType == "reply" ||
                      notification.notificationType == "comment" ? (
                      <div className="p-4 bg-white rounded-lg border mt-4">
                        <div className="flex gap-3 items-center">
                          <UserImageInput
                            isEditable={false}
                            imageHeight={30}
                            image={currentUser.profileImage.compressedImage}
                          />
                          <p className="font-medium -mt-2">
                            {currentUser.username}
                          </p>
                        </div>
                        <p className=" ml-11 -mt-1 text-sm text-gray-400">
                          {notification.populatedContent[0].content}
                        </p>
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
              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationSettings(notification);
                }}
                class="h-6 w-6 text-gray-800 self-start mt-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {" "}
                <circle cx="12" cy="12" r="1" /> <circle cx="12" cy="5" r="1" />{" "}
                <circle cx="12" cy="19" r="1" />
              </svg>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;
