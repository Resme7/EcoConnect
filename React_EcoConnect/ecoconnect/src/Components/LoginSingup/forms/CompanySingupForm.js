import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, FormHelperText, Box } from '@mui/material';
import Map from './Map';
import * as yup from 'yup';

const companySchema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  descriptionCompany: yup.string().required('Description is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  street: yup.string().matches(/[a-zA-Z ]*$/).required('Street is required'),
  number: yup.string().matches(/^[0-9-]*$/, 'Invalid number').required('Number is required'),
  building: yup.string().matches(/[a-zA-Z0-9-]*$/).required('Building is required'),
  entrance: yup.string().required('Entrance is required'),
  apartNumber: yup.string().required('Apartment number is required'),
  companyNumberPhone: yup.string().matches(/^[0][7]([0-9]{8})$/, 'Invalid phone number').required('Phone number is required'),
  companyCode: yup.string().matches(/[R][O]([0-9]+)*$/, 'Invalid company code ex"RO1234"').required('Company code is required'),
  materialName: yup.array()
    .of(yup.string()
      .matches(/^[a-zA-Z- ]*$/, 'Material name provided does not adhere to the specified field validation rules')
      .min(1, 'At least one material name must be selected')
      .max(20, 'Material name provided does not adhere to the specified field validation rules')
    )
    .required('At least one material name must be selected'),
  latitude: yup.number().required('Latitude is required'),
  longitude: yup.number().required('Longitude is required'),
});

function CompanySignupForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    descriptionCompany: '',
    email: '',
    password: '',
    street: '',
    number: '',
    building: '',
    entrance: '',
    apartNumber: '',
    companyNumberPhone: '',
    companyCode: '',
    materialName: [],
    latitude: '47.1585',
    longitude: '27.6014',
  });
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState('');
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [markerPosition, setMarkerPosition] = useState({
    lat: parseFloat(formData.latitude),
    lng: parseFloat(formData.longitude)
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/materials');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleNewMaterialSubmit = async (e) => {
    e.preventDefault();
    if (materials.some(material => material.materialName.toLowerCase() === newMaterial.toLowerCase())) {
      setErrorMessage('This material already exists.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8082/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ materialName: newMaterial }),
      });
      if (!response.ok) {
        throw new Error('Failed to add new material');
      }
      fetchMaterials();
      setNewMaterial('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      materialName: value,
    }));
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    const apiKey = 'AIzaSyAz8QnnKvBaN7Z2sAX1hH7_Djg8zqJNkQk';
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
      const data = await response.json();
      if (data.status === 'OK') {
        const addressComponents = data.results[0].address_components;
        const address = {
          street: '',
          number: ''
        };
        addressComponents.forEach(component => {
          if (component.types.includes('route')) {
            address.street = component.long_name;
          }
          if (component.types.includes('street_number')) {
            address.number = component.long_name;
          }
        });
        setFormData(prevState => ({
          ...prevState,
          ...address,
        }));
      } else {
        throw new Error(`Geocoding API error: ${data.status}`);
      }
    } catch (error) {
      setErrorMessage(`Unable to fetch address from the selected coordinates. Error: ${error.message}`);
    }
  };

  const handleMapRightClick = async (clickedLat, clickedLng) => {
    setFormData(prevState => ({
      ...prevState,
      latitude: clickedLat.toString(),
      longitude: clickedLng.toString(),
    }));
    setMarkerPosition({ lat: clickedLat, lng: clickedLng });
    await getAddressFromCoordinates(clickedLat, clickedLng);
  };

  const handleMarkerDragEnd = async (newLat, newLng) => {
    setFormData(prevState => ({
      ...prevState,
      latitude: newLat.toString(),
      longitude: newLng.toString(),
    }));
    setMarkerPosition({ lat: newLat, lng: newLng });
    await getAddressFromCoordinates(newLat, newLng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await companySchema.validate(formData, { abortEarly: false });
      
      console.log('Form Data:', formData); // Log form data for debugging

      const response = await fetch('http://localhost:8082/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error('Backend response error:', responseData); // Log backend response for debugging
        throw new Error(`Failed to sign up: ${responseData.message}`);
      }

      console.log('Backend response:', responseData); // Log successful response for debugging
      setSuccess(true);
      setTimeout(() => {
        setRedirect(true);
      }, 1000);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    if (redirect) {
      window.location.href = '/';
    }
  }, [redirect]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form'>
          <TextField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            error={!!errors.companyName}
            helperText={errors.companyName}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            name="descriptionCompany"
            value={formData.descriptionCompany}
            onChange={handleChange}
            error={!!errors.descriptionCompany}
            helperText={errors.descriptionCompany}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Company Phone Number"
            name="companyNumberPhone"
            value={formData.companyNumberPhone}
            onChange={handleChange}
            error={!!errors.companyNumberPhone}
            helperText={errors.companyNumberPhone}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Company Code"
            name="companyCode"
            value={formData.companyCode}
            onChange={handleChange}
            error={!!errors.companyCode}
            helperText={errors.companyCode}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Building"
            name="building"
            value={formData.building}
            onChange={handleChange}
            error={!!errors.building}
            helperText={errors.building}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Entrance"
            name="entrance"
            value={formData.entrance}
            onChange={handleChange}
            error={!!errors.entrance}
            helperText={errors.entrance}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Apartment Number"
            name="apartNumber"
            value={formData.apartNumber}
            onChange={handleChange}
            error={!!errors.apartNumber}
            helperText={errors.apartNumber}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            error={!!errors.street}
            helperText={errors.street}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            error={!!errors.number}
            helperText={errors.number}
            fullWidth
            margin="dense"
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="material-select-label">Materials</InputLabel>
            <Select
              labelId="material-select-label"
              multiple
              value={formData.materialName}
              onChange={handleSelectChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {materials.map(material => (
                <MenuItem key={material.id} value={material.materialName}>
                  {material.materialName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select materials used by the company</FormHelperText>
          </FormControl>
          <Box component="form" onSubmit={handleNewMaterialSubmit} sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <TextField
          label="Add New Material"
          value={newMaterial}
          onChange={(e) => setNewMaterial(e.target.value)}
          placeholder="New Material Name"
          fullWidth
          margin="dense"
          sx={{ marginRight: '16px' }}
        />
        <Button variant="contained" color="primary" onClick={handleNewMaterialSubmit} sx={{ marginTop: '16px', height: '56px' }}>Add Material</Button>
      </Box>
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      <br></br>
        </div>
        <Map
          latitude={markerPosition.lat}
          longitude={markerPosition.lng}
          onRightClick={handleMapRightClick}
          onMarkerDragEnd={handleMarkerDragEnd}
          pinType="company"
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ backgroundColor: '#134611', '&:hover': { backgroundColor: '#102e10' } }}
          >
            Sign Up
          </Button>
        </Box>
        {success && <div className="success-message">Please wait 3 seconds...</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
      </form>
      
    </div>
  );
}

export default CompanySignupForm;
