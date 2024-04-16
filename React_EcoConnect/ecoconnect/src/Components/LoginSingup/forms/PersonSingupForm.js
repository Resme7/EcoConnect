import React, { useState } from 'react';


function PersonSignupForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [building, setBuilding] = useState('');
  const [entrance, setEntrance] = useState('');
  const [apartNumber, setApartNumber] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const personData = {
      firstName,
      lastName,
      email,
      password,
      address: {
        street,
        number,
        building,
        entrance,
        apartNumber,
      },
      numberPhone,
      longitude,
      latitude,
    };
    fetch('http://localhost:8082/api/people', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to sign up');
        }
        return response.json();
      })
      .then(data => {
        console.log('Person signup successful:', data);
        // Dacă dorești, poți adăuga aici logica pentru redirecționarea către o altă pagină
      })
      .catch(error => {
        console.error('Person signup error:', error);
        // Tratează eroarea aici, afișând un mesaj către utilizator sau luând alte măsuri necesare
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className='textH3'>Person Form</h3>
      <div className='form'>
      <label className='input'>
        <input type="text" value={firstName} placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={lastName} placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} />
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
        <input type="text" value={numberPhone} placeholder='Phone Number' onChange={(e) => setNumberPhone(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={longitude} placeholder='Latitude' onChange={(e) => setLongitude(e.target.value)} />
      </label>
      <label className='input'>
        <input type="text" value={latitude} placeholder='Longitude' onChange={(e) => setLatitude(e.target.value)} />
      </label>
      </div>
      <div className='submit-button'>
        <button className='submit' type="submit">Sign Up</button>
      </div>
    </form>
  );
}

export default PersonSignupForm;
