// context/DataContext.js - Data context for state management
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create context
export const DataContext = createContext();

// Base API URL - ensure it's pointing to your backend
const API_BASE_URL = 'http://localhost:3000/api';

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    posts: false,
    topUsers: false,
    trendingPosts: false,
  });
  const [error, setError] = useState({
    users: null,
    posts: null,
    topUsers: null,
    trendingPosts: null,
  });

  // Function to fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
      setError(prev => ({ ...prev, users: null }));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(prev => ({ ...prev, users: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, []);

  // Function to fetch all posts
  const fetchPosts = useCallback(async () => {
    setLoading(prev => ({ ...prev, posts: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
      setError(prev => ({ ...prev, posts: null }));
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(prev => ({ ...prev, posts: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  }, []);

  // Function to fetch top 5 users with highest post counts
  const fetchTopUsers = useCallback(async () => {
    setLoading(prev => ({ ...prev, topUsers: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/top-users`);
      setTopUsers(response.data);
      setError(prev => ({ ...prev, topUsers: null }));
    } catch (err) {
      console.error('Error fetching top users:', err);
      setError(prev => ({ ...prev, topUsers: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, topUsers: false }));
    }
  }, []);

  // Function to fetch trending posts (posts with highest comment counts)
  const fetchTrendingPosts = useCallback(async () => {
    setLoading(prev => ({ ...prev, trendingPosts: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/trending-posts`);
      setTrendingPosts(response.data);
      setError(prev => ({ ...prev, trendingPosts: null }));
    } catch (err) {
      console.error('Error fetching trending posts:', err);
      setError(prev => ({ ...prev, trendingPosts: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, trendingPosts: false }));
    }
  }, []);

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    // Initial data fetch
    fetchUsers();
    fetchPosts();
    fetchTopUsers();
    fetchTrendingPosts();

    // Set up WebSocket connection for real-time updates
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Handle different types of real-time updates
      if (data.type === 'NEW_POST') {
        setPosts(currentPosts => [data.post, ...currentPosts]);
        // Re-fetch analytics data as it might have changed
        fetchTopUsers();
        fetchTrendingPosts();
      } else if (data.type === 'NEW_COMMENT') {
        // Update post with new comment count
        setPosts(currentPosts => 
          currentPosts.map(post => 
            post.id === data.postId 
              ? { ...post, commentCount: (post.commentCount || 0) + 1 } 
              : post
          )
        );
        // Re-fetch trending posts as comment counts changed
        fetchTrendingPosts();
      } else if (data.type === 'USER_UPDATE') {
        // Update user information
        setUsers(currentUsers => 
          currentUsers.map(user => 
            user.id === data.user.id ? data.user : user
          )
        );
        // Re-fetch top users
        fetchTopUsers();
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [fetchUsers, fetchPosts, fetchTopUsers, fetchTrendingPosts]);

  // Set up polling for updates (backup for WebSocket)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchPosts();
      fetchTopUsers();
      fetchTrendingPosts();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [fetchPosts, fetchTopUsers, fetchTrendingPosts]);

  // Context value
  const value = {
    users,
    posts,
    topUsers,
    trendingPosts,
    loading,
    error,
    fetchUsers,
    fetchPosts,
    fetchTopUsers,
    fetchTrendingPosts,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};