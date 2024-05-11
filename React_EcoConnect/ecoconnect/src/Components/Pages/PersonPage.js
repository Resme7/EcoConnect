import React from 'react';
import './style/General_page.css';
import logo from '../Assets/ecoConnect.png'
function PersonPage() {
  return (
    <div>
      <div className='header-general'>
      <img src={logo} alt="Logo" className="logo" />
        
      </div>
      <div className="page-container"> 
        <h2>Welcome to Person Page!</h2>
        <p>This is the page for regular users.</p>
      </div>
    </div>
  );
}

export default PersonPage;
