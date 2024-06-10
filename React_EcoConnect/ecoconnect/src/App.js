import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FirstPage from './Components/Pages/FirstPage'
import Login from './Components/LoginSingup/Login';
import SignUp from './Components/LoginSingup/SignUp';
import PersonPage from './Components/Pages/PersonPage';
import CompanyPage from './Components/Pages/CompanyPage';
import UserProfile from './Components/Pages/UserProfile';
import UserProfileCompany from './Components/Pages/UserProfileCompany';
import { UserProvider } from './Components/Pages/util/UserContext';
import CreateRequestPage from './Components/Pages/CreateRequestPage';
import { LoadScript } from '@react-google-maps/api';


const API_KEY = 'AIzaSyAz8QnnKvBaN7Z2sAX1hH7_Djg8zqJNkQk';

function App() {
  return (
    <UserProvider>
      <LoadScript googleMapsApiKey={API_KEY}>
        <Router>
          <Routes>
            <Route exact path="/" element={<FirstPage />} /> 
            <Route  path="/login" element={<Login />} /> 
            <Route path="/signup" element={<SignUp />} />
            <Route path="/person" element={<PersonPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/create-request" element={<CreateRequestPage />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-profile-company" element={<UserProfileCompany />} />
          </Routes>
        </Router>
      </LoadScript>
    </UserProvider>
  );
}

export default App;
