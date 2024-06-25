const token = localStorage.getItem('token');
export const setAuthHeaders = (id) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});