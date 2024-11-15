const API_URL = "https://workler-backend.vercel.app/api/location";
// const API_URL = "http://localhost:5002/api/location";


const token = localStorage.getItem("token");

const locationService = {
    place: async (input,userToken = token) => {
        try {
            const query = new URLSearchParams({ text: input }).toString();
            const url = `${API_URL}/place?${query}`;

          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch place");
          }
          const locationData = await response.json();
          return locationData; // Return the user details
        } catch (error) {
          console.error("Error in place:", error);
          throw error;
        }
      },

};

export default locationService;
