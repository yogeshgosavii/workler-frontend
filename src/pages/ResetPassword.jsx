import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PasswordInput from "../components/Input/PasswordInput";
import LogoCircle from "../assets/LogoCircle";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [validToken, setValidToken] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [passwordError, setPasswordError] = useState();

  const navigate = useNavigate();

    useEffect(() => {
      document.title = "Reset Password";
    
   }, []);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await fetch(
          `https://workler-backend.vercel.app/api/auth/validate-reset-token/${token}`
        );
        console.log(response);

        setValidToken(response.ok);
      } catch (error) {
        setValidToken(false);
      }
    };
    checkTokenValidity();
  }, [token]);

  const verifyPassword = (newPassword, confirmPassword) => {
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
    if (newPassword !== confirmPassword) {
      return {
        valid: false,
        message: "New password should match the confirm password",
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

  //   const handleResetPassword = async (e) => {
  //     e.preventDefault();

  //     if (!newPassword) {
  //       setMessage('Please enter a new password.');
  //       return;
  //     }

  //     setIsSubmitting(true);

  //     try {
  //       const response = await fetch(`http://localhost:5002/api/auth/reset-password/${token}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ newPassword })
  //       });
  //       const result = await response.json();

  //       if (result.success) {
  //         setMessage('Your password has been reset successfully!');
  //         setTimeout(() => navigate('/login'), 2000);
  //       } else {
  //         setMessage('Failed to reset password. Try again.');
  //       }
  //     } catch (error) {
  //       setMessage('An error occurred. Please try again.');
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  const updatePassword = async () => {
    setPasswordLoading(true);
    setPasswordError("");
    const passwordCheck = verifyPassword(newPassword, confirmPassword);

    if (passwordCheck.valid) {
      console.log("Password is valid, proceeding with update...");

      try {
        const passwordResponse = await fetch(
          `https://workler-backend.vercel.app/api/auth/reset-password/${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPassword }),
          }
        );

        setConfirmPassword("");
        setNewPassword("");

        console.log("Password updated successfully:", passwordResponse);
      } catch (error) {
        // Show specific error message from the response
        setPasswordError(
          error.message || "An error occurred while updating the password."
        );
        console.log("Error:", error);
      } finally {
        setPasswordLoading(false);
      }
    } else {
      setPasswordError(passwordCheck.message);
      setPasswordLoading(false);
    }
  };
  //   const handleResetPassword = async (e) => {
  //     e.preventDefault();

  //     if (!newPassword) {
  //       setMessage('Please enter a new password.');
  //       return;
  //     }

  //     setIsSubmitting(true);

  //     try {
  //       const response = await fetch(`http://localhost:5002/api/auth/reset-password/${token}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ newPassword })
  //       });
  //       const result = await response.json();

  //       if (result.success) {
  //         setMessage('Your password has been reset successfully!');
  //         setTimeout(() => navigate('/login'), 2000);
  //       } else {
  //         setMessage('Failed to reset password. Try again.');
  //       }
  //     } catch (error) {
  //       setMessage('An error occurred. Please try again.');
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  return (
    <div className="flex justify-center sm:items-center min-h-screen ">
      {validToken ? (
        <div className="max-w-md w-full p-6  sm:shadow-lg sm:border bg-white  ">
          <LogoCircle />
          <h1 className="text-2xl mt-14 font-semibold mb-1  text-gray-800">
            Reset Your Password
          </h1>
          <p className="text-gray-400 mb-4">
            Please create a new password to secure your account. Make sure it’s
            something unique and memorable.
          </p>

          <form
            onSubmit={() => {
              updatePassword();
            }}
            className="flex flex-col"
          >
            <div className="flex flex-col gap-4 mt-6">
              <PasswordInput
                name={"new_password"}
                className={`transition-transform flex-grow duration-300 ease-in-out `}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                placeholder={"New password"}
                value={newPassword}
              />
              <PasswordInput
                name={"confirm_password"}
                className={`transition-transform flex-grow duration-300 ease-in-out`}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                placeholder={"Confirm password"}
                value={confirmPassword}
              />
            </div>
            {passwordError && (
              <div className="text-sm text-red-500 mt-2">{passwordError}</div>
            )}
            <button
              type="submit"
              disabled={isSubmitting || newPassword.length < 6 || confirmPassword.length < 6 }
              className={`p-2.5 mb-4 mt-10 rounded-lg text-lg text-white font-semibold bg-gray-800 disabled:bg-gray-600  focus:outline-none focus:ring-2 `}
            >
              {isSubmitting ? "Resetting password..." : "Reset password"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      ) : (
        <div className="max-w-md w-full p-8 rounded-lg shadow-lg bg-white text-center">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">
            Invalid or Expired Token
          </h1>
          <p className="text-red-600">
            The password reset link you followed is invalid or has expired.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
