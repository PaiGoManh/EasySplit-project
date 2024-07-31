import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import logo from '../../assets/easySplit_logo.png';
import profile from '../../assets/profile.png';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const fetchUser = async () => {
    try {
      const response = await fetch('http://api:5000/auth/currentUser', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://api:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        sessionStorage.removeItem('AuthToken');
        sessionStorage.removeItem('User');
        navigate('/');
        setUser(null); // Clear user data on logout
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className='bg-gray-900 text-white shadow-lg'>
      <div className='flex items-center justify-between h-[70px]'>
        <div className='flex items-center'>
          <Link to='/'>
            <img src={logo} className='w-32 ml-[-20%]' alt='EasySplit Logo' />
          </Link>
          <div className='text-white ml-[-25%] font-bold text-2xl'>EasySplit</div>
        </div>
        <div className='relative mr-[3%]'>
          <button
            onClick={toggleDropdown}
            className='flex items-center text-sm'
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {loading ? (
              <div className='h-[50px] w-[50px] rounded-full bg-gray-400'>loading</div>  // Placeholder during loading
            ) : (
              <img
                className='h-[50px] w-[50px] rounded-full'
                src={user?.profilePicture ? `/api/uploads/${user.profilePicture}` : profile}
                alt='Profile'
              />
            )}
            <FaChevronDown className='ml-2 h-5 w-5' />
          </button>
          {dropdownOpen && (
            <div className='absolute z-50 right-0 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5'>
              <>
                {!loading && user && (
                  <>
                    <h1 className='text-black ml-4 mt-2 mb-2 text-l'>{user.username}</h1>
                    <Link
                      to='/dashboard/'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Profile
                    </Link>
                    <Link
                      to='/dashboard/settings'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left'
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
