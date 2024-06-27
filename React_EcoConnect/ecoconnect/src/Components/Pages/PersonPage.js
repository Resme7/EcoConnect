import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, TextField, Box, Container, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useUser } from '../Pages/util/UserContext';
import {fetchCompanyById, fetchNearbyCompaniesRadius, fetchRequestByPersonId, fetchRequestHistoryByPersonId, deleteRequestById, fetchRequestById, fetchMaterialById, fetchCompaniesByMaterial, fetchAllMaterials } from './Service/Service';
import logo from '../Assets/ecoConnect.png';
import personPin from '../Assets/person-pin.png';
import companyPin from '../Assets/company-pin.png';
import on_hold from '../Assets/hourglass_onhold.png';
import processing from '../Assets/loading-processing.png';
import completed from '../Assets/approved.png';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import './style/TableStyle.css';

const mapContainerStyle = {
    height: "600px",
    width: "100%"
};

function PersonPage() {
    const { user, setUser } = useUser();
    const [requests, setRequests] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [history, setHistory] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [radius, setRadius] = useState(10);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const navigate = useNavigate();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAz8QnnKvBaN7Z2sAX1hH7_Djg8zqJNkQk', 
    });

    useEffect(() => {
        if (user && user.id) {
            fetchRequestByPersonId(user.id)
                .then(response => {
                    if (response.status === 200) {
                        setRequests(response.data);
                        console.log('Fetched requests:', response.data); 
                    }
                })
                .catch(error => console.error('Failed to fetch requests:', error));

            if (user.latitude && user.longitude) {
                setCenter({
                    lat: parseFloat(user.latitude),
                    lng: parseFloat(user.longitude)
                });
            }

            fetchNearbyCompaniesRadius(user.id, radius)
                .then(response => {
                    if (response.status === 200) {
                        setCompanies(response.data);
                    }
                })
                .catch(error => console.error('Failed to fetch nearby companies:', error));

            fetchRequestHistoryByPersonId(user.id)
                .then(response => {
                    if (response.status === 200) {
                        const rawData = response.data;
                        const requestIds = rawData.map(record => typeof record === 'object' && record.hasOwnProperty('id') ? record.id : record);
                        Promise.all(requestIds.map(id => fetchRequestById(id)))
                            .then(async requestResponses => {
                                const fullRequests = await Promise.all(requestResponses.map(async res => {
                                    const request = res.data;
                                    if (request.material) {
                                        const materialResponse = await fetchMaterialById(request.material);
                                        request.material = materialResponse.data;
                                    }
                                    return request;
                                }));
                                setHistory(fullRequests);
                            })
                            .catch(error => console.error('Failed to fetch request details:', error));
                    } else {
                        console.error('Failed to fetch request history:', response.status, response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch request history:', error);
                    console.error('Error config:', error.config);
                    console.error('Error request:', error.request);
                });

            fetchAllMaterials()
                .then(response => {
                    if (response.status === 200) {
                        setMaterials(response.data);
                    }
                })
                .catch(error => console.error('Failed to fetch materials:', error));
        }
    }, [user, radius]);

    const handleDelete = (requestId) => {
        deleteRequestById(requestId)
            .then(response => {
                if (response.status === 200) {
                    setHistory(history.filter(request => request.id !== requestId));
                }
            })
            .catch(error => console.error('Failed to delete request:', error));
    };

    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };

    const handleUserProfile = () => {
        navigate('/user-profile');
    };

    const handleRadiusChange = (event) => {
        setRadius(event.target.value);
    };

    const handleMaterialChange = (event) => {
        const materialName = event.target.value;
        setSelectedMaterial(materialName);

        if (materialName === '') {
            fetchNearbyCompaniesRadius(user.id, radius)
                .then(response => {
                    if (response.status === 200) {
                        setCompanies(response.data);
                        console.log('Fetched companies:', response.data);
                    } else {
                        console.error('Failed to fetch nearby companies:', response.status, response.statusText);
                    }
                })
                .catch(error => console.error('Failed to fetch nearby companies:', error));
        } else {
            fetchCompaniesByMaterial(materialName)
                .then(response => {
                    if (response.status === 200) {
                        const companyIds = response.data;
                        console.log("Company IDs:", companyIds);
                        return Promise.all(companyIds.map(id => fetchCompanyById(id)));
                    } else {
                        throw new Error('Failed to fetch companies by material');
                    }
                })
                .then(responses => {
                    const companiesData = responses.map(response => response.data);
                    console.log("Fetched companies by material:", companiesData);
                    setCompanies(companiesData);
                })
                .catch(error => console.error('Failed to fetch companies by material:', error));
        }
    };

    if (!isLoaded) {
        navigate('/person');
    };

    return (
        <Box>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <img src={logo} alt="Logo" style={{ height: 50, margin: 10 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, color: '#134611', textAlign: 'center', marginLeft: 'auto' }}>
                        Eco Connect
                    </Typography>
                    <IconButton color="inherit" onClick={handleUserProfile}>
                        <AccountCircleIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className='page-container'>
                <Container maxWidth="md" style={{ marginTop: '20px' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <TextField
                            label="Radius (km)"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={radius}
                            onChange={handleRadiusChange}
                            sx={{ mr: 2 }}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="material-select-label">Materials</InputLabel>
                            <Select
                                labelId="material-select-label"
                                value={selectedMaterial}
                                onChange={handleMaterialChange}
                                renderValue={(selected) => selected}
                            >
                                <MenuItem value="">
                                    <em>All Materials</em>
                                </MenuItem>
                                {materials.map(material => (
                                    <MenuItem key={material.id} value={material.materialName}>
                                        {material.materialName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={12}
                    >
                        {user && center.lat && center.lng && (
                            <Marker
                                position={{ lat: center.lat, lng: center.lng }}
                                icon={personPin}
                                title="Your Location"
                            />
                        )}
                        {companies.map((company, index) => (
                            company.latitude && company.longitude && (
                                <Marker
                                    key={index}
                                    position={{
                                        lat: parseFloat(company.latitude),
                                        lng: parseFloat(company.longitude)
                                    }}
                                    icon={companyPin}
                                    title={company.companyName}
                                    onClick={() => setSelectedCompany(company)}
                                />
                            )
                        ))}
                        {selectedCompany && (
                            <InfoWindow
                                position={{
                                    lat: parseFloat(selectedCompany.latitude),
                                    lng: parseFloat(selectedCompany.longitude)
                                }}
                                onCloseClick={() => setSelectedCompany(null)}
                            >
                                <div>
                                    <h2>{selectedCompany.companyName}</h2>
                                    <p><strong>Materials:</strong> {selectedCompany.materialList ? selectedCompany.materialList.join(', ') : 'N/A'}</p>
                                    <p><strong>Email:</strong> {selectedCompany.email || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {selectedCompany.companyNumberPhone || 'N/A'}</p>
                                    <p><strong>Address:</strong> {selectedCompany.address || 'N/A'}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </Container>
                <br></br>
                <Container maxWidth="md">
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button variant="contained" color="inherit">
                            <Link to="/create-request" style={{ textDecoration: 'none', color: 'inherit' }}>Create Request</Link>
                        </Button>
                    </Box>
                    {history.length > 0 && (
                        <div>
                            <Typography variant="h5" align="center" mt={4}>
                                Request History
                            </Typography>
                            <TableContainer component={Paper} className="table-container">
                                <div className='table-wrapper'>
                                    <Table className="table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Material</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Unit</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Date Created</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {history.map((record, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{record.material ? record.material.materialName : 'Unknown'}</TableCell>
                                                    <TableCell>{record.quantity || 'N/A'}</TableCell>
                                                    <TableCell>{record.unit || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        {record.status === 'ON_HOLD' && <img src={on_hold} title="On Hold" alt= "OnHold" style={{ height: 30 }} />}
                                                        {record.status === 'PROCESSING' && <img src={processing} title="Processing" alt= "Processing" style={{ height: 30 }} />}
                                                        {record.status === 'COMPLETED' && <img src={completed} title="Completed" alt= "Completed" style={{ height: 30 }} />}
                                                    </TableCell>
                                                    <TableCell>{record.dateRequestCreated ? new Date(record.dateRequestCreated).toLocaleDateString() : 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={() => handleDelete(record.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TableContainer>
                        </div>
                    )}
                </Container>
            </div>
        </Box>
    );
}

export default PersonPage;
