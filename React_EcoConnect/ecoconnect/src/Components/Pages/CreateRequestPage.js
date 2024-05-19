import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, TextField, Container, CssBaseline,
    MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { useUser } from '../Pages/util/UserContext';
import { createRequest } from './RequestService';
import { Link } from 'react-router-dom';
import './style/General_page.css';

function CreateRequestPage() {
    const { user } = useUser();
    const [quantity, setQuantity] = useState('');
    const [materialName, setMaterialName] = useState('');
    const [unit, setUnit] = useState('');
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    

    const handleAddToList = () => {
        if (materialName && quantity && unit) {
            const newItem = {
                materialName,
                quantity: parseInt(quantity, 10),
                unit
            };

            // Directly use the updated list within this function scope
            setSelectedMaterials(prevMaterials => {
                const updatedMaterials = [...prevMaterials, newItem];
                console.log('Current list:', updatedMaterials);
                return updatedMaterials;
            });

            // Clear the input fields
            setMaterialName('');
            setQuantity('');
            setUnit('');
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleCreateRequest = () => {
    console.log('Attempting to create request...', { user, selectedMaterials });
    if (user && user.id && selectedMaterials.length > 0) {
        console.log('Conditions met, sending request...');
        createRequest(user.id, selectedMaterials)
            .then(response => {
                console.log('Request response:', response);
                if (response.ok) {
                    alert('Request created successfully!');
                } else {
                    response.json().then(data => {
                        console.error('Failed to create request:', data);
                        alert('Failed to create request: ' + data.message);
                    });
                }
            })
            .catch(error => {
                console.error('Error during request creation:', error);
                alert('An error occurred while creating the request.');
            });
    } else {
        alert('Please add materials to the list and ensure user is selected.');
    }
};

    return (
        <div>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Create Request
                    </Typography>
                    <Button color="inherit">
                        <Link to="/person" style={{ textDecoration: 'none', color: 'inherit' }}>Back to Home</Link>
                    </Button>
                </Toolbar>
            </AppBar>

            <Container className="page-container" maxWidth="sm">
                <FormControl fullWidth style={{ marginTop: 20 }}>
                    <InputLabel id="material-label">Material Name</InputLabel>
                    <Select
                        labelId="material-label"
                        id="materialName"
                        value={materialName}
                        label="Material Name"
                        onChange={e => setMaterialName(e.target.value)}
                    >
                        <MenuItem value="Metal">Metal</MenuItem>
                        <MenuItem value="Paper">Paper</MenuItem>
                        <MenuItem value="Glass">Glass</MenuItem>
                        <MenuItem value="Plastic">Plastic</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth style={{ marginTop: 20 }}>
                    <InputLabel id="unit-label">Unit</InputLabel>
                    <Select
                        labelId="unit-label"
                        id="unit"
                        value={unit}
                        label="Unit"
                        onChange={e => setUnit(e.target.value)}
                    >
                        <MenuItem value="Kg">Kg</MenuItem>
                        <MenuItem value="g">g</MenuItem>
                        <MenuItem value="Tone">Tone</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    id="quantity"
                    label="Quantity"
                    fullWidth
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    style={{ marginTop: 20 }}
                />

                <Button variant="contained" onClick={handleAddToList} style={{ marginTop: 20 }}>
                    Add to List
                </Button>

                <Button variant="contained" onClick={handleCreateRequest} style={{ marginTop: 20 }}>
                    Create Request
                </Button>
            </Container>
        </div>
    );
}

export default CreateRequestPage;