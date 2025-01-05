import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button/Button";
import { loginSuccess, loginFailure } from "../features/auth/authSlice";
import authService from "../services/authService";
import LogoCircle from "../assets/LogoCircle";
import { PathHistoryContext } from "../components/PathHistoryContext";

function Login({ userType = "candidate" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const { pathHistory } = useContext(PathHistoryContext);

  const prevPath =
    pathHistory.length > 1 ? pathHistory[pathHistory.length - 2] : "None";
  useEffect(() => {
    document.title = "Login";
    console.log(prevPath);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailCheck || !passwordCheck) {
      setError("Invalid email or password.");
      return;
    }
    try {
      setLoader(true);
      const token = await authService.login(email, password);
      const userData = await authService.fetchUserDetails(token);
      localStorage.setItem("token", token);
      dispatch(loginSuccess(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      setLoader(false);

      if (prevPath.includes("/user") || prevPath.includes("/job")) {
        navigate(prevPath);
        return;
      }

      navigate("/home"); // Redirect to dashboard on successful login
    } catch (error) {
      setError(
        "Login failed. Please check your email and password and try again."
      );
      setLoader(false);
      dispatch(loginFailure(error.message));
    }
  };

  return (
    <div className="h-dvh flex flex-col bg-white text-gray-700 justify-between">
      <div className="flex-1 flex flex-col w-full items-center sm:justify-center text-gray-800">
        <div className="bg-white flex sm:max-w-sm w-full flex-row mt-0.5 sm:border sm:shadow-xl">
          <div className="w-full px-6 pt-6 sm:p-10 duration-200">
            {/* <LogoCircle/> */}
            <h2 className="text-2xl font-semibold leading-tight mt-16 sm:mt-0">
              Sign in
            </h2>
            <p className="text-gray-400  font-normal">
              Enter your registered email and password
            </p>
            <p
              id="error"
              className={`text-red-500 mt-1 w-fit rounded-sm text-sm ${
                error ? "" : "invisible"
              }`}
            >
              {error}
            </p>
            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="relative flex peer">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailCheck(validateEmail(e.target.value));
                  }}
                  className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=""
                  title="Email address"
                />
                <label
                  htmlFor="userEmail"
                  onClick={(e) => {
                    e.preventDefault();
                    e.target.previousSibling.focus();
                  }}
                  className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Email address
                </label>
              </div>
              <div className="relative flex peer mt-5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordCheck(e.target.value.length >= 6);
                  }}
                  title="Password"
                  className="flex-1 block px-3 py-3 font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="userPassword"
                  onClick={(e) => {
                    e.preventDefault();
                    e.target.previousSibling.focus();
                  }}
                  className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Password
                </label>
                <div
                  className="text-gray-300 absolute mt-0.5 w-14 flex items-center justify-center cursor-pointer right-2 top-2"
                  onMouseDown={(e) => e.preventDefault()}
                  id="passwordEye"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ zIndex: "5" }}
                >
                  {showPassword ? (
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-8 w-8 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="mt-2 text-end">
                <Link to="/forgot-password">
                  <p className="text-blue-500 font-medium cursor-pointer">
                    Forgot password?
                  </p>
                </Link>
              </div>
              <Button
                type="submit"
                disabled={!(passwordCheck && emailCheck && !loader)}
                className="w-full flex py-1 items-center justify-center text-lg mt-6 duration-200 font-semibold text-white bg-gray-800 disabled:bg-gray-600"
              >
                {loader ? (
                  <div className="flex items-center gap-5">
                    Signing in
                    <svg
                      className="inline w-6 h-6 text-transparent animate-spin fill-white"
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
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
            {/* <p className="mt-8 hidden sm:block w-full text-center">
              Haven't been here before?{" "}
              <Link
                to={"/signup"}
                className="text-gray-800 font-semibold cursor-pointer"
              >
                Signup
              </Link>
            </p> */}
          </div>
        </div>
      </div>
      <p className="py-5 border-t-2 sm:hidden w-full text-center">
        Haven't been here before?{" "}
        <Link
          to={"/signup"}
          className="text-gray-800 font-semibold cursor-pointer"
        >
          Signup
        </Link>
      </p>
    </div>
  );
}

export default Login;
