import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useUser } from '../Pages/util/UserContext';
import { fetchRequestByPersonId, fetchRequestHistoryByPersonId, deleteRequestById, fetchRequestById, fetchMaterialById, fetchCompanyPracticeInfo } from './Service/Service';
import logo from '../Assets/ecoConnect.png';
import personPin from '../Assets/person-pin.png';
import companyPin from '../Assets/company-pin.png';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
    height: "600px",
    width: "100%"
};

function PersonPage() {
    const { user } = useUser();
    const [requests, setRequests] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [history, setHistory] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAz8QnnKvBaN7Z2sAX1hH7_Djg8zqJNkQk', // Asigură-te că folosești cheia API corectă
    });

    useEffect(() => {
        if (user && user.id) {
            fetchRequestByPersonId(user.id)
                .then(response => {
                    if (response.status === 200) {
                        setRequests(response.data);
                    }
                })
                .catch(error => console.error('Failed to fetch requests:', error));

            if (user && user.latitude && user.longitude) {
                console.log('User location:', user.latitude, user.longitude);
                setCenter({
                    lat: parseFloat(user.latitude),
                    lng: parseFloat(user.longitude)
                });
            }

            fetchCompanyPracticeInfo()
                .then(response => {
                    if (response.status === 200) {
                        console.log('Companies:', response.data);
                        setCompanies(response.data);
                    }
                })
                .catch(error => console.error('Failed to fetch company practice info:', error));

            fetchRequestHistoryByPersonId(user.personId)
                .then(response => {
                    if (response.status === 200) {
                        const requestIds = response.data.filter(record => typeof record === 'number');
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
                    }
                })
                .catch(error => console.error('Failed to fetch request history:', error));
        }
    }, [user]);

    const handleDelete = (requestId) => {
        deleteRequestById(requestId)
            .then(response => {
                if (response.status === 200) {
                    setHistory(history.filter(request => request.id !== requestId));
                }
            })
            .catch(error => console.error('Failed to delete request:', error));
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <Box>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <img src={logo} alt="Logo" style={{ height: 50, position: 'fixed', top: 0, left: 0, margin: 10 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', marginLeft: 'auto' }}>
                        Eco Connect
                    </Typography>
                    <Button color="inherit">
                        <Link to="/create-request" style={{ textDecoration: 'none', color: 'inherit' }}>Create Request</Link>
                    </Button>
                </Toolbar>
            </AppBar>
            <div className='page-container'>
                <Container maxWidth="md" style={{ marginTop: '20px' }}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={12}
                    >
                         {[user].map((usr, index) => (
                            usr && usr.latitude && usr.longitude && (
                                <Marker
                                    key={`user-marker-${index}`}
                                    position={{ 
                                        lat: parseFloat(usr.latitude), 
                                        lng: parseFloat(usr.longitude) }}
                                    icon={personPin}
                                    title="Your Location"
                                />
                            )
                        ))}
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
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </Container>
            </div>
            <div className='page-container'>
                <Container maxWidth="md">
                    {history.length > 0 && (
                        <div>
                            <Typography variant="h5" align="center" mt={4}>
                                Request History
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
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
                                                <TableCell>{record.status || 'N/A'}</TableCell>
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
                            </TableContainer>
                        </div>
                    )}
                </Container>
            </div>
        </Box>
    );
}

export default PersonPage;
