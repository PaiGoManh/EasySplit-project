import React, { useEffect, useState } from 'react';
import UserCard from '../../../components/usercard';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch('http://api:5000/auth/users', {
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error('Failed to fetch friends');
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Fetched data is not an array');
        }
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://api:5000/auth/deleteUser/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        console.log("User deleted successfully");
        setFriends(friends.filter(friend => friend._id !== id));
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 text-black">
      <div className='flex justify-between items-center mb-[5%]'>
        <h1 className="text-2xl text-black font-bold">User List</h1>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {friends.map((friend) => (
          <UserCard key={friend._id} user={friend} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
