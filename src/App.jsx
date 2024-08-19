import React, { useEffect, useState } from "react";
import "./App.css"; // Import Tailwind CSS
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import UserImageInput from "./components/Input/UserImageInput";
import authService from "./services/authService";
import { useSelector } from "react-redux";

const App = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(""); // State to manage active tab
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

    fetchUserDetails();
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
      <div className="sm:ml-16 w-full h-full">
        <Header />
        <div className="flex-1  h-full w-full  overflow-y-auto flex justify-center pb-14 sm:pb-5  sm:px-10 py-5">
          <Outlet />
        </div>
      </div>
      <div
        className={`${
          !isAuthenticated && "hidden"
        } fixed flex border-t-2 justify-between sm:justify-evenly sm:border-r sm:border-t-0 bottom-0 sm:px-5  sm:flex-col py-3 left-0 sm:top-0  w-full sm:w-fit bg-white`}
      >
        <p
          onClick={() => {
            navigate("home");
          }}
          className={`w-1/5 sm:w-fit  text-center flex justify-center items-center ${
            activeTab === "home" ? "text-blue-500" : "text-gray-400"
          }`}
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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </p>
        <p
          onClick={() => {
            navigate("search");
          }}
          className={`w-1/5 sm:w-fit   text-center flex justify-center items-center ${
            activeTab === "search" ? "text-blue-500" : "text-gray-400"
          }`}
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </p>
        <p
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
        </p>
        <p
          onClick={() => {
            navigate("notifications");
          }}
          className={`w-1/5 sm:w-fit   text-center flex justify-center items-center ${
            activeTab === "notifications" ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <svg
            className="h-6 w-6 "
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
          className={`w-1/5 sm:w-fit   text-center flex justify-center items-center ${
            activeTab === "profile" ? "text-blue-500" : "text-gray-400"
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
