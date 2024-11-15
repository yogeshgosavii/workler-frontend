// const API_URL = "http://localhost:5002/api/images";
const API_URL = "https://workler-backend.vercel.app/api/files"; 

const token = localStorage.getItem("token");

const imageService = {
  uploadImages: async (formData) => {

    try {
      const response = await fetch(`${API_URL}/upload-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not set Content-Type; it will be set automatically when using FormData
        },
        body: formData, // Send the FormData object directly
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in uploadImages:", error);
      throw error;
    }
  },
};

export default imageService;
