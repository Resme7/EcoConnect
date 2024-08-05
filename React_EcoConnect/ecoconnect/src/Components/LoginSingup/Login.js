import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Pages/util/UserContext'; 
import './style/Login.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';


function Login() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser(); 

    const handleLogin = () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:8082/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Login response:', data);  
            const userId = data.id;

            if (data.role === 'Company') {
                fetch(`http://localhost:8082/api/users/company-id/${userId}`)

                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch company ID.');
                        }
                        return response.json();
                    })
                    .then(companyData => {
                        console.log('Company ID response:', companyData);
                        setUser({
                            id: userId,
                            role: data.role,
                            companyId: companyData.companyId,
                            latitude: parseFloat(companyData.latitude),
                            longitude: parseFloat(companyData.longitude)
                        });
                    })
                navigate('/company');
            } else if (data.role === 'Person') {
                fetch(`http://localhost:8082/api/users/person-id/${userId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch person ID.');
                        }
                        return response.json();
                    })
                    .then(personData => {
                        console.log('Person ID response:', personData);
                        setUser({
                            id: userId,
                            role: data.role,
                            personId: personData.personId,
                            latitude: parseFloat(personData.latitude),
                            longitude: parseFloat(personData.longitude)
                        });
                        navigate('/person');
                    })
                    .catch(error => {
                        setError('Failed to fetch person ID. Please try again.');
                        console.error('Person ID Fetch Error:', error);
                    });
            }
        })
        .catch(error => {
            setError('Login failed. Please try again.');
            console.error('Login Error:', error);
        });
    };

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>Login</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <img src={email_icon} alt='Email Icon' />
                    <input type='email' id='email' placeholder='Email'/>
                </div>
                <div className='input'>
                    <img src={password_icon} alt='Password Icon' />
                    <input type='password' id='password' placeholder='Password'/>
                </div>
            </div>
            <div className='signup-submit'>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
            <div className='submit-container'>
                <div className='submit' onClick={handleLogin}>Login</div>
            </div>
            {error && <div className='error-message'>{error}</div>}
        </div>
    );
}

export default Login;
