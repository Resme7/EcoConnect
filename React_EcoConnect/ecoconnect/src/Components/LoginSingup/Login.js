import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import './style/Login.css'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

function Login() {
    const [error, setError] = useState('');
    const handleLogin = () => {

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        fetch('http://localhost:8082/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed.');
            }
            return response.json();
        })
        .then(data => {
            // Aici poți trata răspunsul primit de la server, cum ar fi redirecționarea către o altă pagină
            console.log('Successful login:', data);
        })
        .catch(error => {
            setError('Login failed. Please try again.');
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
                <img src={email_icon} alt='' />
                <input type='email' placeholder='Email'/>
            </div>
            <div className='input'>
                <img src={password_icon} alt='' />
                <input type='password' placeholder='Password'/>
            </div>
        </div>
        <div className='signup-submit'>Don't have an account? <Link to="/signup">Sign Up</Link></div>
        <div className='submit-container'>
            <div className='submit' onClick={handleLogin}>Login</div>
        </div>
        
        
      </div>
    );
  }
  
  export default Login;
  