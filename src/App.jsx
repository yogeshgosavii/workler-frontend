import React, { useEffect, useState } from "react";
import "./App.css"; // Import Tailwind CSS
import Header from "./Header";
import Footer from "./Footer";
import "./css/button.css"
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authService.fetchUserDetails();
        setUserDetails(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    const fetchNotificationCount = async () => {
      try {
        const response = await getUserNotificationCount();
        setNotificationCount(response.unreadCount);
        console.log("count", response);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };
    const fetchAllJobs = async () => {
      try {
        const response = await jobService.job.getAll();
        console.log("All jobs", response);
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
  }, [location.pathname]); // Re-run effect when location changes

  return (
    <div className="relative flex flex-col sm:flex-row h-screen  text-gray-700">
      <div className=" w-full h-full">
        <Header />
        <div
          className={`flex-1  h-full w-full  overflow-y-auto flex justify-center  ${
            isAuthenticated && "pb-14 sm:pb-5 sm:pl-24"
          } `}
        >
          <Outlet />
        </div>
      </div>
      <div
        className={`${
          !isAuthenticated && "hidden"
        } fixed flex border-t-2 z-40 justify-between sm:justify-evenly sm:border-r sm:border-t-0 bottom-0  sm:flex-col left-0 sm:top-0  w-full sm:w-fit bg-white`}
      >
        <p
          onClick={() => {
            navigate("home");
          }}
          className={`w-1/5 sm:w-fit  sm:hover:bg-gray-100 px-5 py-3 sm:py-5 text-center flex justify-center items-center ${
            activeTab === "home" ? "text-blue-500  bg-blue-50" : "text-gray-400"
          }`}
        >
          <svg
            className={`h-6 w-6 ${activeTab=="home"&&"clicked-animation"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </p>
        <p
          onClick={() => {
            navigate("search");
          }}
          className={`w-1/5 sm:w-fit px-5 py-3 sm:py-5 sm:hover:bg-gray-100  text-center flex justify-center items-center ${
            activeTab === "search" ? "text-blue-500 bg-blue-50" : "text-gray-400"
          }`}
        >
          <svg
            className={`h-6 w-6 ${activeTab=="search"&&"clicked-animation"}`}
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
            className={`w-1/5 sm:w-fit px-5 py-3 sm:py-5 sm:hover:bg-gray-100   text-center flex justify-center items-center ${
              activeTab === "manager" ? "text-blue-500 bg-blue-50" : "text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className={`h-6 w-6 ${activeTab=="manager"&&"clicked-animation"}`}
              viewBox="0 0 16 16"
            >
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
          </p>
        )}

        {user?.account_type == "Candidate" && (
          <p
            onClick={() => {
              navigate("job-applications");
            }}
            className={`w-1/5 sm:w-fit px-5 py-3 sm:py-5 sm:hover:bg-gray-100   text-center flex justify-center items-center ${
              activeTab === "job-applications"
                ? "text-blue-500 bg-blue-50"
                : "text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className={`h-6 w-6 ${activeTab=="job-applications"&&"clicked-animation"}`}
              viewBox="0 0 16 16"
            >
              <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
              <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
            </svg>
          </p>
        )}

        {/* <p
          onClick={() => {
            navigate("/post");
          }}
          className={`w-1/5 sm:w-fit  text-center flex justify-center items-center ${
            activeTab === "post" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <svg
            className=" w-8 p-2 rounded-full  bg-blue-50 text-blue-500"
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
          className={`w-1/5  sm:w-fit px-5 py-3 sm:py-5 sm:hover:bg-gray-100  relative   text-center flex justify-center items-center ${
            activeTab === "notifications" ? "text-blue-500 bg-blue-50" : "text-gray-400"
          }`}
        >
          {notificationCount > 0 && (
            <div className="  top-0 right-0">
              <div
                className={`absolute -top-2 ${
                  activeTab != "notifications" ? "animate-ping" : "animate-none"
                } right-1/2 p-0.5 pt-0  font-medium bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center`}
              ></div>
              <div className="absolute text-center -top-2 right-1/2  p-0.5 pt-0  font-medium bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                <p>{notificationCount}</p>
              </div>
              {/* Add the icon or bell here for notifications */}
              <i className="fas fa-bell text-gray-700"></i>
            </div>
          )}
          <svg
            className={`h-6 w-6 ${activeTab=="notifications"&&"clicked-animation"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </p>
        <p
          onClick={() => {
            navigate("/profile");
          }}
          className={`w-1/5 sm:w-full px-4 py-3 sm:py-5 sm:hover:bg-gray-100  relative   text-center flex justify-center items-center ${
            activeTab === "profile" ? "text-blue-500 bg-blue-50" : "text-gray-400"
          }`}
        >
          <UserImageInput
            isEditable={false}
            imageHeight={30}
            image={userDetails?.profileImage?.compressedImage}
          />
        </p>
      </div>
    </div>
  );
};

export default App;
