// postService.js

import { setAuthHeaders } from "../../utility";

const API_URL = 'https://workler-backend.vercel.app/api/post/posts';
// const API_URL = "http://localhost:5002/api/posts/post";

const getToken = () => localStorage.getItem('token');

// Helper function to handle API requests
const handleRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Create a new post
export const createPost = async (postData) => {
  const token = getToken();
  console.log(postData);
  const response = await handleRequest(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do not set Content-Type; it will be set automatically when using FormData
    },
    body: postData
  });
  return response;
};

// Get all posts for the logged-in user
export const getUserPosts = async () => {
  const response = await handleRequest(API_URL, {
    method: 'GET',
    headers: setAuthHeaders(getToken()),
  });
  return response;
};

// Get all public posts
export const getAllPosts = async () => {
  const response = await handleRequest(`${API_URL}/all`, {
    method: 'GET',
  });
  return response;
};

// Get a single post by ID
export const getPostById = async (id) => {
  const response = await handleRequest(`${API_URL}/${id}`, {
    method: 'GET',
  });
  return response;
};

// Update a post by ID
export const updatePost = async (id, postData) => {
  const response = await handleRequest(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      ...setAuthHeaders(getToken()),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData),
  });
  return response;
};

// Delete a post by ID
export const deletePost = async (id) => {
  const response = await handleRequest(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: setAuthHeaders(getToken()),
  });
  return response;
};
