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
  const response = await handleRequest(API_URL + "/post", {
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
  const response = await handleRequest(API_URL + "/get-postby-userId/" + userId, {
    method: 'GET',
    headers: setAuthHeaders(getToken())
  });
  return response;
};

export const createJobPost = async (postData) => {
  const response = await handleRequest(API_URL + `/post/job-post`, {
    method: 'POST',
    headers: setAuthHeaders(getToken()),
    body: JSON.stringify(postData)
  });
  return response;
};

// Add a like to a post or comment
export const addLike = async (likeData) => {
  const response = await handleRequest(API_URL + `/post/${likeData.post}/like`, {
    method: 'PUT',
    headers: setAuthHeaders(getToken()),
    body: JSON.stringify(likeData)
  });
  return response;
};

export const deleteLike = async (likeData) => {
  const response = await handleRequest(API_URL + `/post/${likeData.post}/like`, {
    method: 'DELETE',
    headers: setAuthHeaders(getToken()),
  });
  return response;
};






// Add a comment or reply
export const addComment = async (commentData) => {
  const response = await handleRequest(API_URL + `/post/${commentData.post}/comment`, {
    method: 'POST',
    headers: setAuthHeaders(getToken()),
    body: JSON.stringify(commentData)
  });
  return response;
};

export const deleteComment = async (commentDataId) => {
  const response = await handleRequest(API_URL + `/post/comment/${commentDataId}`, {
    method: 'DELETE',
    headers: setAuthHeaders(getToken()),
  });
  return response;
};

export const addReply = async (replyData) => {
  if(!replyData.parentComment){
    return
  }
  const response = await handleRequest(API_URL + `/post/comment/${replyData.parentComment}/reply`, {
    method: 'POST',
    headers: setAuthHeaders(getToken()),
    body: JSON.stringify(replyData)
  });
  return response;  
};

export const getReplies = async (commentId) => {
  const response = await handleRequest(API_URL + `/post/comment/${commentId}/reply`, {
    method: 'GET',
    headers: setAuthHeaders(getToken()),
  });
  return response;
};

// Get all posts for the logged-in user
export const getUserPosts = async () => {
  const response = await handleRequest(API_URL + "/post", {
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

export const getUserFollowingPosts = async () => {
  const response = await handleRequest(`${API_URL}/post/following`, {
    method: 'GET',
    headers: setAuthHeaders(getToken()),

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
  const response = await handleRequest(`${API_URL}/post/${id}`, {
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
  const response = await handleRequest(`${API_URL}/post/${id}`, {
    method: 'DELETE',
    headers: setAuthHeaders(getToken()),
  });
  return response;
};

// Get likes for a specific post
export const getLikesByPostId = async (postId) => {
  const response = await handleRequest(`${API_URL}/post/${postId}/likes`, {
    method: 'GET',
    headers: setAuthHeaders(getToken()),
  });
  return response;
};

// Get comments for a specific post
export const getCommentsByPostId = async (postId) => {
  const response = await handleRequest(`${API_URL}/post/${postId}/comments`, {
    method: 'GET',
    headers: setAuthHeaders(getToken()),
  });
  return response;
};
