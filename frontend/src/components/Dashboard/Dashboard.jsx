import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Home from '../../Pages/Dashpages/User/home';
import Groups from '../../Pages/Dashpages/Group/groups';
import Friends from '../../Pages/Dashpages/Friends/friends';
import Settings from '../../Pages/Dashpages/User/settings';
import FriendProfile from '../../Pages/Dashpages/Friends/profile';
import Groupprofile from '../../Pages/Dashpages/Group/profile';
import AddGroup from '../../Pages/Dashpages/Group/addGroup'; 
import UpdateGroup from '../../Pages/Dashpages/Group/updateGroup';
import { NotificationProvider } from '../../context/notification';

const Dashboard = () => {
  return (
    <div className='bg-black text-white'>
      <NotificationProvider>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="ml-[20%] mr-[2%] mt-3 p-4 w-screen h-[572px] overflow-y-auto bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/users" element={<Friends />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/friendprofile/:id" element={<FriendProfile />} />
            <Route path="/groupprofile/:id" element={<Groupprofile />} />
            <Route path="/updateGroup/getgroup/:groupId" element={<UpdateGroup />} /> 
            <Route path="/addGroup" element={<AddGroup />} /> 
          </Routes>
        </div>
      </div>
      </NotificationProvider>
    </div>
  );
};

export default Dashboard;
