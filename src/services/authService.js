<<<<<<< HEAD
const API_URL = 'http://localhost:5002/api/auth';
=======
const API_URL = 'http://localhost:5000/api/auth';
>>>>>>> origin/main

const authService = {
  checkEmail: async (email) => {
    try {
<<<<<<< HEAD
      const response = await fetch(`${API_URL}/check-email`, {
=======
      const response = await fetch(`${API_URL}/checkEmail`, {
>>>>>>> origin/main
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error('Email check failed');
      }
      const data = await response.json();
      return data; // Return any additional data from the API response if needed
    } catch (error) {
      console.error('Error in checkEmail:', error);
      throw error; // Throw the error to handle it in the component
    }
  },
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      const { token } = data;
      localStorage.setItem('token', token);
      return token; // Return the token
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  },
  fetchUserDetails: async (token) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const userData = await response.json();
      return userData; // Return the user details
    } catch (error) {
      console.error('Error in fetchUserDetails:', error);
      throw error;
    }
  }
}

export default authService;
