import React, { useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import UserCard from '../components/UserCard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function TopUsers() {
  const { topUsers, loading, error, fetchTopUsers } = useContext(DataContext);

  useEffect(() => {
    // Fetch top users when component mounts
    fetchTopUsers();
  }, [fetchTopUsers]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <EmojiEventsIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Top Users
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        These are the top 5 users with the highest number of posts on our platform.
      </Typography>

      {loading.topUsers && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error.topUsers && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error loading top users: {error.topUsers}
        </Alert>
      )}

      {!loading.topUsers && !error.topUsers && topUsers.length === 0 && (
        <Alert severity="info" sx={{ my: 2 }}>
          No user data available. Check back later!
        </Alert>
      )}

      {topUsers.map((user, index) => (
        <UserCard key={user.id} user={user} index={index} />
      ))}
    </Container>
  );
}

export default TopUsers;