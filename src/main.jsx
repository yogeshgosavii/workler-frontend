// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store.js";
import "./index.css";

import Jobs from "./pages/Jobs.jsx";
import Companies from "./pages/Companies.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import JobProfile from "./pages/JobProfile.jsx";
import CompanyProfile from "./pages/CompanyProfile.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import NotFound from "./pages/exception/NotFound.jsx";

import LoginVerification from "./verification/LoginVerification.jsx";
import PageTransition from "./transitions/PageTransition.jsx";
import UserHome from "./pages/UserHome.jsx";
import Notification from "./pages/Notification.jsx";
import Search from "./pages/Search.jsx";
import PostForm from "./components/Forms/PostForm.jsx";
import UserProfileView from "./components/UserProfileView.jsx";
import JobProfileView from "./components/JobProfileView.jsx";
import Employment from "./pages/Employment.jsx";
import JobApplication from "./pages/JobApplication.jsx";
import Manager from "./pages/Manager.jsx";
import PostView from "./components/PostView.jsx";
import Saved from "./pages/settings/Saved.jsx";
import Preferences from "./pages/settings/Preferences.jsx";
import AccountSettings from "./pages/settings/AccountSettings";
import Settings from "./pages/settings/Settings.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Connections from "./pages/Connections.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LoginVerification loginRequired={false}>
        {/* <PageTransition> */}
        <App />
        {/* </PageTransition> */}
      </LoginVerification>
    ),
    children: [
      { path: "/", element: <Home /> },
      // { path: "/jobs", element: <Jobs /> },
      { path: "/jobs/:jobQuery", element: <Jobs /> },
      { path: "/jobs/", element: <Jobs /> },

      { path: "job/:jobId", element: <JobProfileView /> },
      { path: "user/:userId", element: <UserProfileView /> },

      // { path: "/companies", element: <Companies /> },
      // { path: "/companies/:companyId", element: <CompanyProfile /> },
      {
        path: "/home",
        element: (
          <LoginVerification>
            <UserHome />
          </LoginVerification>
        ),
      },
      {
        path: "/notifications",
        element: (
          <LoginVerification>
            <Notification />
          </LoginVerification>
        ),
      },
      {
        path: "/manager",
        element: (
          <LoginVerification>
            <Manager />
          </LoginVerification>
        ),
      },
      {
        path: "/post/:postId",
        element: (
          <LoginVerification>
            <PageTransition>
              <PostView />
            </PageTransition>
          </LoginVerification>
        ),
      },
      {
        path: "/job-applications",
        element: (
          <LoginVerification>
            <JobApplication />
          </LoginVerification>
        ),
      },
      {
        path: "/search",
        element: (
          <LoginVerification>
            <Search />
          </LoginVerification>
        ),
        children: [],
      },
      // {
      //   path: "/post",
      //   element: (
      //     <LoginVerification>
      //       <PageTransition>
      //         <PostForm />
      //       </PageTransition>
      //     </LoginVerification>
      //   ),
      // },
    ],
  },
  { path: "/forgot-password", element: <ForgotPassword/> }, 

  { path: "/password-reset/:token", element: <ResetPassword /> }, 

  { path: "/jobs/:jobId", element: <JobProfile /> },

  {
    path: "/profile",
    element: (
      <LoginVerification>
          <UserProfile />
      </LoginVerification>
    ),
    children: [
      {
        path: "post",
        element: (
          <LoginVerification>
              <PostForm />
          </LoginVerification>
        ),
      },
      {
        path: "settings/preferences",
        element: (
          <LoginVerification>
              <Preferences />
          </LoginVerification>
        ),
      },
      {
        path: "settings/account-settings",
        element: (
          <LoginVerification>
              <AccountSettings />
          </LoginVerification>
        ),
      },
      {
        path: "settings",
        element: (
          <LoginVerification>
              <Settings />
          </LoginVerification>
        ),
        
      },

      {
        path: "settings/saveds",
        element: (
          <LoginVerification>
              <Saved />
          </LoginVerification>
        ),
      },
    ],
  },

  {
    path: "/connections/:userId",
    element: (
      <LoginVerification>
        <PageTransition>
          <Connections />
        </PageTransition>
      </LoginVerification>
    ),
  },

  {
    path: "/post",
    element: (
      <LoginVerification>
        <PageTransition>
          <PostForm />
        </PageTransition>
      </LoginVerification>
    ),
  },

  {
    path: "/login",
    element: (
      <LoginVerification loginRequired={false}>
        <PageTransition>
          <Login />
        </PageTransition>
      </LoginVerification>
    ),
  },
  {
    path: "/signup",
    element: (
      <LoginVerification loginRequired={false}>
        <PageTransition>
          <Signup />
        </PageTransition>
      </LoginVerification>
    ),
  },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate
      loading={<div className="loading">Loading...</div>}
      persistor={persistor}
    >
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
