import React, { useContext, useEffect, useState } from "react";
import "./App.css"; // Import Tailwind CSS
import Header from "./Header";
import Footer from "./Footer";
import "./css/button.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import UserImageInput from "./components/Input/UserImageInput";
import authService from "./services/authService";
import { useSelector, useDispatch } from "react-redux";
import { getUserNotificationCount } from "./services/notificationService";
import useJobApi from "./services/jobService";
import { PathHistoryContext } from "./components/PathHistoryContext";
import { logout } from "./features/auth/authSlice";

const App = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(""); // State to manage active tab
  const [notificationCount, setNotificationCount] = useState();
  const jobService = useJobApi();
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Create a navigate function
  const dispatch = useDispatch(); // Get the dispatch function

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(location.pathname.split("/"))

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authService.fetchUserDetails();
        setUserDetails(response);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Token is expired, logout and navigate to login page
          dispatch(logout());
          navigate("/login");
        } else {
          console.error("Error fetching user details:", error);
        }
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
  }, [dispatch, navigate]);

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
          className={` h-dvh w-full  overflow-auto border-gray-800  ${
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
              class={`size-7  ${location.pathname.split("/")[1] == "home" && "clicked-animation"}`}
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
