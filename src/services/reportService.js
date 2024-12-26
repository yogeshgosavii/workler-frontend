import { method } from "lodash";

const API_URL = 'https://workler-backend.vercel.app/api/report';
// const API_URL = "http://localhost:5002/api/report";

const getToken = () => localStorage.getItem("token");

const getReports = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET", // Corrected the typo here
        headers: { Authorization: `Bearer ${getToken()}` },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json(); // Process the response as JSON
      console.log("Response data:", data);
      return data; // Return the data to the caller
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  };
  
const getReportById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching report with id ${id}:`, error);
    throw error;
  }
};

const createReport = async (reportData) => {
    console.log("report", reportData);
    try {
        const response = await fetch(API_URL + "/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(reportData),
        });
        return response.json();
    } catch (error) {
        console.log("Error creating report:", error);
        throw error;
    }
};

const updateReport = async (id, reportData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, reportData, {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating report with id ${id}:`, error);
    throw error;
  }
};

const deleteReport = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting report with id ${id}:`, error);
    throw error;
  }
};

export default {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
