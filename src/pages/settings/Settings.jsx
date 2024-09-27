import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div>
      <div
        onClick={() => {
          window.history.back();
        }}
        className="fixed w-full h-full bg-black opacity-30 z-20 top-0 left-0"
      ></div>
      <div
        className={`fixed sm:hidden top-0 border-l  z-40 h-full w-[60%] bg-white transition-all duration-300 ease-in-out 
          ${true ? " right-0 sm:-right[60%]" : "-right-[60%]"}
          `}
      >
        <div className="p-4 flex  h-full justify-between flex-col">
          <div>
            <h2 className="text-2xl font-bold ">Settings</h2>
            <div className="flex-1 mt-6 flex flex-col text-lg gap-4">
              <p
                onClick={() => {
                  navigate("account-settings");
                }}
              >
                Account settings
              </p>
              <p
                onClick={(e) => {
                  navigate("/profile/settings/preferences");
                }}
              >
                Preferences
              </p>
              <p>Saveds</p>
            </div>
          </div>
          <a
            onClick={() => {
              console.log("logout");
              dispatch(logout());
              navigate("/", { replace: true });
            }}
            className="mt-2 bg-red-50 font-bold w-fit py-1 px-3 rounded-md border border-red-500 text-red-500"
          >
            Sign out
          </a>
        </div>
      </div>

      <div className="fixed w-full hidden sm:block left-0 sm:left-[15%] md:left-[20%] lg:left-[30%]   sm:h-fit sm:max-h-96 sm:max-w-lg  px-4 py-4  border sm:rounded-lg  top-0 sm:top-[20%]  overflow-y-auto z-30  bg-white rounded-lg h-full  ">
        <div className="p-6 flex h-full flex-col">
          <h2 className="text-2xl font-bold ">Settings</h2>
          <div className="flex-1 mt-6 flex flex-col text-lg gap-4">
            <p>Account settings</p>
            <p
              onClick={(e) => {
                e.preventDefault();
                navigate("/profile/settings/preferences");
              }}
            >
              Preferences
            </p>
            <p>Saveds</p>
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
      </div>
    </div>
  );
}

export default Settings;
