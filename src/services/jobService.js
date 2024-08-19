import { setAuthHeaders } from '../../utility';
import { useSelector } from 'react-redux';

const apiBaseUrl = 'https://workler-backend.vercel.app/api/jobs';
// const apiBaseUrl = 'http://localhost:5002/api/jobs';


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
      const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/`, {
        method: 'POST',
        headers: setAuthHeaders(token),
        body: JSON.stringify(data),
      });
      return response;
    },

    addMultiple: async (jobs) => {
      const token = getToken();
      const response = await makeApiRequest(`${apiBaseUrl}/multiple-job/`, {
        method: 'POST',
        headers: setAuthHeaders(token),
        body: JSON.stringify(jobs),
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

    getById: async (id) => {
      const token = getToken();
      const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/${id}`, {
        method: 'GET',
        headers: setAuthHeaders(token),
      });
      return response;
    },

    getByIds: async (ids) => {
      const token = getToken();
      const response = await makeApiRequest(`${apiBaseUrl}/get-multiple-job/`, {
        method: 'POST',
        headers: setAuthHeaders(token),
        body : JSON.stringify({ids})
      });
      return response;
    },

    getByUserIds: async (userId) => {
      const token = getToken();
      const response = await makeApiRequest(`${apiBaseUrl}/get-user-jobs/${userId}`, {
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

const useJobApi = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  if (!user || !user._id) {
    throw new Error('User is not logged in or user ID is missing');
  }

  const userId = user._id; // Assuming user._id is the correct field

  return {
    job: createApiMethods('job', userId),
  };
}


export default useJobApi
