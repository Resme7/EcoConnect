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
import LogoutIcon from '@mui/icons-material/Logout';
import EventIcon from '@mui/icons-material/Event';
import logo from '../Assets/ecoConnect.png';
import on_hold from '../Assets/hourglass_onhold.png';
import processing from '../Assets/loading-processing.png';
import completed from '../Assets/approved.png';
import '../Pages/style/General_page.css';
import { fetchCompanyById, fetchMaterialsByCompany, fetchMaterialById } from '../Pages/Service/Service';
import { getNearbyUsersForCompany } from '../Pages/Service/userService';
import { getAllRequestsOnHold, getAllRequestsByUserId, acceptRequest, deleteRequest, finishRequest } from '../Pages/Service/requestService';
import { fetchRequestsAccepted } from '../Pages/Service/Service';
import { useUser } from '../Pages/util/UserContext';
import companyPin from '../Assets/company-pin.png';
import personPin from '../Assets/person-pin.png';
import requestPin from '../Assets/requestpin.png';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { format } from 'date-fns';
import './style/TableStyle.css';

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
  const [requestsAccepted, setRequestsAccepted] = useState([]);
  const [specializedMaterials, setSpecializedMaterials] = useState([]);
  const [materialNames, setMaterialNames] = useState({});
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [requestDateTimes, setRequestDateTimes] = useState({});
  const [filterReq, setFilterReq] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAz8QnnKvBaN7Z2sAX1hH7_Djg8zqJNkQk',
  });

  const fetchCompanyDetails = async (companyId) => {
    try {
      const companyData = await fetchCompanyById(companyId);
      if (companyData && companyData.data.latitude && companyData.data.longitude) {
        const newCenter = {
          lat: parseFloat(companyData.data.latitude),
          lng: parseFloat(companyData.data.longitude),
        };
        setCenter(newCenter);
        setCompanyData(companyData.data);
        await getMaterialsByCompany(companyId);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };
  
  const getMaterialsByCompany = async (companyId) => {
    try {
      const response = await fetchMaterialsByCompany(companyId);
      const materialIds = response.data;
      const materialNamesMap = {};
      await Promise.all(materialIds.map(async (materialId) => {
        const materialResponse = await fetchMaterialById(materialId);
        materialNamesMap[materialId] = materialResponse.data.materialName;
      }));
      setSpecializedMaterials(Object.values(materialNamesMap));
      setMaterialNames(materialNamesMap);
      console.log(specializedMaterials)
    } catch (error) {
      console.error('Error fetching company materials:', error);
    }
  };
  useEffect(() => {
    console.log('Specialized Materials Updated:', specializedMaterials);
  }, [specializedMaterials]);

  const fetchNearbyUsers = async (userId) => {
    try {
      const response = await getNearbyUsersForCompany(userId);
      const locations = response.data;
      console.log(locations)
      setNearbyLocations(locations);
      let allFilteredRequests = [];
      for (const location of locations) {
        console.log("Locatie", location)
        if (location.role === "Person") {
          try {
            const res = await getAllRequestsOnHold(location.id);
            console.log("reqhold", res.data)
            const requestsOnHold = res.data;
            console.log("req22", requestsOnHold)
            console.log("specialite", specializedMaterials)
            const filteredRequests = requestsOnHold.filter(request =>
              specializedMaterials.includes(request.materialName)
            );
            console.log("filtru", filteredRequests)

            allFilteredRequests = [...allFilteredRequests, ...filteredRequests];
            console.log("Final", allFilteredRequests)
          } catch (error) {
            console.error('Error fetching requests on hold:', error);
          }
        }
      }
      setFilterReq(allFilteredRequests);
      console.log("Filtered Requests:", allFilteredRequests);
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
    }
  };
  
  

  const getRequestsAccepted = async (userId) => {
    try {
      const response = await fetchRequestsAccepted(userId);
      console.log('Full response from fetchRequestsAccepted:', response.data); 
      setRequestsAccepted(response.data); 
    } catch (error) {
      console.error('Error fetching accepted requests:', error);
    }
  };

  
  

  useEffect(() => {
    if (user && user.id) {
      fetchCompanyDetails(user.companyId);
      getMaterialsByCompany(user.companyId)
      getRequestsAccepted(user.id)
    }
  }, [user]);

  useEffect(() => {
    if(user && user.id){
      fetchNearbyUsers(user.id)
    }
    console.log('Specialized Materials Updated:', specializedMaterials);
  }, [specializedMaterials], user);



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
      console.log("PPP", location)
    } else if (location.role === 'Company') {
      setSelectedCompanyDetails(location);
    }
  };

  const handleAcceptRequest = (requestId) => {
    if (companyData) {
      const dateRequestAccepted = requestDateTimes[requestId]?.getTime();

      if (dateRequestAccepted) {
        acceptRequest(user.id, requestId, dateRequestAccepted).then(() => {
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
      const updatedRequestsAccepted = requestsAccepted.map(request =>
        request.id === requestId ? { ...request } : request
      );
      setRequestsAccepted(updatedRequestsAccepted);
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

  const filteredRequestsOnHold = [];
  requestsOnHold.forEach(request => {
    if (specializedMaterials.includes(request.materialName)) {
      filteredRequestsOnHold.push(request);
      console.log("materials", filteredRequestsOnHold)
    }
  });

  const hasRequiredMaterial = (location) => {
    return location.requestsMaterialsPerson && location.requestsMaterialsPerson.some(material =>
      filterReq.some(request => request.materialName === material)
    );
  };
  
  
  const filteredLocations = nearbyLocations.filter(location => {
    if (location.role === 'Company') {
      return true; 
    } else if (location.role === 'Person') {
      return hasRequiredMaterial(location); 
    }
    return false;
  });
console.log("Filtered Locations: ", filteredLocations);
console.log("Nearby Locations: ", nearbyLocations);
  


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
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className="page-container">
          <Container maxWidth="md" style={{ marginTop: '20px' }}>
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
  {user && center.lat && center.lng && (
    <Marker
      position={{ lat: parseFloat(center.lat), lng: parseFloat(center.lng) }}
      icon={personPin}
      title="Company Location"
    />
  )}
   {filteredLocations.map((location, index) => {
  if (location.role === 'Company') {
    return (
      <Marker
        key={index}
        position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }}
        icon={companyPin}
        title={location.companyName}
        onClick={() => handleMarkerClick(location)}
      />
    );
  } else if (hasRequiredMaterial(location)) {
    return (
      <Marker
        key={index}
        position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }}
        icon={requestPin}
        title={location.name}
        onClick={() => handleMarkerClick(location)}
      />
    );
  }
  return null;
})}
</GoogleMap>
          </Container>

          { requestsAccepted && requestsAccepted.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6" align="center">Requests Accepted:</Typography>
              <TableContainer component={Paper} className="table-container">
                <div className="table-wrapper">
                  <Table className="table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Material</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requestsAccepted.map(request => (
                        <TableRow key={request.id}>
                          <TableCell>{request.materialName}</TableCell>
                          <TableCell>{request.quantity}</TableCell>
                          <TableCell>{request.unit}</TableCell>
                          <TableCell>
                            {request.status === 'PROCESSING' && <img src={processing} title="Processing" alt="Processing" style={{ height: 30 }} />}
                            {request.status === 'COMPLETED' && <img src={completed} title="Completed" alt="Completed" style={{ height: 30 }} />}
                          </TableCell>
                          <TableCell>
                            {request.status === 'PROCESSING' && (
                              <Button onClick={() => handleFinishRequest(request.id)}>Finish</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TableContainer>
            </div>
          )}

          {selectedUser && filteredRequestsOnHold.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6" align="center">Pending requests for {selectedUser.name}:</Typography>
              <TableContainer component={Paper} className="table-container">
                <div className="table-wrapper">
                  <Table className="table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Material</TableCell>
                        <TableCell>Created date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Accepted date</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRequestsOnHold.map(request => (
                        <TableRow key={request.id}>
                          <TableCell>{request.materialName}</TableCell>
                          <TableCell>{format(new Date(request.dateRequestCreated), 'dd/MM/yyyy HH:mm')}</TableCell>
                          <TableCell>
                            {request.status === 'ON_HOLD' && <img src={on_hold} title="On Hold" alt="On Hold" style={{ height: 30 }} />}
                            {request.status === 'PROCESSING' && <img src={processing} title="Processing" alt="Processing" style={{ height: 30 }} />}
                            {request.status === 'COMPLETED' && <img src={completed} title="Completed" alt="Completed" style={{ height: 30 }} />}
                          </TableCell>
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
                </div>
              </TableContainer>
            </div>
          )}

          {selectedCompanyDetails && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6" align="center">Details company {selectedCompanyDetails.companyName}:</Typography>
              <TableContainer component={Paper} className="table-container">
                <div className="table-wrapper">
                  <Table className="table">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>{selectedCompanyDetails.companyName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Phone</TableCell>
                        <TableCell>{selectedCompanyDetails.companyNumberPhone}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>{selectedCompanyDetails.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell>{selectedCompanyDetails.address}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Materials</TableCell>
                        <TableCell>{selectedCompanyDetails.materialList.join(", ")}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
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
