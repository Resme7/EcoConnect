import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../Assets/ecoConnect.png';
import './style/General_page.css';

function CompanyPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleUserProfile = () => {
    navigate('/user-profile-company');
  };

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <img src={logo} alt="Logo" style={{ height: 50, margin: 10 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#134611', textAlign: 'center' }}>
            EcoConnect
          </Typography>
          <IconButton color="inherit" onClick={handleUserProfile}>
            <AccountCircleIcon />
          </IconButton>
          <Button color="inherit" onClick={handleLogout} sx={{ backgroundColor: '#134611', color: 'white', marginLeft: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <div className="page-container">
        <h2>Welcome to Company Page!</h2>
        <p>This is the page for regular users.</p>
      </div>
    </Box>
  );
}

export default CompanyPage;
