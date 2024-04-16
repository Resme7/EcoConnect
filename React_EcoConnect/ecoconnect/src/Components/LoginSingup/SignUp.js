import React, { useState } from 'react';
import './style/SignUp.css';
import PersonSignupForm from './forms/PersonSingupForm';
import CompanySignupForm from './forms/CompanySingupForm';


function SignUp() {
  const [userType, setUserType] = useState('person');

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <div className="signup-container"> 
      <div className='header'>
        <h2 className='text'>Sign Up</h2>
        <div className='underline'></div>
      </div>
    
      <div className='container-label'>
      <label className='choose'>
        <input
          type="radio"
          value="person"
          checked={userType === 'person'}
          onChange={handleUserTypeChange}
        />
        Person
      </label>
      <label className='choose'>
        <input
          type="radio"
          value="company"
          checked={userType === 'company'}
          onChange={handleUserTypeChange}
        />
        Company
      </label>
      </div>
      {userType === 'person' ? <PersonSignupForm /> : <CompanySignupForm />}
      
    </div>
  );
}
export default SignUp;