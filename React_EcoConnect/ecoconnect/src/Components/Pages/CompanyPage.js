import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Container, TextField, Typography, Box, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog,
  DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';
import logo from '../Assets/ecoConnect.png';
import '../Pages/style/General_page.css';
import { fetchCompanyById } from '../Pages/Service/Service';
import { getNearbyUsersForCompany } from '../Pages/Service/userService';
import { getAllRequestsOnHold, getAllRequestsByUserId, acceptRequest, deleteRequest, getRequestsOrderByQuantity, finishRequest } from '../Pages/Service/requestService';
import { useUser } from '../Pages/util/UserContext';
import companyPin from '../Assets/company-pin.png';
import personPin from '../Assets/person-pin.png';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { format } from 'date-fns';

const mapContainerStyle = {
  height: '600px',
  width: '100%',
};

function CompanyPage() {
  const { user } = useUser();
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [requestsOnHold, setRequestsOnHold] = useState([]);
  const [selectedUserRequests, setSelectedUserRequests] = useState([]);
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [requestsOrderedByQuantity, setRequestsOrderedByQuantity] = useState([]);
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [requestDateTimes, setRequestDateTimes] = useState({});

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAz8QnnKvBaN7Z2sAX1hH7_Djg8zqJNkQk', // Ensure you replace this with your actual API key
  });

  useEffect(() => {
    if (user && user.id) {
      fetchCompanyById(user.id).then(companyData => {
        if (companyData && companyData.data.latitude && companyData.data.longitude) {
          const newCenter = {
            lat: parseFloat(companyData.data.latitude),
            lng: parseFloat(companyData.data.longitude)
          };
          setCenter(newCenter);
          setCompanyData(companyData.data);
        }
      }).catch(error => {
        console.error('Error fetching company data:', error);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      getNearbyUsersForCompany(user.id).then(response => {
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

  const handleMarkerClick = (location) => {
    setSelectedUser(null);
    setSelectedCompanyDetails(null);
    setSelectedUserRequests([]);
    setRequestsOnHold([]);
    setRequestsOrderedByQuantity([]);
    if (location.role === 'Person') {
      setSelectedUser(location);
      getAllRequestsByUserId(location.id).then(response => {
        setSelectedUserRequests(response.data);
      }).catch(error => {
        console.error('Error fetching user requests:', error);
      });
      getAllRequestsOnHold(location.id).then(response => {
        setRequestsOnHold(response.data);
      }).catch(error => {
        console.error('Error fetching requests on hold:', error);
      });
      getRequestsOrderByQuantity(location.id).then(response => {
        setRequestsOrderedByQuantity(response.data);
      }).catch(error => {
        console.error('Error fetching requests ordered by quantity:', error);
      });
    } else if (location.role === 'Company') {
      setSelectedCompanyDetails(location);
    }
  };

  const handleAcceptRequest = (requestId) => {
    if (companyData) {
      const dateRequestAccepted = requestDateTimes[requestId]?.getTime();

      if (dateRequestAccepted) {
        acceptRequest(companyData.companyId, requestId, dateRequestAccepted).then(() => {
          const updatedSelectedUserRequests = selectedUserRequests.filter(request => request.id !== requestId);
          const updatedRequestsOnHold = requestsOnHold.filter(request => request.id !== requestId);
          setSelectedUserRequests(updatedSelectedUserRequests);
          setRequestsOnHold(updatedRequestsOnHold);
          setDialogOpen(false);
        }).catch(error => {
          console.error('Error accepting request:', error);
        });
      } else {
        console.error('Invalid date for request:', requestId);
      }
    } else {
      console.error("companyData is undefined or null.");
    }
  };

  const handleDeleteRequest = (requestId) => {
    deleteRequest(requestId).then(() => {
      setSelectedUserRequests(selectedUserRequests.filter(request => request.id !== requestId));
      setRequestsOnHold(requestsOnHold.filter(request => request.id !== requestId));
      setDialogOpen(false);
    }).catch(error => {
      console.error('Error deleting request:', error);
    });
  };

  const handleFinishRequest = (requestId) => {
      finishRequest(requestId).then(() => {
        const updatedRequestsOrderedByQuantity = requestsOrderedByQuantity.map(request => 
          request.id === requestId ? { ...request} : request
        );
        setRequestsOrderedByQuantity(updatedRequestsOrderedByQuantity);
      }).catch(error => {
        console.error('Error finishing request:', error);
      });
    
  };

  const handleDateTimeChange = (requestId, newValue) => {
    setRequestDateTimes(prevState => ({
      ...prevState,
      [requestId]: newValue,
    }));
  };

  const handleIconClick = (request) => {
    setActiveRequest(request);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setActiveRequest(null);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                  onClick={() => handleMarkerClick(location)}
                />
              ))}
            </GoogleMap>
          </Container>
        
          {selectedUser && requestsOnHold.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6">Pending requests for {selectedUser.name}:</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Material</TableCell>
                      <TableCell>DateCreated</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>DateAccepted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requestsOnHold.map(request => (
                      <TableRow key={request.id}>
                        <TableCell>{request.materialName}</TableCell>
                        <TableCell>{request.dateRequestCreated}</TableCell>
                        <TableCell>{request.status}</TableCell>
                        <TableCell>
                          {requestDateTimes[request.id] ? format(requestDateTimes[request.id], 'dd/MM/yyyy HH:mm') : 'N/A'}
                          <IconButton onClick={() => handleIconClick(request)}>
                            <EventIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleAcceptRequest(request.id)}>Accept</Button>
                          <Button onClick={() => handleDeleteRequest(request.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          
          {selectedUser && requestsOrderedByQuantity.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6">Requests ordered by quantity for {selectedUser.name}:</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Material</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requestsOrderedByQuantity.map(request => (
                      <TableRow key={request.id}>
                        <TableCell>{request.materialName}</TableCell>
                        <TableCell>{request.quantity}</TableCell>
                        <TableCell>{request.unit}</TableCell>
                        <TableCell>{request.status}</TableCell>
                        <TableCell>
                          {request.status === 'PROCESSING' && (
                            <Button onClick={() => handleFinishRequest(request.id)}>Finish</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          
          {selectedCompanyDetails && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6">Detalii companie:</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Proprietate</TableCell>
                      <TableCell>Valoare</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Nume</TableCell>
                      <TableCell>{selectedCompanyDetails.companyName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Telefon</TableCell>
                      <TableCell>{selectedCompanyDetails.companyNumberPhone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{selectedCompanyDetails.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Adresă</TableCell>
                      <TableCell>{selectedCompanyDetails.address}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Select Date & Time</DialogTitle>
            <DialogContent>
              {activeRequest && (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} fullWidth />}
                    value={requestDateTimes[activeRequest.id]}
                    onChange={(newValue) => handleDateTimeChange(activeRequest.id, newValue)}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </div>
      </Box>
    </LocalizationProvider>
  );
}

export default CompanyPage;
