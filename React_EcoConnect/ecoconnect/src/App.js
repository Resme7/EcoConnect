import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/LoginSingup/Login';
import SignUp from './Components/LoginSingup/SignUp';
import PersonPage from './Components/Pages/PersonPage';
import CompanyPage from './Components/Pages/CompanyPage';

function App() {
  return (
    <Router>
    <Routes>
      <Route exact path="/" element={<Login />} /> 
      <Route path="/signup" element={<SignUp />} />
      <Route path="/person" element={<PersonPage />} />
      <Route path="/company" element={<CompanyPage />} />
    </Routes>
  </Router>
  );
}

export default App;
