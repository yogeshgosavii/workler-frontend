import { setAuthHeaders } from "../../utility";

const API_URL = "https://workler-backend.vercel.app/api/approach";
// const API_URL = "http://localhost:5002/api/approach";

const getToken = () => localStorage.getItem('token');

const approachService = {
  createApproach: async (approachData) => {
    try {
      const response = await fetch(`${API_URL}/create-approach`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify(approachData),
      });
      if (!response.ok) {
        throw new Error("Approach crteated failed");
      }
      const data = await response.json();
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in createing approach:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  checkApproach: async (checkData) => {
    try {
      const response = await fetch(`${API_URL}/check-approach`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify(checkData),
      });
      if (!response.ok) {
        throw new Error("Approach check failed");
      }
      const data = await response.json();
      console.log("approached",data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checking approach:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  getApproachDetails: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/get-approach/${userId}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Approach check failed");
      }
      const data = await response.json();
      console.log("approached",data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checking approach:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  getUserApproaches: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/get-user-approach/${userId}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Approach check failed");
      }
      const data = await response.json();
      console.log("approaches",data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checking approach:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  updateStatus: async (approach) => {
    try {
      const response = await fetch(`${API_URL}/update-approach-status`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify(approach),

      });
      if (!response.ok) {
        throw new Error("Approach check failed");
      }
      const data = await response.json();
      console.log("approaches",data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checking approach:", error);
      throw error; // Throw the error to handle it in the component
    }
  },
 
};

export default approachService;
