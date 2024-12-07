import React, { useEffect, useState } from "react";
import "./App.css"; // Import Tailwind CSS
import Header from "./Header";
import Footer from "./Footer";
import "./css/button.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import UserImageInput from "./components/Input/UserImageInput";
import authService from "./services/authService";
import { useSelector } from "react-redux";
import { getUserNotificationCount } from "./services/notificationService";
import useJobApi from "./services/jobService";

const App = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(""); // State to manage active tab
  const [notificationCount, setNotificationCount] = useState();
  const jobService = useJobApi();
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Create a navigate function

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(location.pathname.split("/"))

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authService.fetchUserDetails();
        setUserDetails(response);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    const fetchNotificationCount = async () => {
      try {
        const response = await getUserNotificationCount();
        setNotificationCount(response.unreadCount);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };
    const fetchAllJobs = async () => {
      try {
        const response = await jobService.job.getAll();
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchUserDetails();
    fetchNotificationCount();
  }, []);

  // Update active tab based on current location
  useEffect(() => {
    // Set active tab based on pathname
    switch (location.pathname) {
      case "/home":
        setActiveTab("home");
        break;
      case "/search":
        setActiveTab("search");
        break;
      case "/manager":
        setActiveTab("manager");
        break;
      case "/job-applications":
        setActiveTab("job-applications");
        break;
      case "/notifications":
        setActiveTab("notifications");
        break;
      case "/profile":
        setActiveTab("profile");
        break;
      case "/post":
        setActiveTab("post");
        break;
      default:
        setActiveTab("");
    }
  }, [location.pathname]);
  return (
    <div className="relative  flex flex-col sm:flex-row h-screen w-full bg-gray-50 text-gray-800">
      <div className=" w-full h-full overflow-y-auto">
        <Header />
        <div
          className={` h-dvh w-full  overflow-auto  ${
            isAuthenticated && "pb-14 sm:pb-0 sm:pl-[63px]"
          } `}
        >
          <Outlet />
        </div>
      </div>
      <div
        className={`${
          !isAuthenticated && "hidden"
        } fixed flex border-t z-40 justify-between sm:justify-evenly sm:border-r sm:border-t-0 bottom-0  sm:flex-col left-0 sm:top-0  w-full sm:w-fit bg-white`}
      >
        <p
          onClick={() => {
            navigate("home");
          }}
          className={`w-1/5 h-full sm:w-fit    px-5 py-3 sm:py-5 text-center flex justify-center items-center ${
              location.pathname.split("/")[1] == "home"
              ? "text-gray-800  bg-blue-50"
              : "text-gray-400 sm:hover:bg-gray-100"
          }`}
        >
          {location.pathname.split("/")[1] == "home" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class={`size-7  ${activeTab == "home" && "clicked-animation"}`}
            >
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          )}

          {/* <svg
            className={`h-6 w-6 ${activeTab == "home" && "clicked-animation"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg> */}
        </p>
        <p
          onClick={() => {
            navigate("search");
          }}
          className={`w-1/5 h-full sm:w-fit px-5 py-3 sm:py-5   text-center flex justify-center items-center ${
            activeTab === "search"
              ? "text-gray-800 bg-blue-50"
              : "text-gray-400 sm:hover:bg-gray-100"
          }`}
        >
          <svg
            className={`h-7 w-7 ${
              activeTab == "search" && "clicked-animation"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </p>
        {user?.account_type == "Employeer" && (
          <p
            onClick={() => {
              navigate("manager");
            }}
            className={`w-1/5 h-full sm:w-fit px-5 py-3 sm:py-5   text-center flex justify-center items-center ${
              activeTab === "manager"
                ? "text-gray-800 bg-blue-50"
                : "text-gray-400 sm:hover:bg-gray-100"
            }`}
          >
            {activeTab === "manager" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={`size-7 ${
                  activeTab == "manager" && "clicked-animation"
                }`}
              >
                <path
                  fill-rule="evenodd"
                  d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                  clip-rule="evenodd"
                />
                <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`size-7 ${
                  activeTab == "manager" && "clicked-animation"
                }`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            )}
          </p>
        )}

        {user?.account_type == "Candidate" && (
          <p
            onClick={() => {
              navigate("job-applications");
            }}
            className={`w-1/5 h-full sm:w-fit px-5 py-3 sm:py-5    text-center flex justify-center items-center ${
              activeTab === "job-applications"
                ? "text-gray-800 bg-blue-50"
                : "text-gray-400 sm:hover:bg-gray-100"
            }`}
          >
            {activeTab === "job-applications" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={`size-7 ${
                  activeTab == "job-applications" && "clicked-animation"
                }`}
              >
                <path
                  fill-rule="evenodd"
                  d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clip-rule="evenodd"
                />
                <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={`size-7 ${
                  activeTab == "job-applications" && "clicked-animation"
                }`}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                />
              </svg>
            )}
          </p>
        )}

        {/* <p
          onClick={() => {
            navigate("/post");
          }}
          className={`w-1/5 sm:w-fit  text-center flex justify-center items-center ${
            activeTab === "post" ? "text-gray-800" : "text-gray-500"
          }`}
        >
          <svg
            className=" w-8 p-2 rounded-full  bg-blue-50 text-gray-800"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </p> */}
        <p
          onClick={() => {
            navigate("notifications");
          }}
          className={`w-1/5 h-full  sm:w-fit px-5 py-3 sm:py-5   relative   text-center flex justify-center items-center ${
            activeTab === "notifications"
              ? "text-gray-800 bg-blue-50"
              : "text-gray-400 sm:hover:bg-gray-100"
          }`}
        >
          <div>
          {notificationCount > 0 && (
            <div className="relative z-10 top-0 right-0">
              <div
                className={`absolute -top-2 ${
                  activeTab != "notifications" ? "animate-ping" : "animate-none"
                } right-1/2 p-0.5 pt-0  font-medium bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center`}
              ></div>
              <div className="absolute text-center -top-2 right-1/2  p-0.5 pt-0  font-medium bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                <p>{notificationCount>99?"99+":notificationCount}</p>
              </div>
              {/* Add the icon or bell here for notifications */}
              <i className="fas fa-bell text-gray-700"></i>
            </div>
          )}
          {activeTab === "notifications" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class={`size-7 ${
                activeTab == "notifications" && "clicked-animation"
              }`}
            >
              <path
                fill-rule="evenodd"
                d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                clip-rule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          )}
          </div>
          {/* <svg
            className={`h-6 w-6 ${
              activeTab == "notifications" && "clicked-animation"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg> */}
        </p>
        <p
          onClick={() => {
            navigate("/profile");
          }}
          className={`w-1/5 h-full sm:w-full px-4 py-3 sm:py-5  relative   text-center flex justify-center items-center ${
            activeTab === "profile"
              ? "text-gray-800 bg-blue-50"
              : "text-gray-400 sm:hover:bg-gray-100"
          }`}
        >
          <UserImageInput
            isEditable={false}
            imageHeight={30}
            image={user?.profileImage?.compressedImage}
          />
        </p>
      </div>
    </div>
  );
};

export default App;
