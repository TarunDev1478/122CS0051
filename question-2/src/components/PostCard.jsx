// components/PostCard.js - Card component for posts
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { deepOrange, deepPurple, blue, green, pink } from '@mui/material/colors';

// Array of colors for avatars
const avatarColors = [deepOrange[500], deepPurple[500], blue[500], green[500], pink[500]];

// Array of image URLs for random post images
const imageUrls = [
  '/api/placeholder/600/300',
  '/api/placeholder/600/350',
  '/api/placeholder/650/300',
  '/api/placeholder/550/300',
  '/api/placeholder/600/320'
];

function PostCard({ post, isTrending }) {
  // Generate consistent but pseudo-random index for avatar color and image
  const colorIndex = post.id.charCodeAt(0) % avatarColors.length;
  const imageIndex = post.id.charCodeAt(post.id.length - 1) % imageUrls.length;
  
  return (
    <Card sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: avatarColors[colorIndex] }}>
            {post.author ? post.author.charAt(0).toUpperCase() : 'U'}
          </Avatar>
        }
        title={post.author || 'Unknown User'}
        subheader={new Date(post.createdAt).toLocaleString()}
      />
      <CardMedia
        component="img"
        height="200"
        image={imageUrls[imageIndex]}
        alt="Post image"
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {post.content}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChatBubbleOutlineIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FavoriteIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {post.likes || 0} {(post.likes || 0) === 1 ? 'like' : 'likes'}
            </Typography>
          </Box>
        </Box>
        {isTrending && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(25, 118, 210, 0.1)', borderRadius: 1 }}>
            <Typography variant="body2" color="primary" fontWeight="bold">
              🔥 Trending Post
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default PostCard;



