export const setAuthHeaders = (userToken) => ({
  Authorization: `Bearer ${userToken}`,
  'Content-Type': 'application/json',
});