import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedMembersList, setSelectedMembersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://api:5000/auth/username', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      const currentUser = sessionStorage.getItem('username');
      const currentUserData = data.find(user => user.username === currentUser);

      const filteredUsers = data.filter(user => user.username !== currentUser);
      setMembers([...filteredUsers, currentUserData]); // Include current user in the members array for display

      // Automatically add the current user to the selected members list
      if (currentUserData) {
        setSelectedMembersList([currentUserData._id]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    if (selectedMember && !selectedMembersList.includes(selectedMember)) {
      setSelectedMembersList([...selectedMembersList, selectedMember]);
      setSelectedMember('');
    }
  };

  const handleDeleteMember = (memberId) => {
    setSelectedMembersList(selectedMembersList.filter((member) => member !== memberId));
  };

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    try {
      const groupData = {
        name: groupName,
        description: groupDescription,
        members: selectedMembersList,
        currency: currency,
      };

      const response = await fetch('http://api:5000/group/addgroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${errorData.message}`);
      }

      const result = await response.json();
      console.log('Group saved successfully:', result);
      navigate('/Dashboard/groups');
    } catch (error) {
      console.error('Error saving group:', error);
      setError(error.message || 'Failed to save group.');
    }
  };

  return (
    <div className='container mx-auto p-4 max-w-4xl bg-white text-black shadow-md rounded-lg'>
      <h2 className="text-2xl mb-4 font-bold text-center text-gray-700">
        Add Group
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSaveGroup} className="flex flex-wrap -mx-2">
        <div className="w-full h-[300px] md:w-1/2 px-2 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="name">Group Name:</label>
            <input
              type="text"
              id="name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              rows="4"
              required
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="members">Select Members:</label>
            <div className="flex">
              <select
                id="members"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Member</option>
                {members.filter(member => member.username !== sessionStorage.getItem('username')).map((member) => (
                  <option key={member._id} value={member._id}>{member.username}</option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={handleAddMember} 
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2 text-gray-700">Selected Members:</h3>
              <ul className="list-disc list-inside">
                {selectedMembersList.map((memberId) => {
                  const member = members.find((m) => m._id === memberId);
                  return (
                    <li key={memberId} className="flex justify-between items-center mb-2">
                      {member.username}
                      <button
                        type="button"
                        onClick={() => handleDeleteMember(memberId)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700" htmlFor="currency">Currency:</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
        </div>

        <div className="w-full px-2">
          <div className="flex justify-between">
            <button 
              type="submit" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Save Group
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/Dashboard/groups')}  
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddGroup;
