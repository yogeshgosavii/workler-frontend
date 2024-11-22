import { setAuthHeaders } from "../../utility";

const API_URL = "https://workler-backend.vercel.app/api/search";
// const API_URL = "http://localhost:5002/api/search";

const getToken = () => localStorage.getItem('token');

const searchService = {
  search: async (email) => {
    try {
      const response = await fetch(`${API_URL}/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Email check failed");
      }
      const data = await response.json();
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checkEmail:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  searchByUsername : async (username)=>{
    try {
      const response = await fetch(`${API_URL}/search-by-username/${username}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
        // body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error("Username check failed");
      }
      const data = await response.json();
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checkUsername:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  searchUserByKeyword : async (keyword)=>{
    try {
      const response = await fetch(`${API_URL}/search-user-by-keyword?keyword=${keyword}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
        // body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error("Username check failed");
      }
      const data = await response.json();
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error("Error in checkUsername:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  secrchJobByKeyword: async (keyword,page = 1,limit=10) => {

    const queryParams = new URLSearchParams({
      keyword: keyword || "", // Provide a default empty string if no keyword
      page: page.toString()|| 1,
      limit: limit.toString() || 10,
    });
    
    try {
      const response = await fetch(`${API_URL}/search-job-by-keyword?keyword=${keyword}&&page=${page}&&limit=${limit}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
    
      return data; // Return the token
    } catch (error) {
      console.error("Error getting job data by key word:", error);
      throw error;
    }
  },

  searchByTags: async (userToken = getToken()) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const userData = await response.json();
      return userData; // Return the user details
    } catch (error) {
      console.error("Error in fetchUserDetails:", error);
      throw error;
    }
  },

  

 
};

export default searchService;
