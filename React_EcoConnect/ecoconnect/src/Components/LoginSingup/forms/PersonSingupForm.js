import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, FormHelperText } from '@mui/material';
import Map from './Map';
import * as yup from 'yup';

const personSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  street: yup.string().required('Street is required'),
  number: yup.string().required('Number is required'),
  building: yup.string().required('Building is required'),
  entrance: yup.string().required('Entrance is required'),
  apartNumber: yup.string().required('Apartment number is required'),
  numberPhone: yup.string().matches(/^[0][7]([0-9]{8})$/, 'Invalid phone number').required('Phone number is required'),
  longitude: yup.number().required('Longitude is required'),
  latitude: yup.number().required('Latitude is required'),
});

function PersonSignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    street: '',
    number: '',
    building: '',
    entrance: '',
    apartNumber: '',
    numberPhone: '',
    latitude: '47.1585',
    longitude: '27.6014',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [markerPosition, setMarkerPosition] = useState({
    lat: parseFloat(formData.latitude),
    lng: parseFloat(formData.longitude)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
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
      await personSchema.validate(formData, { abortEarly: false });
      const response = await fetch('http://localhost:8082/api/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
      const data = await response.json();
      setSuccess(true);
      setTimeout(() => {
        setRedirect(true);
      }, 3000);
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
    <Box component="form" onSubmit={handleSubmit} >
      <div className='form'>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
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
          label="Phone Number"
          name="numberPhone"
          value={formData.numberPhone}
          onChange={handleChange}
          error={!!errors.numberPhone}
          helperText={errors.numberPhone}
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
      </div>
      <Map 
        latitude={markerPosition.lat} 
        longitude={markerPosition.lng} 
        onRightClick={handleMapRightClick} 
        onMarkerDragEnd={handleMarkerDragEnd}
        pinType="person"
      />
      {success && <div className="success-message">Please wait 3 seconds...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button
          variant="contained"
          type="submit"
          sx={{ backgroundColor: '#134611', '&:hover': { backgroundColor: '#102e10' } }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

export default PersonSignupForm;
