import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function LoginVerification({ loginRequired = true, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);

    if (loginRequired && !isAuthenticated && (location.pathname !== "/login" && location.pathname !== "/signup")) {
      navigate("/not-found", { replace: true });
    } else if (
      !loginRequired &&
      isAuthenticated &&
      location.pathname === "/login"
    ) {
      // navigate("/", { replace: true });
    }
  }, [isAuthenticated, loginRequired, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center border justify-center">
        {" "}
        <svg
          class="h-[10%] w-[10%] animate-spin stroke-blue-500"
          viewBox="0 0 256 256"
        >
          <line
            x1="128"
            y1="32"
            x2="128"
            y2="64"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="195.9"
            y1="60.1"
            x2="173.3"
            y2="82.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="224"
            y1="128"
            x2="192"
            y2="128"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="195.9"
            y1="195.9"
            x2="173.3"
            y2="173.3"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="128"
            y1="224"
            x2="128"
            y2="192"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="60.1"
            y1="195.9"
            x2="82.7"
            y2="173.3"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="32"
            y1="128"
            x2="64"
            y2="128"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="60.1"
            y1="60.1"
            x2="82.7"
            y2="82.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
        </svg>
      </div>
    ); // Show a loading indicator while checking authentication
  }

  return <>{children}</>;
}

export default LoginVerification;
