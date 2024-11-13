import { useState, useEffect } from "react";
import LogoCircle from "../assets/LogoCircle";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [disableResetLink, setDisableResetLink] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resetLinkLoading, setResetLinkLoading] = useState(false);


  useEffect(() => {
  
      document.title = "Forget password";

    
    
   }, []);
  // Handle Resend Link and Timer Countdown
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   if(emailSent){
    setResetLinkLoading(true);
   }
    console.log("Hello");

    try {
      const response = await fetch(
        "https://workler-backend.vercel.app/api/auth/request-password-reset",
        // "http://localhost:5002/api/auth/request-password-reset",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json(); // Ensure you parse the response as JSON
      console.log(data);
      if (response.ok) {
        setEmailSent(true);
        setMessage({ success: data.message });
      } else {
        setMessage({ error: data.error });
      }

      setDisableResetLink(true);
      setTimer(30); // Reset the timer to 30 seconds
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown); // Clear the interval when timer reaches 0
            setDisableResetLink(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Update the timer every second
    } catch (error) {
      console.log(error);
      setMessage({ error: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
      setResetLinkLoading(false);
    }
  };

  return (
    <div className="flex sm:justify-center h-screen sm:items-center">
      <div className="max-w-md mx-auto bg-white sm:p-10 p-6 sm:border sm:shadow-lg">
        <LogoCircle />
        <h2 className="text-2xl font-semibold text-gray-800 mt-10">
          Forgot Your Password?
        </h2>
        <p className="mb-4 mt-1 text-gray-400">
          Enter your email address below to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-7">
          <div id="userEmailFull" className="relative flex peer items-center">
            <input
              type="email"
              id="email"
              name="email"
              value={email} // Bind email state to the input field
              onChange={(e) => setEmail(e.target.value)} // Corrected event handling
              title="Email address"
              className="flex-1 block px-3 py-3 font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              style={{
                "-webkit-autofill": "number",
                "-webkit-box-shadow": "0 0 0px 1000px white inset",
              }}
            />
            <label
              htmlFor="email"
              className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Email address
            </label>
          </div>

          {emailSent ? (
            <div className="mt-4">
              <button className="text-blue-500" >
                Didn't receive the email?{" "}
                <button
                onClick={handleSubmit}
                  disabled={disableResetLink || resetLinkLoading}
                  className="text-gray-800 disabled:text-gray-400 font-medium"
                >
                  {resetLinkLoading ? "Resending link..." : "Resend link"}
                  {disableResetLink && (
                    <span className="ml-2 font-medium text-gray-400">
                      {timer}s
                    </span>
                  )}
                </button>
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-2.5 mt-2 disabled:bg-gray-600 bg-gray-800 font-medium text-white rounded-lg focus:outline-none"
            >
              {loading ? "Sending request..." : "Password reset"}
            </button>
          )}
        </form>

        {message && (
          <p
            className={`mt-4 text-center  ${
              message.error
                ? "text-red-500"
                : "text-green-500 font-medium bg-green-50 py-2.5 rounded-lg"
            }`}
          >
            {message.error ? message.error : message.success}
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
