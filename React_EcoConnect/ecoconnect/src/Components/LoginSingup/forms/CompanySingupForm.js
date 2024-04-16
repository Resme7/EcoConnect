import React, { useState } from 'react';

function CompanySignupForm() {
  const [companyName, setCompanyName] = useState('');
  const [descriptionCompany, setDescriptionCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [building, setBuilding] = useState('');
  const [entrance, setEntrance] = useState('');
  const [apartNumber, setApartNumber] = useState('');
  const [companyNumberPhone, setCompanyNumberPhone] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const companyData = {
      companyName,
      descriptionCompany,
      email,
      password,
      address: {
        street,
        number,
        building,
        entrance,
        apartNumber,
      },
      companyNumberPhone,
      companyCode,
      materialName,
      location: {
        latitude,
        longitude,
      },
    };
    fetch('http://localhost:8082/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to sign up');
          }
          return response.json();
        })
        .then(data => {
          console.log('Company signup successful:', data);
          // Dacă dorești, poți adăuga aici logica pentru redirecționarea către o altă pagină
        })
        .catch(error => {
          console.error('Company signup error:', error);
          // Tratează eroarea aici, afișând un mesaj către utilizator sau luând alte măsuri necesare
        });
    };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className='textH3'>Company Form</h3>
      <div className='form'>
      <label className='input'>
        <input type="text" value={companyName} placeholder='Company Name' onChange={(e) => setCompanyName(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={descriptionCompany} placeholder='Description' onChange={(e) => setDescriptionCompany(e.target.value)} />
      </label>
      <label className='input'>
        <input type="email" value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className='input'>
        <input type="password" value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={street} placeholder='Street' onChange={(e) => setStreet(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={number} placeholder='Number' onChange={(e) => setNumber(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={building} placeholder='Building' onChange={(e) => setBuilding(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={entrance} placeholder='Entrance' onChange={(e) => setEntrance(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={apartNumber} placeholder='Apartment Number' onChange={(e) => setApartNumber(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={companyNumberPhone} placeholder='Company Phone Number' onChange={(e) => setCompanyNumberPhone(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={companyCode} placeholder='Company Code' onChange={(e) => setCompanyCode(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={materialName} placeholder='Material Name' onChange={(e) => setMaterialName(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={latitude} placeholder='Latitude'  onChange={(e) => setLatitude(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={longitude}  placeholder='Longitude' onChange={(e) => setLongitude(e.target.value)} />
      </label>
      </div>
      <div className='submit-button'>
      <button className='submit' type="submit">Sign Up</button>
      </div>
    </form>
  );
}

export default CompanySignupForm;