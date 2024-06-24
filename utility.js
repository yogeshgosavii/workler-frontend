export const setAuthHeaders = (id, token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});