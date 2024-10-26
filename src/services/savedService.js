import { setAuthHeaders } from "../../utility";

// Update the API_URL if needed
const API_URL = 'https://workler-backend.vercel.app/api/saved';

// const API_URL = "http://localhost:5002/api/saved"; 

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

const savedService = {
  // Save content (Job, Post, Profile)
  save: async (saved) => {
    console.log(saved);
    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify(saved),
      });
      if (!response.ok) {
        throw new Error("Failed to create saved content");
      }
      const data = await response.json();
      return data; // Return API response data
    } catch (error) {
      console.error("Error in save:", error);
      throw error; // Throw error to handle it in the component
    }
  },

  // Check if content is saved by the user
  checkSaved: async (saved) => {
    console.log(saved);
    try {
      const response = await fetch(`${API_URL}/check`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify(saved),
      });
      if (!response.ok) {
        throw new Error("Failed to check saved content");
      }
      const data = await response.json();
      return data; // Return response indicating if content exists
    } catch (error) {
      console.error("Error in checkSaved:", error);
      throw error; // Throw error to handle it in the component
    }
  },

  // Unsave specific content by ID
  unsave: async (id) => {
    try {
      const response = await fetch(`${API_URL}/unsave/${id}`, {
        method: "DELETE",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Failed to unsave content");
      }
      return { message: "Content unsaved successfully" };
    } catch (error) {
      console.error("Error in unsave:", error);
      throw error;
    }
  },

  // Get specific saved content by type (e.g., posts, profiles, jobs)
  getSpecificSaved: async (contentType) => {
    try {
      const response = await fetch(`${API_URL}/specific/${contentType}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error(`Failed to get saved ${contentType}`);
      }
      const data = await response.json();
      return data; // Return list of saved content of the specific type
    } catch (error) {
      console.error(`Error in getSpecificSaved for ${contentType}:`, error);
      throw error;
    }
  },

  // Get all saved content of a specific type (e.g., jobs, profiles, posts)
  
};

export default savedService;
