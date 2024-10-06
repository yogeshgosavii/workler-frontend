import { setAuthHeaders } from "../../utility";

const API_URL = "https://workler-backend.vercel.app/api/follow";
// const API_URL = "http://localhost:5002/api/follow";

const getToken = () => localStorage.getItem("token");

const followService = {
  createFollow: async (followData) => {
    try {
      console.log(followData);

      const response = await fetch(`${API_URL}/create-follow`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify(followData),
      });

      if (!response.ok) {
        throw new Error("Follow creation failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in creating follow:", error);
      throw error;
    }
  },

  getFollowers: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/get-followers/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Get followers failed");
      }

      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error("Error in getting followers:", error);
      throw error;
    }
  },

  getFollowing: async () => {
    try {
      const response = await fetch(`${API_URL}/get-following`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Get following failed");
      }

      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error("Error in getting following:", error);
      throw error;
    }
  },

  unfollow: async (userId, followingId) => {
    try {
      const response = await fetch(`${API_URL}/unfollow/${userId}/${followingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unfollow failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in unfollowing:", error);
      throw error;
    }
  },
};

export default followService;
