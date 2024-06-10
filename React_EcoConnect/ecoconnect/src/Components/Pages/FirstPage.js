import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo_alb.png';
import './style/General_page.css';

const FirstPage = () => {
  return (
    <div >
      <div className="titleContainer">
        <h1 className="title">EcoConnect</h1><br></br>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      
      <div className="buttonsContainer">
        <Link to="/login" className="button">Login</Link>
        <Link to="/signup" className="button">Register</Link>
      </div>
    </div>
  );
};

export default FirstPage;