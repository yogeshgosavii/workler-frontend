import { setAuthHeaders } from "../../utility";

const API_URL = "https://workler-backend.vercel.app/api/interview";
// const API_URL = "http://localhost:5002/api/interview";

const getToken = () => localStorage.getItem('token');

const interviewService = {
  createInterview: async (interviewData) => {
    try {
      const response = await fetch(`${API_URL}/create-interview`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify(interviewData),
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

  getUserInterviews: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/get-user-interviews/${userId}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Interview check failed");
      }
      const data = await response.json();
      console.log("approached",data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checking approach:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  getEmployeerInterviews: async (employeerId) => {
    try {
      const response = await fetch(`${API_URL}/get-employeer-interviews/${employeerId}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Interview check failed");
      }
      const data = await response.json();
      console.log("interview",data);
      
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

export default interviewService;
