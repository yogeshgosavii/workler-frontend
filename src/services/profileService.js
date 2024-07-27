import { setAuthHeaders } from '../../utility';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const apiBaseUrl = 'https://workler-backend.vercel.app/api/profile';

const makeApiRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    console.log(response);
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
      const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/`, {
        method: 'POST',
        headers: setAuthHeaders(token),
        body: JSON.stringify(data),
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
      const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: setAuthHeaders(token),
        body: JSON.stringify(data),
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
  };
};

const useProfileApi = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  if (!user || !user._id) {
    throw new Error('User is not logged in or user ID is missing');
  }

  const userId = user._id; // Ensure consistency in user ID field

  const apiMethods = useMemo(() => ({
    skills: createApiMethods('skills'),
    education: createApiMethods('education'),
    personalDetails: createApiMethods('personalDetails'),
    projectDetails: createApiMethods('projectDetails'),
    workExperience: createApiMethods('workExperience'),
    description: createApiMethods('description'),
    job: createApiMethods('job'),
  }), [userId]);

  return apiMethods;
};

export default useProfileApi;
