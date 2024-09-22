// postService.js

import { setAuthHeaders } from "../../utility";

const API_URL = 'https://workler-backend.vercel.app/api/posts';
// const API_URL = "http://localhost:5002/api/posts";

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
  const response = await handleRequest(API_URL+"/post", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do not set Content-Type; it will be set automatically when using FormData
    },
    body: postData
  });
  return response;
};

export const getPostByUserId = async (userId) => {
  const token = getToken();
  const response = await handleRequest(API_URL+"/get-postby-userId/"+userId, {
    method: 'GET',
    headers: setAuthHeaders(getToken())
  });
  return response;
};

export const createJobPost = async (postData) => {
  console.log(postData);
  const response = await handleRequest(API_URL+`/post/job-post`, {
    method: 'POST',
    headers: setAuthHeaders(getToken()),
    body: JSON.stringify(postData)
  });
  return response;
};

export const addLike = async (likeData) => {
  console.log(likeData);
  const response = await handleRequest(API_URL+`/post/${likeData._id}/like`, {
    method: 'PUT',
    headers: setAuthHeaders(getToken()),
    body: JSON.stringify(likeData)
  });
  return response;
};

export const addComment = async (commentData) => {
  console.log(commentData);
  const response = await handleRequest(API_URL+`/post/${commentData._id}/comment`, {
    method: 'PUT',
    headers: setAuthHeaders(getToken()),
    body: JSON.stringify(commentData)
  });
  return response;
};

// Get all posts for the logged-in user
export const getUserPosts = async () => {
  const response = await handleRequest(API_URL+"/post", {
    method: 'GET',
    headers: setAuthHeaders(getToken()),
  });
  return response;
};

// Get all public posts
export const getAllPosts = async () => {
  const response = await handleRequest(`${API_URL}/all-posts`, {
    method: 'GET',
  });
  return response;
};

// Get a single post by ID
export const getPostById = async (id) => {
  const response = await handleRequest(`${API_URL}/post/${id}`, {
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
