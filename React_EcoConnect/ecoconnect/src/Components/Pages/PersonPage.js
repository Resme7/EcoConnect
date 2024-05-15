import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, CssBaseline, List, ListItem, ListItemText, Button } from '@mui/material';
import { useUser } from '../Pages/util/UserContext'; 
import { fetchRequestsByUserId } from './RequestService'; 
import logo from '../Assets/ecoConnect.png';

function PersonPage() {
    const { user } = useUser(); 
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (user && user.personId) { 
            fetchRequestsByUserId(user.personId)
                .then(response => {
                    if(response.status === 200) {
                        setRequests(response.data); 
                    }
                })
                .catch(error => console.error('Failed to fetch requests:', error));
        }
    }, [user]);  

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
            <Container maxWidth="md">
                {requests.length > 0 ? ( 
                    <List>
                        {requests.map((request, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={`${request.materialName} - Quantity: ${request.quantity}`} />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="h5" align="center" mt={4}>
                        No requests available.
                    </Typography>
                )}
            </Container>
            </div>
        </Box>
    );
}

export default PersonPage;
