import React, { useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import PostCard from '../components/PostCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function TrendingPosts() {
  const { trendingPosts, loading, error, fetchTrendingPosts } = useContext(DataContext);

  useEffect(() => {
    // Fetch trending posts when component mounts
    fetchTrendingPosts();
  }, [fetchTrendingPosts]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUpIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Trending Posts
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Posts with the highest number of comments are trending right now.
      </Typography>

      {loading.trendingPosts && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error.trendingPosts && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error loading trending posts: {error.trendingPosts}
        </Alert>
      )}

      {!loading.trendingPosts && !error.trendingPosts && trendingPosts.length === 0 && (
        <Alert severity="info" sx={{ my: 2 }}>
          No trending posts available. Check back later!
        </Alert>
      )}

      {trendingPosts.map((post) => (
        <PostCard key={post.id} post={post} isTrending={true} />
      ))}
    </Container>
  );
}

export default TrendingPosts;
