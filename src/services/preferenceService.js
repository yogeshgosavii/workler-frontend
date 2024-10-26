// const API_URL = 'https://workler-backend.vercel.app/api/posts';
const API_URL = "http://localhost:5002/api/preference";
const getToken = () => localStorage.getItem("token");


export const createPreference = async (preferenceData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${getToken()}`,
      // Do not set Content-Type; it will be set automatically when using FormData
    },
    body: JSON.stringify(preferenceData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create preference");
  }

  return response.json();
};


export const getPreference = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}`,{
    headers: {  
        Authorization: `Bearer ${getToken()}`,
        // Do not set Content-Type; it will be set automatically when using FormData
      },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to retrieve preference");
  }

  return response.json();
};


export const updatePreference = async (userId, updatedData) => {
    console.log(userId);
    
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
  
        Authorization: `Bearer ${getToken()}`,
        // Do not set Content-Type; it will be set automatically when using FormData
      },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update preference");
  }

  return response.json();
};


export const deletePreference = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "DELETE",
    headers: {  
        Authorization: `Bearer ${getToken()}`,
        // Do not set Content-Type; it will be set automatically when using FormData
      },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete preference");
  }

  return response.json();
};
