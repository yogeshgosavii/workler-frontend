import { setAuthHeaders } from "../../utility";

const API_URL = "https://workler-backend.vercel.app/api/news";
// const API_URL = "http://localhost:5002/api/news";

const getToken = () => localStorage.getItem('token');

const newsService = {
  // Fetch latest news
  fetchLatestNews: async () => {
    try {
      const response = await fetch(`${API_URL}/`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch latest news");
      }
      const data = await response.json();
      return data; // Return the latest news data
    } catch (error) {
      console.error("Error in fetching latest news:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  // Fetch news by category
  fetchNewsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_URL}/category/${category}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch news by category");
      }
      const data = await response.json();
      return data; // Return news filtered by category
    } catch (error) {
      console.error("Error in fetching news by category:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  // Search news
  searchNews: async (query) => {
    try {
      const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error("Failed to search news");
      }
      const data = await response.json();
      return data; // Return search results
    } catch (error) {
      console.error("Error in searching news:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  updateNewsToDatabase: async (query) => {
    try {
      const response = await fetch(`${API_URL}/update`, {
        method: "POST",
        headers: setAuthHeaders(getToken()),
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error("Failed to search news");
      }
      const data = await response.json();
      return data; // Return search results
    } catch (error) {
      console.error("Error in searching news:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  // Fetch news by ID
  fetchNewsById: async (newsId) => {
    try {
      const response = await fetch(`${API_URL}/${newsId}`, {
        method: "GET",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch news by ID");
      }
      const data = await response.json();
      return data; // Return the news article
    } catch (error) {
      console.error("Error in fetching news by ID:", error);
      throw error; // Throw the error to handle it in the component
    }
  },

  // Delete news (admin functionality)
  deleteNews: async (newsId) => {
    try {
      const response = await fetch(`${API_URL}/${newsId}`, {
        method: "DELETE",
        headers: setAuthHeaders(getToken()),
      });
      if (!response.ok) {
        throw new Error("Failed to delete news");
      }
      const data = await response.json();
      return data; // Return confirmation of deletion
    } catch (error) {
      console.error("Error in deleting news:", error);
      throw error; // Throw the error to handle it in the component
    }
  },
};

export default newsService;
