import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const fetchGroups = async () => {
            try {
                const response = await fetch('http://api:5000/group/getgroups', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.json();
                setGroups(data.groups);
            } catch (error) {
                console.error('Error fetching groups:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://api:5000/group/deletegroup/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete group: ${response.statusText}`);
            }

            setGroups(groups.filter(group => group._id !== id));
        } catch (error) {
            console.error('Error deleting group:', error.message);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 text-black">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-black font-bold">Group List</h1>
                <Link to="/dashboard/addGroup">
                    <button className="text-xl font-bold w-40 h-10 bg-gray-900 text-white p-2 hover:ring-sky-100">
                        Add New Group
                    </button>
                </Link>
            </div>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div className="overflow-auto max-h-[60vh]">
                    <table className="w-full bg-white border rounded-lg shadow-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-2 text-left">Group Name</th>
                                <th className="py-2 px-4 border-2 text-left">Description</th>
                                <th className="py-2 px-4 border-2 text-left">Members</th>
                                <th className="py-2 px-4 border-2 text-left">Currency</th>
                                <th className="py-2 px-4 border-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group) => (
                                <tr key={group._id}>
                                    <td className="py-2 px-4 border-2">
                                        <Link to={`/dashboard/groupprofile/${group._id}`}>
                                            {group.name}
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 border-2">{group.description}</td>
                                    <td className="py-2 px-4 border-2">
                                        {Array.isArray(group.members) && group.members.length > 0
                                            ? group.members.map((member, index) => (
                                                <span key={index}>
                                                    {member.username || 'Unknown'}{index < group.members.length - 1 && ', '}
                                                </span>
                                            ))
                                            : 'No members'}
                                    </td>
                                    <td className="py-2 px-4 border-2">{group.currency}</td>
                                    <td className="py-2 px-4 border-2">
                                        <Link to={`/dashboard/updateGroup/getgroup/${group._id}`}>
                                            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Update</button>
                                        </Link>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            onClick={() => handleDelete(group._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GroupList;
