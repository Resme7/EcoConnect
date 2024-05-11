import { useState } from 'react';
import { Link } from 'react-router-dom';
import './style/Login.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:8082/api/users/login', {
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
            // Verificăm rolul utilizatorului
            if (data.role === 'Company') {
                // Dacă este o companie, redirecționăm către pagina companiei
                navigate('/company');
                console.log(data)
            } else if(data.role === 'Person'){
                // Altfel, redirecționăm către pagina utilizatorului obișnuit
                navigate('/person');
                console.log(data)
            }
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
                    <input type='email' id='email' placeholder='Email'/>
                </div>
                <div className='input'>
                    <img src={password_icon} alt='' />
                    <input type='password' id='password' placeholder='Password'/>
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
