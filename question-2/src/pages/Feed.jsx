import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { Container, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import PostCard from '../components/PostCard';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import RefreshIcon from '@mui/icons-material/Refresh';

function Feed() {
  const { posts, loading, error, fetchPosts } = useContext(DataContext);
  const [displayCount, setDisplayCount] = useState(5);
  
  useEffect(() => {
    // Fetch posts when component mounts
    fetchPosts();
  }, [fetchPosts]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  const handleRefresh = () => {
    fetchPosts();
  };

  // Sort posts by createdAt date in descending order (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Get posts to display based on current displayCount
  const postsToDisplay = sortedPosts.slice(0, displayCount);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <DynamicFeedIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Feed
        </Typography>
        <Button 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ ml: 'auto' }}
          disabled={loading.posts}
        >
          Refresh
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        See the latest posts in real-time, with newest posts at the top.
      </Typography>

      {loading.posts && postsToDisplay.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error.posts && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error loading posts: {error.posts}
        </Alert>
      )}

      {!loading.posts && !error.posts && postsToDisplay.length === 0 && (
        <Alert severity="info" sx={{ my: 2 }}>
          No posts available. Check back later!
        </Alert>
      )}

      {postsToDisplay.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {displayCount < sortedPosts.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleLoadMore}
            disabled={loading.posts}
          >
            Load More
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default Feed;
