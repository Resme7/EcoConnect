import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/LoginSingup/Login';
import SignUp from './Components/LoginSingup/SignUp';

function App() {
  return (
    <Router>
    <Routes>
      <Route exact path="/" element={<Login />} /> 
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </Router>
  );
}

export default App;
