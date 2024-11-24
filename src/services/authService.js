const API_URL = "https://workler-backend.vercel.app/api/auth";
// const API_URL = "http://localhost:5002/api/auth";

const getToken = () => localStorage.getItem("token");

const authService = {
  checkEmail: async (email) => {
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

  updatePassword: async (passwordDetails, userToken = getToken()) => {
    try {
        const response = await fetch(`${API_URL}/update-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(passwordDetails),
        });

        
        if (!response.ok) {
            // Try to extract the error message from the response body
            const errorData = await response.json();
            const errorMessage = errorData.error || "Password change failed"; // Check for custom error message
            throw new Error(errorMessage); // Throw error to be handled later
        }

        // If successful, parse and return the response data
        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
},


  
  

  checkUsername: async (username) => {
    try {
      const response = await fetch(`${API_URL}/check-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
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

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      const { token } = data;
      localStorage.setItem("token", token);
      return token; // Return the token
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  },

  fetchUserDetails: async (userToken = getToken()) => {
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

  fetchUserDetailsById: async (userId, userToken = getToken()) => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}`, {
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

  updateUserDetails: async (data) => {
    let response;
    console.log(data);
    
    try {
      if (!data.FormData) {
        response = await fetch(`${API_URL}/update-user`, {
          method: "PUT", // Ensure method is set correctly
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: data, // Send the cleaned data
        });
      } else {
        response = await fetch(`${API_URL}/update-user`, {
          method: "PUT", // Ensure method is set correctly
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(data), // Send the cleaned data
        });
      }
      if (!response.ok) {
        throw new Error("Failed to update user details");
      }
      const userData = await response.json();
      return userData; // Return the updated user details
    } catch (error) {
      console.error("Error in updateUserDetails:", error);
      throw error;
    }
  },
};

export default authService;
