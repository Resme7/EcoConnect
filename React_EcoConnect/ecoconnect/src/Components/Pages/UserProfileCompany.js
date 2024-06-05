import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import logo from '../Assets/ecoConnect.png';
import { AppBar, Card, CardContent, Box, Toolbar, Typography, Button, Container, CssBaseline } from '@mui/material';
import { useUser } from '../Pages/util/UserContext';
import { fetchUserById,  } from './Service/Service';

function UserProfileCompany() {
    const { user, setUser } = useUser();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (user && user.id) {
            fetchUserById(user.id)
                .then(response => {
                    if (response.status === 200) {
                        setUserData(response.data);
                    }
                })
                .catch(error => console.error('Failed to fetch user data:', error));
        }
    }, [user]);

    
    return (
        <Box>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <img src={logo} alt="Logo" style={{ height: 50, position: 'fixed', top: 0, left: 0, margin: 10 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, color:'#134611',textAlign: 'center', marginLeft: 'auto' }}>
                        Profile
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/company" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Back to Home
                    </Button>
                </Toolbar>
            </AppBar>
            <div className='page-container1'>
                <Container maxWidth="md" style={{ marginTop: '20px' }}>
                    <Box display="flex" justifyContent="center">
                        {userData && (
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                            {userData.companyName}
                                    </Typography>
                                    <br />
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Comapny Name: {userData.companyName}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Description: {userData.description}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Email: {userData.email}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Phone: {userData.companyNumberPhone}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Company Code: {userData.companyCode}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Address: {userData.companyAddress}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                    <br></br>
                    
                </Container>
                
            </div>
            
        </Box>
    );
}

export default UserProfileCompany;
