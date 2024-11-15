import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import authService from "../../services/authService";
import { updateUserDetails } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import PasswordInput from "../../components/Input/PasswordInput";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

function AccountSettings() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameChecking, setusernameChecking] = useState(false);
  const [usernameChecked, setusernameChecked] = useState(false);
  const [userNameAvailable, setuserNameAvailable] = useState(false);
  const [usernameError, setusernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();

  // Track the active section
  const [activeSection, setActiveSection] = useState(null);

  const userData = useSelector((state) => state.auth.user);
  const usernameTimeout = useRef(null);


  useEffect(() => {
    document.title = "Account settings"  
 }, []);
  // Set the username when the component mounts or userData changes
  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
    }
  }, [userData]);

  const verifyPassword = (newPassword, currentPassword) => {
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
    if (newPassword === currentPassword) {
      return {
        valid: false,
        message: "New password cannot be the same as the current password",
      };
    }

    // Check if password length is at least 6 characters
    if (newPassword.length < 6) {
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
    return { valid: true, message: "Password is strong" };
  };

  const updatePassword = async () => {
    setPasswordLoading(true);
    setPasswordError("");
    const passwordCheck = verifyPassword(newPassword, currentPassword);

    if (passwordCheck.valid) {

      try {
        const passwordResponse = await authService.updatePassword({
          currentPassword,
          newPassword,
        });

        setCurrentPassword("");
        setNewPassword("");

      } catch (error) {
        // Show specific error message from the response
        setPasswordError(
          error.message || "An error occurred while updating the password."
        );
      } finally {
        setPasswordLoading(false);
      }
    } else {
      setPasswordError(passwordCheck.message);
      setPasswordLoading(false);
    }
  };

  const verifyUserName = async (value) => {
    setusernameChecking(true);
    setusernameChecked(false);

    try {
      if (value.length === 0) {
        setuserNameAvailable(false);
        setusernameError("Username cannot be empty");
      } else if (value.length > 30) {
        setuserNameAvailable(false);
        setusernameError("Username can only have 30 characters");
      } else {
        const response = await authService.checkUsername(value);
        if (response.exists) {
          setuserNameAvailable(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
    }
  };

  // Function to toggle sections
  const toggleSection = (section) => {
    setActiveSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  return (
    <div className="h-full">
      {/* Overlay */}
      <div
        onClick={() => {
          window.history.back();
        }}
        className="fixed inset-0 bg-black opacity-30 z-20"
      ></div>

      {/* Modal for Account Settings */}
      <div className="fixed w-full sm:max-w-lg right-0 text-gray-800   h-full  px-4 sm:px-6 py-6 sm:py-8 bg-white top-0 z-30  overflow-y-auto">
        <h2 className="text-2xl font-bold mb-10 ">Account Settings</h2>

        <div className="space-y-4 mb-3">
          <button
            onClick={() => toggleSection("username")}
            className={`w-full pb-4 flex justify-between items-center border-b`}
          >
            <div className="flex gap-4 items-center">
              <svg
                class="h-6 w-6 "
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
              <p className="font-medium">Username</p>
            </div>
            <span>
              {activeSection === "username" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-up"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              )}
            </span>
          </button>

          <div
            className={`overflow-hidden  transition-all duration-300 ${
              activeSection === "username"
                ? "max-h-40 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex-grow mt-3">
              <div className="relative flex mt-2 items-center">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameTimeout.current) {
                      clearTimeout(usernameTimeout.current);
                    }

                    if (e.target.value !== "") {
                      usernameTimeout.current = setTimeout(() => {
                        setusernameChecking(true);
                        verifyUserName(e.target.value);
                      }, 500);
                    } else {
                      setuserNameAvailable(false);
                      setusernameError("Username cannot be empty");
                    }
                  }}
                  className="flex-1 flex-grow block px-3 py-3 font-normal pr-[75px] bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                />
                <label
                  htmlFor="username"
                  className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5"
                >
                  Username
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
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9922 72.5987 9.67236 50 9.67236C27.4013 9.67236 9.08144 27.9922 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5535C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.723 75.2124 7.55624C69.5422 4.38948 63.2754 2.58864 56.7663 2.26872C51.7668 2.00443 46.8042 2.78534 42.0894 4.56016C39.4625 5.50718 38.6447 8.43212 40.3155 10.5912C41.5188 12.2066 43.8268 12.8192 45.8171 12.1003C49.4185 10.8417 53.2024 10.3373 56.9665 10.6449C61.9635 11.0609 66.8086 12.7124 71.0663 15.4772C75.324 18.2419 78.8814 21.9813 81.5178 26.4297C83.7936 30.1346 85.3179 34.1928 86.0029 38.349C86.4526 40.9671 89.069 42.2879 91.6054 41.5922L93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {usernameError && (
                <div className="text-sm text-red-500 mt-2">{usernameError}</div>
              )}
            </div>
            <button
              onClick={async () => {
                const response = await authService.updateUserDetails({
                  ...userData,
                  username: username,
                });
                dispatch(updateUserDetails(response));
              }}
              className={`${
                username == userData.username ||
                usernameChecking ||
                !userNameAvailable
                  ? "bg-blue-300"
                  : "bg-blue-500"
              } w-full mt-5 text-lg mb-5 rounded-md py-2.5 text-white font-medium`}
            >
              Update Username
            </button>
          </div>
        </div>

        {/* Password and Email Sections */}
        <div className="space-y-4 mb-6 ">
          <button
            onClick={() => toggleSection("password")}
            className={`w-full pb-4 flex justify-between items-center border-b`}
          >
            <div className="flex gap-4 items-center">
              <svg
                class="h-6 w-6 "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {" "}
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />{" "}
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p className="font-medium">Password</p>
            </div>
            <span>
              {activeSection === "password" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-up"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              )}
            </span>
          </button>

          <div
            className={` transition-all duration-300 ${
              activeSection === "password"
                ? "max-h-40 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-4 mt-6">
              <PasswordInput
                name={"current_password"}
                className={`transition-transform flex-grow duration-300 ease-in-out `}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                }}
                placeholder={"Current password"}
                value={currentPassword}
              />
              <PasswordInput
                name={"new_password"}
                className={`transition-transform flex-grow duration-300 ease-in-out`}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                placeholder={"New password"}
                value={newPassword}
              />
            </div>
            <div className="mt-2 text-end">
              <Link to="/forgot-password">
                <p className="text-blue-500 font-medium cursor-pointer">
                  Forgot password?
                </p>
              </Link>
            </div>
            {passwordError && (
              <div className="text-sm text-red-500 mt-2">{passwordError}</div>
            )}
            {/* <button
              onClick={() => {
                updatePassword();
              }}
              className={`${
                currentPassword && newPassword && newPassword.length > 6
                  ? "bg-blue-500"
                  : "bg-blue-300"
              } w-full mt-5 text-lg transition-all rounded-md py-2 text-white font-medium`}
            >
              Change password
            </button> */}

            <Button
              onClick={() => {
                updatePassword();
              }}
              type="submit"
              className={`flex items-center text-lg justify-center bg-blue-500  disabled:bg-blue-300  text-white py-3  w-full mt-5`}
              disabled={
                !currentPassword ||
                !newPassword ||
                newPassword.length < 6 ||
                passwordLoading
              } // Ensure the form validation is active
            >
              {passwordLoading ? (
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
                "Change password"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
