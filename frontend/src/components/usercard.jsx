import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="user-card flex flex-col justify-start items-center text-center w-full bg-gray-900 p-5 rounded-lg border-4 border-white mb-4">
      <img 
        src={`http://api:5000/uploads/${user.profilePicture}`} 
        alt={`${user.firstName} ${user.lastName}`} 
        className="w-24 h-24 rounded-full mb-4"
      />
      <h2 className="text-xl font-semibold text-white">{user.firstName} {user.lastName}</h2>
      <p className="text-white">Username: {user.username}</p>
      <p className="text-white">E-Mail: {user.email}</p>
      <div className="flex gap-2 mt-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;
