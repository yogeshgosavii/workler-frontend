import { setAuthHeaders } from '../../utility';
import { useSelector } from 'react-redux';

// const apiBaseUrl = 'http://localhost:5002/api/profile';
const apiBaseUrl = 'https://workler-backend.vercel.app/api/profile';



const makeApiRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    console.log(response)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
const token = localStorage.getItem('token');

const createApiMethods = (endpoint, userId) => ({
  add: async (data,userToken = token) => {
    const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/`, {
      method: 'POST',
      headers: setAuthHeaders(userToken),
      body: JSON.stringify(data),
    });
    return response;
  },

  getAll: async (userToken = token) => {
    const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response;
  },

  update: async (id, data,userToken = token) => {
    const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: setAuthHeaders(userToken),
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id,userToken = token) => {
    const response = await makeApiRequest(`${apiBaseUrl}/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,

      },
    });
    return response;
  },
});

const useProfileApi = () => {
  const user = useSelector((state) => state.auth.user);
  console.log("user",user);

  if (!user || !user._id) {
    throw new Error('User is not logged in or user ID is missing');
  }

  const userId = user.id;

  return {
    skills: createApiMethods('skills', userId),
    education: createApiMethods('education', userId),
    personalDetails: createApiMethods('personalDetails', userId),
    projectDetails: createApiMethods('projectDetails', userId),
    workExperience: createApiMethods('workExperience', userId),
    description: createApiMethods('description', userId),
  };
};

export default useProfileApi;
