import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import verifiedIcon from "../assets/verified.png";
import Otp from "../components/Otp";
import Button from "../components/Button/Button";
import PasswordInput from "../components/Input/PasswordInput";
import DateInput from "../components/Input/DateInput";
import TextInput from "../components/Input/TextInput";
import OptionInput from "../components/Input/OptionInput";
import useProfileApi from "../services/profileService";

function Signup() {
  const [otpInput, setOtpInput] = useState(false);
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [verified, setVerified] = useState(false);
  const [next, setNext] = useState(false);
  const [loader, setLoader] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [userNameAvailable, setUserNameAvailable] = useState(false);
  const [accountErrorMessage, setAccountErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const profileApi = useProfileApi();

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("File uploaded:", file.name);
  };

  useEffect(() => {
    const locationIcon = document.getElementById("locationIcon");
    if (locationIcon) {
      locationIcon.addEventListener("click", () => {
        document.getElementById("userAddress").value = "Kandivali West, Mumbai India";
      });
    }
  }, []);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    accountType: "",
  });

  const [personalDetails, setPersonalDetails] = useState({
    birthdate: "",
    fullname: "",
  });

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const isFormValid = () => {
    return (
      userData.username &&
      userData.email &&
      userData.password &&
      userData.accountType &&
      personalDetails.birthdate &&
      personalDetails.fullname
    );
  };

  const verifyUserName = (username) => {
    // Add your username verification logic here
  };

  const verifyEmail = async () => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailInput = document.getElementById("email");
    const emailBorder = document.getElementById("userEmailFull");

    if (emailInput.value.match(validRegex)) {
      emailBorder.focus();
      emailBorder.classList.remove("border-red-400", "bg-red-50");

      try {
        setEmailChecking(true);
        const response = await fetch(
          "https://workler-backend.vercel.app/api/auth/check-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: emailInput.value }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (!data.exists) {
            document.getElementById("error").classList.add("invisible");
            const otp = Math.floor(100000 + Math.random() * 900000);
            setOtpValue(otp);
            setEmail(emailInput.value);
            setOtpInput(true);
          } else {
            setErrorMessage("Email already exists");
          }
        } else {
          const errorMessage = await response.text();
          console.error("Error checking email:", errorMessage);
        }
      } catch (error) {
        console.error("Error checking email:", error);
      } finally {
        setEmailChecking(false);
      }
    } else {
      emailBorder.classList.add("border-red-400", "bg-red-50");
    }
  };

  const create = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const personalDetailsResponse = await profileApi.personalDetails.add(personalDetails);
      if (!personalDetailsResponse.ok) {
        const errorText = await personalDetailsResponse.text();
        throw new Error(errorText);
      }

      const response = await fetch("http://localhost:5002/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        await profileApi.personalDetails.delete();
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setSuccessMessage("User created successfully");
      setAccountErrorMessage("");
    } catch (error) {
      setAccountErrorMessage(error.message || "Error creating user");
      setSuccessMessage("");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center w-full justify-center text-gray-800">
      <div className={`flex h-full flex-col justify-between items-center sm:justify-center w-full ${next ? "hidden" : ""}`}>
        <div id="email-form" className="w-full sm:border px-6 mt-10 sm:p-10 max-w-sm flex flex-col">
          <div>
            <p className="text-2xl font-semibold text-gray-800">Hello User</p>
            <p className="text-sm text-gray-400">Enter your email address to get started</p>
          </div>
          <p id="error" className={`text-red-500 px-2 mt-1 w-fit rounded-sm text-sm bg-red-50 transition-opacity duration-300 ${errorMessage ? "opacity-100 visible" : "opacity-0 invisible"}`}>{errorMessage}</p>
          <div className={`flex flex-col mt-16 w-full ${otpInput ? "hidden" : ""}`}>
            <div id="userEmailFull" className="relative flex peer items-center">
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => {
                  handleInputChange(e);
                  setErrorMessage("");
                }}
                title="Email address"
                className="flex-1 block px-3 py-3 font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5"
              >
                Email address
              </label>
              <div className="text-gray-300 absolute w-14 flex items-center justify-center border-l h-9 cursor-pointer my-1 right-2 pl-1.5">
                {!emailChecking ? (
                  verified ? (
                    <img src={verifiedIcon} className="h-8 w-8" alt="Verified" />
                  ) : (
                    <p
                      className="text-blue-500 cursor-pointer font-medium flex items-center my-1"
                      onClick={verifyEmail}
                    >
                      Verify
                    </p>
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
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5532C95.2932 28.8224 92.871 24.3692 89.8167 20.348C85.8767 15.1192 80.776 10.723 74.8961 7.55344C68.9161 4.30237 62.3736 2.63543 55.6306 2.05027C49.7426 1.50484 43.8935 2.04826 38.158 3.64951C35.7363 4.35081 34.2721 6.85979 34.9092 9.28521C35.5464 11.7106 38.0211 13.1334 40.4065 12.5458C44.9993 11.478 49.7991 11.1173 54.536 11.5306C59.6271 11.9654 64.5804 13.4568 69.0516 15.9314C73.1237 18.2721 76.6978 21.5753 79.5534 25.639C81.913 28.9662 83.7081 32.5697 84.8734 36.3636C85.6561 38.7758 87.5426 40.2559 89.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                )}
              </div>
            </div>
            <button
              id="next"
              type="button"
              className="rounded-sm text-sm flex justify-center items-center mt-8 w-full bg-blue-500 border text-white px-3 py-2.5 hover:bg-blue-600 focus:outline-none focus:ring-0"
              onClick={() => setNext(true)}
            >
              Next
            </button>
          </div>
          <div className={`w-full ${otpInput ? "" : "hidden"}`}>
            <Otp
              setOtpInput={setOtpInput}
              setVerified={setVerified}
              setErrorMessage={setErrorMessage}
              otp={otpValue}
              setOtp={setOtpValue}
            />
          </div>
        </div>
      </div>
      <form
        onSubmit={create}
        className={`flex flex-col h-screen justify-between ${next ? "" : "hidden"} w-full max-w-sm px-4 py-6`}
      >
        <p className="text-2xl font-semibold text-gray-800">Signup</p>
        <div className="flex flex-col mt-6">
          <TextInput
            name="username"
            id="username"
            value={userData.username}
            label="Username"
            onChange={(e) => {
              handleInputChange(e);
              setUsernameChecked(false);
              setUserNameAvailable(false);
              setUsernameChecking(false);
              setUsernameChecking(false);
              setAccountErrorMessage("");
              verifyUserName(e.target.value);
            }}
          />
          <TextInput
            name="email"
            id="userEmail"
            value={userData.email}
            label="Email"
            onChange={(e) => handleInputChange(e)}
            disabled
          />
          <PasswordInput
            name="password"
            id="password"
            value={userData.password}
            label="Password"
            onChange={(e) => handleInputChange(e)}
          />
          <OptionInput
            name="accountType"
            id="accountType"
            value={userData.accountType}
            label="Account Type"
            onChange={(e) => handleInputChange(e)}
            options={[
              { value: "", label: "Select" },
              { value: "individual", label: "Individual" },
              { value: "corporate", label: "Corporate" },
            ]}
          />
          <DateInput
            name="birthdate"
            id="birthdate"
            value={personalDetails.birthdate}
            label="Birthdate"
            onChange={(e) =>
              setPersonalDetails((prevState) => ({ ...prevState, birthdate: e.target.value }))
            }
          />
          <TextInput
            name="fullname"
            id="fullname"
            value={personalDetails.fullname}
            label="Full Name"
            onChange={(e) =>
              setPersonalDetails((prevState) => ({ ...prevState, fullname: e.target.value }))
            }
          />
          <div className="flex items-center mt-4">
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              className="flex items-center justify-center w-full bg-blue-500 border text-white px-3 py-2.5 hover:bg-blue-600 focus:outline-none focus:ring-0"
              onClick={handleIconClick}
            >
              Upload Profile Picture
            </Button>
          </div>
          {accountErrorMessage && (
            <div className="text-red-500 px-2 mt-1 w-fit rounded-sm text-sm bg-red-50">{accountErrorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 px-2 mt-1 w-fit rounded-sm text-sm bg-green-50">{successMessage}</div>
          )}
          <Button
            type="submit"
            className={`rounded-sm text-sm flex justify-center items-center mt-8 w-full ${loader ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} border text-white px-3 py-2.5 focus:outline-none focus:ring-0`}
            disabled={loader || !isFormValid()}
          >
            {loader ? "Loading..." : "Sign Up"}
          </Button>
        </div>
        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
