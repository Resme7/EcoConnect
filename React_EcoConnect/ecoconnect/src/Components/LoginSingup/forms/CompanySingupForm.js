import React, { useState, useEffect } from 'react';
import Map from './Map';
import * as yup from 'yup';

const companySchema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  descriptionCompany: yup.string().required('Description is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  street: yup.string().required('Street is required'),
  number: yup.string().required('Number is required'),
  building: yup.string().required('Building is required'),
  entrance: yup.string().required('Entrance is required'),
  apartNumber: yup.string().required('Apartment number is required'),
  companyNumberPhone: yup.string().matches(/^[0][7]([0-9]{8})$/, 'Invalid phone number').required('Phone number is required'),
  companyCode: yup.string().required('Company code is required'),
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
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
  
    if (e.target.type === 'checkbox') {
      if (checked) {
        setFormData(prevState => ({
          ...prevState,
          [name]: [...prevState[name], value],
        }));
      } else {
        setFormData(prevState => ({
          ...prevState,
          [name]: prevState[name].filter(item => item !== value),
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  
  const handleMapRightClick = (clickedLat, clickedLng) => {
    setFormData(prevState => ({
      ...prevState,
      latitude: clickedLat.toString(),
      longitude: clickedLng.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await companySchema.validate(formData, { abortEarly: false });

      console.log('FormData before fetch:', formData);
      const response = await fetch('http://localhost:8082/api/companies', {
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
      console.log('Company signup successful:', data);

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
        console.error('Company signup error:', error);
        setErrorMessage('Failed to sign up');
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
          <input type="text" name="companyName" value={formData.companyName} placeholder='Company Name' onChange={handleChange} />
          {errors.companyName && <span className="error">{errors.companyName}</span>}
        </label>
        <label className='input'>
          <input type="text" name="descriptionCompany" value={formData.descriptionCompany} placeholder='Description' onChange={handleChange} />
          {errors.descriptionCompany && <span className="error">{errors.descriptionCompany}</span>}
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
          <input type="text" name="companyNumberPhone" value={formData.companyNumberPhone} placeholder='Company Phone Number' onChange={handleChange} />
          {errors.companyNumberPhone && <span className="error">{errors.companyNumberPhone}</span>}
        </label>
        <label className='input'>
          <input type="text" name="companyCode" value={formData.companyCode} placeholder='Company Code' onChange={handleChange} />
          {errors.companyCode && <span className="error">{errors.companyCode}</span>}
        </label>
        <h3 className='TextH3'>Material</h3>
        <div className='material'>
          <label className="checkbox-label">
            <input type="checkbox" name="materialName" value="Metal" checked={formData.materialName.includes('Metal')} onChange={handleChange} />
            Metal
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="materialName" value="Paper" checked={formData.materialName.includes('Paper')} onChange={handleChange} />
            Paper
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="materialName" value="Plastic" checked={formData.materialName.includes('Plastic')} onChange={handleChange} />
            Plastic
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="materialName" value="Glass" checked={formData.materialName.includes('Glass')} onChange={handleChange} />
            Glass
          </label>
        </div>

      </div>
      <Map
        latitude={formData.latitude}
        longitude={formData.longitude}
        onRightClick={handleMapRightClick}
        pinType="company"
      />
      {success && <div className="success-message">Așteaptă 3 secunde...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className='submit-button'>
        <button className='submit' type="submit">Sign Up</button>
      </div>
    </form>
  );
}

export default CompanySignupForm;
