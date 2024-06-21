import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/ecoConnect.png';
import Home from '@mui/icons-material/Home'
import { AppBar, Card, CardContent, Box, Toolbar, Typography, IconButton, Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useUser } from '../Pages/util/UserContext';
import { fetchUserById, deleteUserById } from './Service/Service';

function UserProfile() {
    const { user, setUser } = useUser();
    const [userData, setUserData] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

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

    const handleDelete = () => {
        if (user && user.id) {
            deleteUserById(user.id)
                .then(response => {
                    if (response.status === 200) {
                        setUser(null); 
                        navigate('/'); 
                    }
                })
                .catch(error => console.error('Failed to delete user:', error));
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <img src={logo} alt="Logo" style={{ height: 50, position: 'fixed', top: 0, left: 0, margin: 10 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, color:'#134611',textAlign: 'center', marginLeft: 'auto' }}>
                        Profile
                    </Typography>
                    <IconButton onClick={() => navigate('/person')}>
                            <Home />
                        </IconButton>
                </Toolbar>
            </AppBar>
            <div className='page-container1'>
                <Container maxWidth="md" style={{ marginTop: '20px' }}>
                    <Box display="flex" justifyContent="center">
                        {userData && (
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {userData.lastName} {userData.firstName}
                                    </Typography>
                                    <br />
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        First Name: {userData.firstName}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Last Name: {userData.lastName}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Email: {userData.email}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Phone: {userData.numberPhone}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Address: {userData.personAddress}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                    <br></br>
                    
                </Container>
                <Box align='right'>
                    <Button variant="contained" color="secondary" onClick={handleClickOpen}
                    sx={{  bottom: 16, right: 16 }}>
                        Delete Account
                    </Button>
                    </Box>
                
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default UserProfile;
