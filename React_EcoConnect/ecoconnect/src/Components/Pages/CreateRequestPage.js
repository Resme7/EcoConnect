import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Button, TextField, Container, CssBaseline,
    MenuItem, Select, FormControl, InputLabel, FormHelperText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Home from '@mui/icons-material/Home'
import logo from '../Assets/ecoConnect.png';
import { useUser } from '../Pages/util/UserContext';
import { createRequest } from './Service/Service';
import {  useNavigate } from 'react-router-dom';
import './style/General_page.css';

function CreateRequestPage() {
    const { user } = useUser();
    const [quantity, setQuantity] = useState('');
    const [materialName, setMaterialName] = useState('');
    const [unit, setUnit] = useState('');
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [error, setError] = useState('');
    const [materials, setMaterials] = useState([]);
    const [fetchError, setFetchError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/materials');
                if (!response.ok) {
                    throw new Error('Failed to fetch materials');
                }
                const data = await response.json();
                setMaterials(data);
            } catch (error) {
                setFetchError('Error fetching materials');
                console.error('Error fetching materials:', error);
            }
        };
        fetchMaterials();
    }, []);

    const handleAddToList = () => {
        if (materialName && quantity && unit) {
            const newItem = {
                materialName,
                quantity: parseInt(quantity, 10),
                unit
            };

            setSelectedMaterials(prevMaterials => [...prevMaterials, newItem]);

            setMaterialName('');
            setQuantity('');
            setUnit('');
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleCreateRequest = () => {
        if (user && user.id && selectedMaterials.length > 0) {
            createRequest(user.id, selectedMaterials)
                .then(response => {
                    if (response.status === 200) {
                        alert('Request created successfully!');
                    } else {
                        console.error('Failed to create request:', response.data);
                        alert('Failed to create request: ' + response.data.message);
                    }
                })
                .catch(error => {
                    console.error('Failed to create request:', error);
                    setError('An error occurred while creating the request.');
                    alert('An error occurred while creating the request. Error: ' + error.message);
                });
        } else {
            alert('Please add materials to the list and ensure user is selected.');
        }
    };

    const handleEdit = (index) => {
        setCurrentEditItem(selectedMaterials[index]);
        setEditIndex(index);
        setOpenDialog(true);
    };

    const handleDelete = (index) => {
        setSelectedMaterials(prevMaterials => prevMaterials.filter((_, i) => i !== index));
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setCurrentEditItem(null);
        setEditIndex(null);
    };

    const handleDialogSave = () => {
        setSelectedMaterials(prevMaterials => 
            prevMaterials.map((item, index) => (index === editIndex ? currentEditItem : item))
        );
        handleDialogClose();
    };

    const handlePerson = () => {
        navigate('/person');
    };

    return (
        <div>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <img src={logo} alt="Logo" style={{ height: 50, position: 'fixed', top: 0, left: 0, margin: 10 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, color: '#134611', textAlign: 'center', marginLeft: 'auto' }}>
                        Create Request
                    </Typography>
                    <IconButton onClick={() => handlePerson()}>
                            <Home />
                        </IconButton>
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
                        {materials.map(material => (
                            <MenuItem key={material.id} value={material.materialName}>
                                {material.materialName}
                            </MenuItem>
                        ))}
                    </Select>
                    {fetchError && <FormHelperText error>{fetchError}</FormHelperText>}
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

                {selectedMaterials.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                        <Typography style={{ flex: 1 }}>
                            {item.quantity} {item.unit} of {item.materialName}
                        </Typography>
                        <IconButton onClick={() => handleEdit(index)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}

                <Button variant="contained" onClick={handleCreateRequest} style={{ marginTop: 20 }}>
                    Create Request
                </Button>

                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Edit Material</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Modify the details of the selected material.
                        </DialogContentText>
                        <FormControl fullWidth style={{ marginTop: 20 }}>
                            <InputLabel id="edit-material-label">Material Name</InputLabel>
                            <Select
                                labelId="edit-material-label"
                                id="editMaterialName"
                                value={currentEditItem?.materialName || ''}
                                label="Material Name"
                                onChange={e => setCurrentEditItem({ ...currentEditItem, materialName: e.target.value })}
                            >
                                {materials.map(material => (
                                    <MenuItem key={material.id} value={material.materialName}>
                                        {material.materialName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth style={{ marginTop: 20 }}>
                            <InputLabel id="edit-unit-label">Unit</InputLabel>
                            <Select
                                labelId="edit-unit-label"
                                id="editUnit"
                                value={currentEditItem?.unit || ''}
                                label="Unit"
                                onChange={e => setCurrentEditItem({ ...currentEditItem, unit: e.target.value })}
                            >
                                <MenuItem value="Kg">Kg</MenuItem>
                                <MenuItem value="g">g</MenuItem>
                                <MenuItem value="Tone">Tone</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            id="editQuantity"
                            label="Quantity"
                            fullWidth
                            type="number"
                            value={currentEditItem?.quantity || ''}
                            onChange={e => setCurrentEditItem({ ...currentEditItem, quantity: parseInt(e.target.value, 10) })}
                            style={{ marginTop: 20 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDialogSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
}

export default CreateRequestPage;
