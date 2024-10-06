import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="">
      <div
        onClick={() => {
          window.history.back();
        }}
        className="fixed w-full h-full bg-black opacity-30 z-20 top-0 left-0"
      ></div>
      <div
        className={`fixed  top-0 border-l  z-40 h-full delay-150 w-full sm:max-w-lg bg-white transition-all duration-300 ease-in-out 
          ${true ? " right-0 sm:-right[60%]" : "-right-[60%]"}
          `}
      >
        <div className="p-4 sm:p-6 flex  h-full justify-between flex-col">
          <div>
            <h2 className="text-2xl font-bold ">Settings</h2>
            <div className="flex-1 mt-6 flex flex-col text-lg gap-5">
              <div
                onClick={() => {
                  navigate("account-settings");
                }}
                className="flex gap-4 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-person-lock"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
                </svg>
                <p className="-mt-0.5">Account settings</p>
              </div>
              <div
                onClick={(e) => {
                  navigate("/profile/settings/preferences");
                }}
                className="flex gap-3  items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-sliders2"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"
                  />
                </svg>
                <p className="-mt-0.5">Preferences</p>
              </div>
              <div
                onClick={(e) => {
                  navigate("saveds");
                }}
                className="flex gap-3  items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-bookmark"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                </svg>
                <p className="-mt-0.5">Saveds</p>
              </div>
            </div>
          </div>
          <a
           onClick={() => {
            console.log("logout");
            dispatch(logout());
            navigate("/", { replace: true });
          }}
           className="flex gap-4 items-center">
            <svg
              class="h-6 w-6 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />{" "}
              <polyline points="10 17 15 12 10 7" />{" "}
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <p
             
              className="-mt-0.5 text-red-500 font-medium text-lg"
            >
              Sign out
            </p>
          </a>
        </div>
      </div>

      {/* <div className="fixed w-full hidden sm:block left-0 sm:left-[15%] md:left-[20%] lg:left-[30%]    sm:max-h-96 sm:max-w-lg  px-4 py-4  border sm:rounded-lg  top-0   overflow-y-auto z-30  bg-white rounded-lg h-full  ">
        <div className="p-6 flex h-full flex-col">
          <h2 className="text-2xl font-bold ">Settings</h2>
          <div className="flex-1 mt-6 flex flex-col text-lg gap-4">
            <p
             onClick={(e) => {
              e.preventDefault();
              navigate("/profile/settings/account-settings");
            }}
            >Account settings</p>
            <p
              onClick={(e) => {
                e.preventDefault();
                navigate("/profile/settings/preferences");
              }}
            >
              Preferences
            </p>
            <p 
             onClick={(e) => {
              e.preventDefault();
              navigate("/profile/settings/saveds");
            }}>Saveds</p>
          </div>
          <a
            onClick={() => {
              console.log("logout");
              dispatch(logout());
              navigate("/", { replace: true });
            }}
            className="mt-10 bg-red-50 font-bold w-fit py-1 px-3 rounded-md border border-red-500 text-red-500"
          >
            Sign out
          </a>
        </div>
      </div> */}
    </div>
  );
}

export default Settings;
