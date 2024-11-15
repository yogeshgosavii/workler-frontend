
// const API_URL = "https://workler-backend.vercel.app/api/notification";

const API_URL = "http://localhost:5002/api/notification";

// Create a new notification

const getToken = () => localStorage.getItem("token");

export const createNotification = async (notificationData) => {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications for a user
export const getUserNotifications = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user`,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // Do not set Content-Type; it will be set automatically when using FormData
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.length ? data : [];  // Return an empty array if no notifications found
    } else {
      throw new Error('Failed to fetch notifications');
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Get count of unread notifications for a user
export const getUserNotificationCount = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/unread-count`,{
      method:"GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // Do not set Content-Type; it will be set automatically when using FormData
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch unread notifications count');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    throw error;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_URL}/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/read-all`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // Do not set Content-Type; it will be set automatically when using FormData
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`${API_URL}/${notificationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // Do not set Content-Type; it will be set automatically when using FormData
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Delete all notifications for a user
export const deleteAllNotificationsForUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/delete-all`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // Do not set Content-Type; it will be set automatically when using FormData
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete all notifications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
};
