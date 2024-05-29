import React, { useState, useEffect } from 'react';
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

  const handleMapRightClick = (clickedLat, clickedLng) => {
    setFormData(prevState => ({
      ...prevState,
      latitude: clickedLat.toString(),
      longitude: clickedLng.toString(),
    }));
    setMarkerPosition({ lat: clickedLat, lng: clickedLng });
  };

  const handleMarkerDragEnd = (newLat, newLng) => {
    setFormData(prevState => ({
      ...prevState,
      latitude: newLat.toString(),
      longitude: newLng.toString(),
    }));
    setMarkerPosition({ lat: newLat, lng: newLng });
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
    <form onSubmit={handleSubmit}>
      <div className='form'>
        <label className='input'>
          <input type="text" name="firstName" value={formData.firstName} placeholder='First Name' onChange={handleChange} />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </label>
        <label className='input'>
          <input type="text" name="lastName" value={formData.lastName} placeholder='Last Name' onChange={handleChange} />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </label>
        <label className='input'>
          <input type="email" name="email" value={formData.email} placeholder='Email' onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label className='input'>
          <input type="password" name="password" value={formData.password} placeholder='Password' onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}
        </label>
        <label className='input'>
          <input type="text" name="street" value={formData.street} placeholder='Street' onChange={handleChange} />
          {errors.street && <span className="error">{errors.street}</span>}
        </label>
        <label className='input'>
          <input type="text" name="number" value={formData.number} placeholder='Number' onChange={handleChange} />
          {errors.number && <span className="error">{errors.number}</span>}
        </label>
        <label className='input'>
          <input type="text" name="building" value={formData.building} placeholder='Building' onChange={handleChange} />
          {errors.building && <span className="error">{errors.building}</span>}
        </label>
        <label className='input'>
          <input type="text" name="entrance" value={formData.entrance} placeholder='Entrance' onChange={handleChange} />
          {errors.entrance && <span className="error">{errors.entrance}</span>}
        </label>
        <label className='input'>
          <input type="text" name="apartNumber" value={formData.apartNumber} placeholder='Apartment Number' onChange={handleChange} />
          {errors.apartNumber && <span className="error">{errors.apartNumber}</span>}
        </label>
        <label className='input'>
          <input type="text" name="numberPhone" value={formData.numberPhone} placeholder='Phone Number' onChange={handleChange} />
          {errors.numberPhone && <span className="error">{errors.numberPhone}</span>}
        </label>
      </div>
      <Map 
        latitude={markerPosition.lat} 
        longitude={markerPosition.lng} 
        onRightClick={handleMapRightClick} 
        onMarkerDragEnd={handleMarkerDragEnd}
        pinType="person"
      />
      {success && <div className="success-message">Așteaptă 3 secunde...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className='submit-button'>
        <button className='submit' type="submit">Sign Up</button>
      </div>
    </form>
  );
}

export default PersonSignupForm;
