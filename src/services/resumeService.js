import { setAuthHeaders } from "../../utility";

const API_URL = "https://workler-backend.vercel.app/api/resume";
// const API_URL = "http://localhost:5002/api/resume";

const getToken = () => localStorage.getItem('token');

const resumeService = {
  addResume: async (resumeFile) => {
    console.log(resumeFile);
    
    try {
      // Create a FormData object
      const formData = new FormData();
      
      // Append the file to the FormData object
      formData.append('files', resumeFile);

      // Send the FormData object with the fetch request
      const response = await fetch(`${API_URL}/add-resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          // No need to manually set 'Content-Type' as it will be automatically set by the browser
        },
        body: formData, // Send the FormData object as the body
      });

      if (!response.ok) {
        throw new Error("Resume upload failed");
      }

      const data = await response.json();
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in uploading resume:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  getUserResumes : async () => {
    try {
      // Create a FormData object
     
      // Send the FormData object with the fetch request
      const response = await fetch(`${API_URL}/get-user-resumes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Resume get failed");
      }

      const data = await response.json();
      console.log(data);
      
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in getting resume:", error);
      throw error; // Throw the error to handle it in the component
    }
  }
};

export default resumeService;
