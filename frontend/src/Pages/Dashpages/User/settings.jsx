import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    bio: '',
  });
  const [profileBanner, setProfileBanner] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://api:5000/auth/currentUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            credentials: 'include',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          bio: userData.bio,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'profileBanner') {
      setProfileBanner(files[0]);
    } else if (name === 'profilePicture') {
      setProfilePicture(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (profileBanner) {
      data.append('profileBanner', profileBanner);
    }
    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }

    try {
      const response = await fetch('http://api:5000/auth/updateProfile', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated successfully:', result);
      navigate('/dashboard/');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-white text-black shadow-md rounded-lg">
      <h2 className="text-2xl mb-4 font-bold text-center text-gray-700">
        Edit Profile
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-wrap -mx-2">
        <div className="w-full h-[300px] md:w-1/2 px-2 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="profileBanner">Profile Banner:</label>
            <input
              type="file"
              id="profileBanner"
              name="profileBanner"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="profilePicture">Profile Picture:</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="w-full mt-[10%]">
          <button
            type="submit"
            className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 w-full"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
