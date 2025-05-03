import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ResponsiveAppBar from './components/Navbar';
import TopUsers from './pages/TopUser';
import TrendingPosts from './pages/TrendingPost';
import Feed from './pages/Feed';
import { DataProvider } from './context/DataContext';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <Router>
          <ResponsiveAppBar />
          <Routes>
            <Route path="/top-users" element={<TopUsers />} />
            <Route path="/trending-posts" element={<TrendingPosts />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/" element={<Navigate replace to="/feed" />} />
          </Routes>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;