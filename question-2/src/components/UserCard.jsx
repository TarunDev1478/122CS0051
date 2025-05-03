import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { deepOrange, deepPurple, blue, green, pink } from '@mui/material/colors';

// Array of colors for avatars
const avatarColors = [deepOrange[500], deepPurple[500], blue[500], green[500], pink[500]];

function UserCard({ user, index }) {
  return (
    <Card sx={{ mb: 2, maxWidth: 500, mx: 'auto' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: avatarColors[index % avatarColors.length] }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={user.username}
        subheader={`User ID: ${user.id}`}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            Posts: {user.postCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Active User'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default UserCard;