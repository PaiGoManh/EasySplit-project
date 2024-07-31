import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Authentication/home';
import Login from './Pages/Authentication/login';
import Signup from './Pages/Authentication/registration';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard/*' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
