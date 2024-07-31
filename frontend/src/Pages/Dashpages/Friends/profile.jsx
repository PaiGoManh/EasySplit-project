import React from 'react';
import { useLocation } from 'react-router-dom';

const DashboardHome = () => {
  const location = useLocation();
  const { friend } = location.state || {}; 

  return (
    <div className="p-4">
      <div className="gap-[5%] flex mb-4">
        <div className="w-[250] h-[100px] border-white border bg-gray-900 text-center pt-4 mb-4">
          <h1 className="text-xl font-bold text-white">Total Expenses</h1>
          <h1 className="text-green-500 text-2xl mt-5">$100</h1>
        </div>

        <div className="w-[150] h-[100px] border-white border bg-gray-900 text-center pt-4 mb-4 ">
          <h1 className="text-xl font-bold text-white">You Owe</h1>
          <h1 className="text-green-500 text-2xl mt-5">$100</h1>
        </div>

        <div className="w-[150] h-[100px] bg-gray-900 border-white border text-center pt-4 mb-4 ">
          <h1 className="text-xl font-bold text-white">You are Owed</h1>
          <h1 className="text-green-500 text-2xl mt-5">$100</h1>
        </div>



        
      </div>

      <div className="flex justify-between mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
          Add an expense
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
          Settle up
        </button>
      </div>


      <div className="bg-green-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-black">Settle Up</h2>
        <p className="text-gray-800">You and <span className="font-medium text-blue-600">{friend ? friend.name : ''}</span> are all settled up.</p>
        <button className="bg-green-500 text-white px-4 py-2 mt-2 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
          Show settled expenses
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
