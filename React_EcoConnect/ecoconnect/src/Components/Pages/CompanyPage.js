import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Container, TextField, Typography, Box, Button, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../Assets/ecoConnect.png';
import './style/General_page.css';
import { fetchCompanyById } from '../Pages/Service/Service'; 
import { getNearbyUsersForCompany } from '../Pages/Service/userService';
import { useUser } from '../Pages/util/UserContext';
import companyPin from '../Assets/company-pin.png';
import personPin from '../Assets/person-pin.png';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '600px',
  width: '100%',
};

function CompanyPage() {
  const { user } = useUser();
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const navigate = useNavigate();
  const [radius, setRadius] = useState(10);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAz8QnnKvBaN7Z2sAX1hH7_Djg8zqJNkQk', // Ensure you replace this with your actual API key
  });

  useEffect(() => {
    if (user && user.id) {
      fetchCompanyById(user.id).then(companyData => {
        console.log("CompanyData: ", companyData.data)
        if (companyData && companyData.data.latitude && companyData.data.longitude) {
          const newCenter = {
            lat: parseFloat(companyData.data.latitude),
            lng: parseFloat(companyData.data.longitude)
          };
          setCenter(newCenter);
          console.log("Center set to: ", newCenter);
        }
      }).catch(error => {
        console.error('Error fetching company data:', error);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      getNearbyUsersForCompany(user.id).then(response => {
        console.log("NearbyUsers: ", response.data);
        setNearbyLocations(response.data);
      }).catch(error => {
        console.error('Error fetching nearby locations:', error);
      });
    }
  }, [user]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleUserProfile = () => {
    navigate('/user-profile-company');
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ backgroundColor: '#134611', color: 'white', marginLeft: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <div className="page-container">
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <TextField
                label="Radius (km)"
                variant="outlined"
                size="small"
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                sx={{ mr: 2 }}
              />
            </Box>
          </Box>
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
            {center.lat !== 0 && center.lng !== 0 && (
              <Marker
                position={{ lat: center.lat, lng: center.lng }}
                icon={companyPin}
                title="Company Location"
              />
            )}
            {nearbyLocations.map((location, index) => (
              <Marker
                key={index}
                position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }}
                icon={location.role === 'Company' ? companyPin : personPin}
                title={location.role === 'Company' ? location.companyName : location.name}
              />
            ))}
          </GoogleMap>
        </Container>
      </div>
    </Box>
  );
}

export default CompanyPage;
