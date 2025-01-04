import { setAuthHeaders } from '../../utility';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

// const apiBaseUrl = 'http://localhost:5002/api/profile'; // Update as needed
const apiBaseUrl = "https://workler-backend.vercel.app/api/profile";

const makeApiRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

const createApiMethods = (endpoint) => {
  const getToken = () => localStorage.getItem('token');

  return {
    add: async (data) => {
      const token = getToken();
      const isFormData = data instanceof FormData;
      const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/`, {
        method: 'POST',
        headers: isFormData
        ? { Authorization: `Bearer ${getToken()}` }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
      body: isFormData ? data : JSON.stringify(data),
      });
      return response;
    },

    getAll: async () => {
      const token = getToken();
      const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/`, {
        method: 'GET',
        headers: setAuthHeaders(token),
      });
      return response;
    },

    update: async (id, data) => {
      const token = getToken();
      const isFormData = data instanceof FormData;
      const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: setAuthHeaders(token),
        headers: isFormData
        ? { Authorization: `Bearer ${getToken()}` }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
      body: isFormData ? data : JSON.stringify(data),
      });
      return response;
    },

    delete: async (id) => {
      const token = getToken();
      const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: setAuthHeaders(token),
      });
      return response;
    },

    getQualificationById: async (userId) => {
      const token = getToken();
      const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/${userId}`, {
        method: 'GET',
        headers: setAuthHeaders(token),
      });
      return response;
    },
  };
};

const useProfileApi = () => {
  const user = useSelector((state) => state.auth.user);

  // if (!user || !user._id) {
  //   throw new Error('User is not logged in or user ID is missing');
  // }

  // const userId = user._id; // Ensure consistency in user ID field

  const apiMethods = useMemo(() => ({
    skills: createApiMethods('skills'),
    education: createApiMethods('education'),
    personalDetails: createApiMethods('personalDetails'),
    projectDetails: createApiMethods('projectDetails'),
    workExperience: createApiMethods('workExperience'),
    description: createApiMethods('description'),
    job: createApiMethods('job'),
    qualification: createApiMethods('getQualification'),
  }), []);

  return apiMethods;
};

export default useProfileApi;
