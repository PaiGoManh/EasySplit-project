import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/easySplit_logo.png';
import image from '../../assets/money.jpeg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://api:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' 
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Login failed: ${data.error}`);
        return;
      }
      sessionStorage.setItem('userId', data.user.id);
      sessionStorage.setItem('username', data.user.username);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again later.');
    }
  };

  return (
    <div className='w-screen h-screen bg-gray-900 flex items-center justify-center '>
      <div className='w-[500px] h-[400px] mt-[-10%]'>
        <img src={image} alt='login'/>
      </div>
      <div className='text-white'>
        <form className='bg-[#1c1c1e] p-8 rounded-lg shadow-lg w-[400px] h-[500px] mt-[-7%]' onSubmit={handleSubmit}>
          <div className='flex items-center gap-[8%] mt-[-15%] mb-3'>
            <img src={logo} className='w-[150px] mb-6' alt='EasySplit Logo' />
            <h1 className='text-white text-2xl font-bold mb-6 ml-[-17%]'>Login</h1>
          </div>
          <div className='mb-4 mt-[-10%]'>
            <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full p-2 border border-gray-300 rounded-md text-black' />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
            <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full p-2 border border-gray-300 rounded-md text-black' />
          </div>
          <button type='submit' className='bg-[#007bff] text-white p-2 rounded-lg w-full'>Login</button>
          <p className='text-sm text-gray-500 mt-4'>Don't have an account? <Link to='/signup' className='text-[#007bff]'>Sign up</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
