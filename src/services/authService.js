let API_URL = "http://localhost:5002/api/auth";
 API_URL = "https://workler-backend.vercel.app/api/auth";


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
        const errorData = await response.json();
        throw new Error(errorData.error || "Email check failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in checkEmail:", error);
      throw error;
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Password change failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in updatePassword:", error);
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Username check failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in checkUsername:", error);
      throw error;
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
      const { token } = await response.json();
      localStorage.setItem("token", token);
      return token;
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user details");
      }
      return await response.json();
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user details");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in fetchUserDetailsById:", error);
      throw error;
    }
  },

  updateUserDetails: async (data) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await fetch(`${API_URL}/update-user`, {
        method: "PUT",
        headers: isFormData
          ? { Authorization: `Bearer ${getToken()}` }
          : {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
        body: isFormData ? data : JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user details");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in updateUserDetails:", error);
      throw error;
    }
  },
};

export default authService;
