import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Jobs from './pages/Jobs.jsx';
import Companies from './pages/Companies.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import JobProfile from './pages/JobProfile.jsx';
import CompanyProfile from './pages/CompanyProfile.jsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store.js';
import UserProfile from './pages/UserProfile.jsx';
import EducationForm from './components/Forms/EducationForm.jsx';
import EducationUpdateForm from './components/Forms/EducationUpdateForm.jsx';
import PersonalDetailsForm from './components/Forms/PersonalDetailsForm.jsx';
import ProjectForm from './components/Forms/ProjectForm.jsx';
import ProjectUpdateForm from './components/Forms/ProjectUpdateForm.jsx';
import SkillForm from './components/Forms/SkillForm.jsx';
import SkillUpdateForm from './components/Forms/SkillUpdateForm.jsx';
import UserDetailsForm from './components/Forms/UserDetailsForm.jsx';
import WorkExperienceForm from './components/Forms/WorkExperienceForm.jsx';
import WorkExperienceUpdateForm from './components/Forms/WorkExperienceUpdateForm.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/jobs', element: <Jobs /> },
      { path: '/companies', element: <Companies /> },
      { path: '/jobs/:jobId', element: <JobProfile /> },
      { path: '/companies/:jobId', element: <CompanyProfile /> }
    ]
  },
  { path: '/profile', element: <UserProfile /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
    </PersistGate>
  </Provider>
);
