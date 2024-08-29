import { setAuthHeaders } from "../../utility";

const API_URL = "https://workler-backend.vercel.app/api/application";
// const API_URL = "http://localhost:5002/api/application";

const getToken = () => localStorage.getItem('token');

const applicationService = {
  createApplication: async (applicationData) => {
    try {
      const response = await fetch(`${API_URL}/create-application`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify(applicationData),
      });
      if (!response.ok) {
        throw new Error("Approach crteated failed");
      }
      const data = await response.json();
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in creating approach:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  checkApplied: async (checkData) => {
    try {
      const response = await fetch(`${API_URL}/check-applied`, {
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

  getApplicantsCount: async (jobId) => {
    try {
      const response = await fetch(`${API_URL}/get-job-applicants-count/${jobId}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Approach check failed");
      }
      const data = await response.json();
      console.log("application",data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checking application:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  getUserApplications: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/get-user-application/${userId}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Application check failed");
      }
      const data = await response.json();
      console.log("application",data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checking approach:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  getEmployeerApplications: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/get-employeer-application/${userId}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Application check failed");
      }
      const data = await response.json();
      console.log("application",data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checking approach:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  updateStatus: async (application) => {
    try {
      const response = await fetch(`${API_URL}/update-application-status`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify(application),

      });
      if (!response.ok) {
        throw new Error("Approach check failed");
      }
      const data = await response.json();
      console.log("application",data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checking application:", error);
      throw error; // Throw the error to handle it in the component
    }
  },


  
  

 
};

export default applicationService;
