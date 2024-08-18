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
      { path: "/jobs", element: <Jobs /> },
      { path: "/companies", element: <Companies /> },
      { path: "/jobs/:jobId", element: <JobProfile /> },
      { path: "/companies/:companyId", element: <CompanyProfile /> },
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
        path: "/search",
        element: (
           <LoginVerification>
              <Search />
           </LoginVerification>
        ),
        children: [
           { path: ":userId", element: <UserProfileView /> }, // Note the ":" before userId
        ],
     }
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
  {
    path: "/profile",
    element: (
      <LoginVerification>
        <PageTransition>
          <UserProfile />
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
