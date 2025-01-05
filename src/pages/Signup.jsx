import React, { useContext, useEffect, useRef, useState } from "react";

import verifiedIcon from "../assets/verified.png";
import { Link, useNavigate } from "react-router-dom";

import Otp from "../components/Otp";
import Button from "../components/Button/Button";
import PasswordInput from "../components/Input/PasswordInput";
import DateInput from "../components/Input/DateInput";
import TextInput from "../components/Input/TextInput";
import OptionInput from "../components/Input/OptionInput";
import useProfileApi from "../services/profileService";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../features/auth/authSlice";
import UrlInput from "../components/Input/UrlInput";
import LocationInput from "../components/Input/LocationInput";
import NumberInput from "../components/Input/NumberInput";
import Logo from "../assets/LogoCircle";
import { PathHistoryContext } from "../components/PathHistoryContext";

function Signup() {
  const [otpInput, setotpInput] = useState(false);
  const fileInputRef = useRef(null);
  const [email, setemail] = useState("");
  const [emailChecking, setemailChecking] = useState(false);
  const [otpValue, setotpValue] = useState("");
  const [verified, setverified] = useState(false);
  const [next, setNext] = useState(false);
  const [purpose, setpurpose] = useState(false);
  const [loader, setloader] = useState(false);
  const [usernameChecking, setusernameChecking] = useState(false);
  const [usernameChecked, setusernameChecked] = useState(false);
  const [userNameAvailable, setuserNameAvailable] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });
  const [accountErrorMessage, setAccountErrorMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const usernameTimeout = useRef(null);
  const [usernameError, setusernameError] = useState();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    const handleBackButton = () => {
      if (next) {
        resetFormStates();
        setNext(false); // Reset state or handle custom logic
      } else {
        navigate(-1); // Navigate to a specific route
      }
    };

    const onPopState = () => {
      handleBackButton();
    };

    // Add an event listener for the browser's back button
    window.addEventListener("popstate", onPopState);

    return () => {
      // Cleanup the listener on component unmount
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const handleIconClick = () => {
    // Trigger click event on the file input element
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Handle the file upload logic here
  };

  const [userData, setuserData] = useState({});

  const [personal_details, setpersonal_details] = useState({});
  const [company_details, setcompany_details] = useState({});
  const { pathHistory } = useContext(PathHistoryContext);

  const prevPath =
    pathHistory.length > 1 ? pathHistory[pathHistory.length - 2] : "None";

  useEffect(() => {
    document.title = "Signup";
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update userData state
    setuserData((prevState) => ({ ...prevState, [name]: value }));

    // Handle username validation with debounce
    if (name === "username") {
      if (usernameTimeout.current) {
        clearTimeout(usernameTimeout.current);
      }

      if (value !== "") {
        usernameTimeout.current = setTimeout(() => {
          setusernameChecking(true);
          verifyUserName(value);
        }, 500);
      } else {
        setuserNameAvailable(false);
        setusernameError("Username cannot be empty");
      }
    }
  };
  const verifyPassword = (newPassword) => {
    // A list of common passwords (this is just a small sample, you can extend it)
    const commonPasswords = [
      "123456",
      "password",
      "123456789",
      "qwerty",
      "abc123",
      "password1",
    ];

    // Check that the new password is not the same as the current password

    // Check if password length is at least 6 characters
    if (newPassword?.length < 6) {
      return {
        valid: false,
        message: "Password must be at least 6 characters long",
      };
    }

    // Check for at least one uppercase letter, one lowercase letter, one number, and one special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!regex.test(newPassword)) {
      return {
        valid: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      };
    }

    // Check if the password is in the list of common passwords
    if (commonPasswords.includes(newPassword)) {
      return {
        valid: false,
        message: "Password is too common, choose a more secure password",
      };
    }

    // If all checks pass
    return { valid: true, text: "Password is strong" };
  };
  const isFormValid = () => {
    if (
      userData.username &&
      userNameAvailable &&
      userData.location &&
      userData.email &&
      userData.password?.length >= 6
    ) {
      // if (!verifyPassword(userData.password.valid)){
      //   // setPasswordMessage({type:"error",text:verifyPassword(userData.password).message})
      // }
      if (userData.account_type == "Candidate") {
        console.log(personal_details);

        if (
          personal_details.birthdate &&
          personal_details.firstname &&
          verifyPassword(userData.password).valid
        ) {
          console.log("helloq");

          return true;
        }
      } else {
        if (
          company_details.company_name &&
          company_details.location &&
          company_details.found_in_date
        ) {
        }
        return (
          company_details.company_name &&
          company_details.location &&
          company_details.found_in_date
        );
      }
    }
    return false;
  };
  const resetFormStates = () => {
    setuserData((prev) => ({
      ...prev,
      username: "",
      password: "",
    }));
    setpersonal_details((prev) => ({
      ...prev,
      firstname: "",
      lastname: "",
      birthdate: "",
    }));
    setcompany_details((prev) => ({
      ...prev,
      company_name: "",
      found_in_date: "",
      location: "",
    }));
  };

  const verifyUserName = async (username) => {
    setusernameChecking(true);
    setusernameChecked(false);

    try {
      // Check if the username is empty
      if (username.length === 0) {
        setuserNameAvailable(false);
        resetFormStates();
        setusernameError("Username cannot be empty");
      }
      // Check if the username exceeds the maximum length
      else if (username.length > 30) {
        setuserNameAvailable(false);
        resetFormStates();
        setusernameError("Username can have only 30 characters");
      }
      // Valid length: Check if the username is available
      else {
        const response = await authService.checkUsername(username);

        if (response.exists) {
          setuserNameAvailable(false);
          resetFormStates();
          setusernameError("Username already taken");
        } else {
          setuserNameAvailable(true);
          setusernameError("");
        }
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setusernameError("Error checking username");
    } finally {
      setusernameChecked(true);
      setusernameChecking(false);
    }
  };

  const verifyEmail = async () => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var emailInput = document.getElementById("email");
    var emailBorder = document.getElementById("userEmailFull");

    if (emailInput.value.match(validRegex)) {
      emailBorder.focus();
      emailBorder.classList.remove("border-red-400", "bg-red-50");

      try {
        setemailChecking(true);
        const response = await authService.checkEmail(emailInput.value);

        const data = response;

        if (!data.exists) {
          // const data = await response.json();

          // if (!data.exists) {
          //   document.getElementById("error").classList.add("invisible");
          //   const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
          setotpValue(data.otp);
          setemail(emailInput.value);
          setotpInput(true);
          // } else {
          //   setErrorMessage("Email already exists");
          // }
        } else {
          setErrorMessage("Email already exists");
          const errorMessage = "Failed to send email";
          console.error("Error checking email:", errorMessage);
        }
      } catch (error) {
        console.error("Error checking email:", error);
      } finally {
        setemailChecking(false);
      }
    } else {
      emailBorder.classList.add("border-red-400", "bg-red-50");
    }
  };

  const create = async (e) => {
    e.preventDefault();
    setloader(true);

    try {
      let response;
      if (userData.account_type === "Employeer") {
        response = await fetch(
          "https://workler-backend.vercel.app/api/auth/signup",
          // "http://localhost:5002/api/auth/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...userData, company_details }),
          }
        );
      } else {
        response = await fetch(
          // "http://localhost:5002/api/auth/signup",

          "https://workler-backend.vercel.app/api/auth/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...userData, personal_details }),
          }
        );
      }

      const token = await authService.login(userData.email, userData.password);
      const user = await authService.fetchUserDetails(token);
      localStorage.removeItem("token");
      localStorage.setItem("token", token);
      dispatch(loginSuccess(user));
      setloader(false);

      if (response.ok) {
        // const personal = profileApi.personal_details.add(personal_details, token);
        if (
          pathHistory.some(
            (path) => path.includes("/user") || path.includes("/job")
          )
        ) {
          const lastPath = () => {
            for (let i = pathHistory.length - 1; i >= 0; i--) {
              if (
                pathHistory[i].includes("/user") ||
                pathHistory[i].includes("/job")
              ) {
                return pathHistory[i];
              }
            }
            navigate(lastPath);
            return;
          };
        }
        navigate("/jobs");
      } else {
        const errorText = await response.text();
        throw new Error(errorText); // This will be caught by the catch block
      }

      setSuccessMessage("User created successfully");
      setAccountErrorMessage("");
    } catch (error) {
      setAccountErrorMessage("Signup failed");
      setSuccessMessage("");
    } finally {
      setloader(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-dvh  items-center w-full justify-center   text-gray-800 overflow-y-hidden ${
        !userNameAvailable || userData.username == "" ? "overflow-hidden" : ""
      }`}
    >
      <div
        className={` flex h-full flex-col bg-white justify-between items-center sm:justify-center  w-full   ${
          next ? "hidden" : null
        }`}
      >
        <div
          id="email-form"
          className={` w-full  sm:border px-6 sm:shadow-xl bg-white   sm:p-10 mt-24 sm:mt-0 max-w-sm flex  flex-col  `}
        >
          {/* <div className="w-full flex justify-center  py-2 mt-5 sm:mt-0 px-6">
            <Logo className={"size-24"} />
          </div> */}
          <div className=" text-center mt-4 w-full">
            <p className="text-2xl font-semibold text-gray-800 ">
              Hello User 👋
            </p>
            <p className=" text-gray-400">
              Enter you email address to get started
            </p>
          </div>

          <div
            className={`flex flex-col mt-8 w-full ${
              otpInput ? "hidden" : null
            }`}
          >
            <div id="userEmailFull" class="relative  flex peer  items-center">
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => {
                  handleInputChange(e);
                  setErrorMessage("");
                }}
                title="Email address"
                class="flex-1 block px-3 py-3 font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                style={{
                  "-webkit-autofill": "number",
                  "-webkit-box-shadow": "0 0 0px 1000px white inset",
                }}
              />
              <label
                for="email"
                class="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Email address
              </label>

              <div className=" text-gray-300 absolute w-14 flex items-center justify-center border-l h-9 cursor-pointer my-1  right-2 pl-1.5 ">
                {!emailChecking ? (
                  verified ? (
                    <img src={verifiedIcon} className="h-8 w-8" alt="" />
                  ) : (
                    <p
                      className="text-gray-800 cursor-pointer font-medium flex items-center my-1   "
                      onClick={(e) => {
                        verifyEmail();
                      }}
                    >
                      verify
                    </p>
                  )
                ) : (
                  <svg
                    aria-hidden="true"
                    class=" inline  w-6 h-6  self-center text-transparent animate-spin  fill-blue-500 "
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <p
            id="error"
            className={`text-red-500 px-2 mt-1 w-fit rounded-sm text-sm  transition-opacity duration-300 ${
              errorMessage ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            {errorMessage}
          </p>
          {purpose && (
            <OptionInput
              placeholder={"Purpose"}
              initialValue="Click to select"
              options={[
                { value: "Candidate", name: "Get highered" },
                {
                  value: "Employeer",
                  name: "Higher candidates",
                },
              ]}
              className={"mt-5"}
              onChange={handleInputChange}
              name={"account_type"}
            />
          )}
          <Otp
            verified={verified}
            setVerified={setverified}
            genertedOtp={otpValue}
            setPurpose={setpurpose}
            setOtpInput={setotpInput}
            text={email}
            className={`mt-2  ${!otpInput ? "hidden" : null}`}
          />
          <Button
            type="button"
            // disabled = {!(passwordCheck&&emailCheck)}
            onClick={() => {
              setNext(true);
            }}
            disabled={!verified || !userData.account_type}
            className="w-full flex justify-center mt-8 duration-200 font-semibold text-lg  text-white bg-gray-800 disabled:bg-gray-600"
          >
            {loader ? (
              <svg
                aria-hidden="true"
                class="inline w-7 h-7   text-transparent animate-spin fill-white "
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              "Next"
            )}
          </Button>
          {/* <p className=" hidden sm:block w-full text-center mt-10">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-gray-800 font-semibold cursor-pointer"
            >
              Login
            </Link>
          </p> */}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission to handle via JavaScript
          create(e);
        }}
        className={`sm:border w-full flex-1  sm:flex-none flex overflow-y-auto flex-col h-fit sm:w-full sm:max-w-fit px-4 md:mt-32 md:mb-10 py-10 sm:p-10 ${
          next ? null : "hidden"
        }`}
      >
        <div className="flex gap-3">
          <svg
            onClick={() => {
              setNext(false);
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>

          <div className="-mt-1">
            <p className="text-2xl font-semibold text-gray-800">
              Let's setup your account
            </p>
            <p className="text-sm text-gray-400">
              Enter your details to create your account
            </p>
          </div>
        </div>
        <p
          id="errorAccount"
          className="text-red-500 px-2 mt-1 w-fit rounded-sm text-sm bg-red-50"
        >
          {accountErrorMessage}
        </p>
        <p
          id="successAccount"
          className="text-green-500 px-2 mt-1 w-fit rounded-sm text-sm bg-green-50"
        >
          {successMessage}
        </p>

        <div className="flex flex-col gap-6 mt-10">
          <div className="flex gap-6 justify-start flex-wrap items-start">
            <div className="flex-grow">
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder=""
                  value={userData.username}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="flex-1 flex-grow block px-3 py-3 font-normal pr-[75px] bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  style={{
                    WebkitAutofill: "number",
                    WebkitBoxShadow: "0 0 0px 1000px white inset",
                  }}
                  title="Username can only contain letters, numbers, and underscores"
                />
                <label
                  htmlFor="username"
                  className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-gray-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  User name <span className="text-red-500">*</span>
                </label>

                <div className="text-gray-300 absolute bg-white px-3.5 flex items-center justify-center h-10 cursor-pointer right-px">
                  {usernameChecking || usernameChecked ? (
                    usernameChecked ? (
                      userNameAvailable ? (
                        <svg
                          className="h-8 w-8 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-8 w-8 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )
                    ) : (
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 text-transparent animate-spin fill-blue-500"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    )
                  ) : null}
                </div>
              </div>
              <p className="text-xs text-red-500 ml-1">{usernameError}</p>
            </div>

            {userNameAvailable && (
              <PasswordInput
                name={"password"}
                className={`transition-transform flex-grow duration-300 ease-in-out `}
                promptMessage={passwordMessage}
                isRequired={true}
                onChange={(e) => {
                  handleInputChange(e);

                  if (!verifyPassword(e.target.value).valid) {
                    setPasswordMessage({
                      type: "error",
                      text: verifyPassword(e.target.value).message,
                    });
                  } else {
                    setPasswordMessage(null);
                  }
                }}
                placeholder={"Password"}
                value={userData.password}
              />
            )}
          </div>
          {userNameAvailable && userData.account_type == "Candidate" && (
            <div
              className={`transition-transform  flex flex-col gap-6 duration-300 ease-in-out ${
                userNameAvailable
                  ? "md:flex opacity-100 translate-y-0"
                  : "md:hidden opacity-0 -translate-y-5"
              }`}
            >
              <div className="flex flex-wrap gap-6 w-full">
                <TextInput
                  name={"firstname"}
                  isRequired={true}
                  className={"flex-grow"}
                  value={personal_details.firstname}
                  onChange={(e) => {
                    setpersonal_details((prev) => ({
                      ...prev,
                      firstname: e.target.value,
                    }));
                  }}
                  placeholder={"First name"}
                />
                <TextInput
                  name={"lastname"}
                  value={personal_details.lastname}
                  className={"flex-grow"}
                  onChange={(e) => {
                    setpersonal_details((prev) => ({
                      ...prev,
                      lastname: e.target.value,
                    }));
                  }}
                  placeholder={"Last Name"}
                />
              </div>
              <div className="flex flex-wrap flex-col sm:flex-row gap-6 w-full">
                <DateInput
                  type={"date"}
                  className={"flex-grow"}
                  name={"birthdate"}
                  isRequired={true}
                  onChange={(e) => {
                    setpersonal_details((prev) => ({
                      ...prev,
                      birthdate: e.target.value,
                    }));
                  }}
                  placeholder={"Date of Birth"}
                  value={personal_details.birthdate}
                />
                <LocationInput
                  className={"flex-grow"}
                  placeholder={"Location"}
                  value={userData.location}
                  name="location"
                  isRequired={true}
                  onChange={(e) => {
                    setuserData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6 w-full">
                <NumberInput
                  name={"phone"}
                  max={9999999999}
                  className={"flex-grow min-w-32"}
                  value={personal_details.phone}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      setpersonal_details((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                    }
                  }}
                  placeholder={"Phone Number"}
                />
                <OptionInput
                  className={"flex-grow min-w-32"}
                  name={"gender"}
                  initialValue="Click to select"
                  options={[
                    {
                      name: "Male",
                      value: "Male",
                    },
                    {
                      name: "Female",
                      value: "Female",
                    },
                    {
                      name: "Non-binary",
                      value: "Non-binary",
                    },
                    {
                      name: "Others",
                      value: "Others",
                    },
                  ]}
                  placeholder={"Gender"}
                  onChange={(e) => {
                    setpersonal_details((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
          )}
          {userNameAvailable && userData.account_type == "Employeer" && (
            <div
              className={`transition-transform  flex flex-col gap-6 duration-300 ease-in-out `}
            >
              <div className="flex gap-6 flex-wrap">
                <TextInput
                  name={"company_name"}
                  className={"flex-grow"}
                  value={company_details.company_name}
                  onChange={(e) => {
                    if (company_details.company_name.length < 30) {
                      setcompany_details((prev) => ({
                        ...prev,
                        company_name: e.target.value,
                      }));
                    }
                  }}
                  placeholder={"Company name"}
                />

                <LocationInput
                  name={"location"}
                  className={"flex-grow"}
                  placeholder={"Company location"}
                  onChange={(e) => {
                    setcompany_details((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                  }}
                  value={company_details.location?.address}
                />
              </div>
              <div className="flex gap-6 flex-wrap">
                <OptionInput
                  name={"industry"}
                  options={[
                    "Agriculture",
                    "Automotive",
                    "Banking",
                    "Construction",
                    "Consulting",
                    "Consumer Goods",
                    "Education",
                    "Energy",
                    "Entertainment",
                    "Financial Services",
                    "Healthcare",
                    "Hospitality",
                    "Information Technology",
                    "Insurance",
                    "Manufacturing",
                    "Media",
                    "Nonprofit",
                    "Pharmaceuticals",
                    "Real Estate",
                    "Retail",
                    "Telecommunications",
                    "Transportation",
                    "Travel",
                    "Utilities",
                  ]}
                  className={"flex-grow"}
                  value={company_details.industry}
                  onChange={(e) => {
                    setcompany_details((prev) => ({
                      ...prev,
                      industry: e.target.value,
                    }));
                  }}
                  placeholder={"Industry"}
                />
                <DateInput
                  name={"found_in_date"}
                  type={"date"}
                  placeholder={"Found in"}
                  className={"flex-grow"}
                  onChange={(e) => {
                    setcompany_details((prev) => ({
                      ...prev,
                      found_in_date: e.target.value,
                    }));
                  }}
                  value={company_details.found_in_date}
                />
              </div>
              {/* <UrlInput
               name={"website"}
               placeholder={"Website"}
               className={"flex-grow"}
               onChange={(e) => {
                 setcompany_details((prev) => ({
                   ...prev,
                   website: e.target.value ,
                 }));
               }}
               value={company_details.website}
              /> */}
            </div>
          )}
        </div>
        <Button
          type="submit"
          className={`flex items-center text-xl justify-center   bg-gray-800 text-white py-2  rounded disabled:bg-gray-600 mt-6`}
          disabled={!isFormValid() || loader} // Ensure the form validation is active
        >
          {loader ? (
            <svg
              aria-hidden="true"
              className="inline w-7 h-7 text-transparent animate-spin fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "Create"
          )}
        </Button>
        {/* <p className="mt-10 hidden w-full text-center">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-gray-800 font-semibold cursor-pointer"
          >
            Login
          </Link>
        </p> */}
      </form>

      <p className="py-5 border-t-2 bg-white  sm:hidden w-full text-center">
        Already have an account?{" "}
        <Link
          to={"/login"}
          className="text-gray-800 font-semibold cursor-pointer"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
