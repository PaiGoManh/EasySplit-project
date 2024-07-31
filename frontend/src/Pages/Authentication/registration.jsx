import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/easySplit_logo.png';
import image from '../../assets/money.jpeg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    try {
      const response = await fetch('http://api:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, firstName, lastName, phoneNumber }),
        credentials: 'include' 
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(`Registration failed: ${data.message}`);
        return;
      }

      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed. Please try again later.');
    }
  };

  return (
    <div className='w-screen h-screen bg-gray-900 flex items-center justify-center pt-[-10%]'>
      <div className='w-[500px] h-[500px]'>
        <img src={image} alt='signup' className='h-full w-full object-cover'/>
      </div>
      <div className='text-white'>
        <form className='bg-[#1c1c1e] p-8 rounded-lg shadow-lg w-[450px] h-[500px] overflow-y-auto ' onSubmit={handleSubmit}>
          <div className='flex items-center gap-[8%] mb-3 mt-[-5%]'>
            <img src={logo} className='w-[150px] mb-6' alt='EasySplit Logo' />
            <h1 className='text-white text-2xl font-bold mb-6 ml-[-17%]'>Sign Up</h1>
          </div>
          <div className='mb-4 mt-[-10%]'>
            <label className='block text-sm font-medium mb-2' htmlFor='username'>Username</label>
            <input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)} required className='w-full p-2 border border-gray-300 rounded-md text-black' />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full p-2 border border-gray-300 rounded-md text-black' />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='firstName'>First Name</label>
            <input type='text' id='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} required className='w-full p-2 border border-gray-300 rounded-md text-black' />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='lastName'>Last Name</label>
            <input type='text' id='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} required className='w-full p-2 border border-gray-300 rounded-md text-black' />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='phoneNumber'>Phone Number</label>
            <input type='text' id='phoneNumber' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className='w-full p-2 border border-gray-300 rounded-md text-black' />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
            <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full p-2 border border-gray-300 rounded-md text-black' />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='confirmPassword'>Confirm Password</label>
            <input type='password' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className='w-full p-2 border border-gray-300 rounded-md text-black' />
          </div>
          <button type='submit' className='bg-[#007bff] text-white p-2 rounded-lg w-full'>Sign Up</button>
          <p className='text-sm text-gray-500 mt-4'>Already have an account? <Link to='/login' className='text-[#007bff]'>Login</Link></p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
