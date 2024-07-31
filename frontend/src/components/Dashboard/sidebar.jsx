import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { MdGroups } from "react-icons/md";
import { FaUserFriends, FaPowerOff } from "react-icons/fa";
import { GrUserSettings } from "react-icons/gr";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Sidebar = () => {
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);

  const toggleGroups = () => setIsGroupsOpen(!isGroupsOpen);

  return (
    <div className="fixed w-60 h-screen  pt-5  bg-gray-900 text-white mt-3">
      <ul>
        <li className="flex items-center hover:bg-[gray] hover:pl-[-5%]">
          <Link to="/dashboard/" className="flex items-center gap-3 pl-4 pb-2 pt-2">
            <CgProfile className="text-l hover:text-gray-300" />
            <h1 className='text-md'>My Dashboard</h1>
          </Link>
        </li>

        <li className="flex flex-col  ">
          <div className="flex items-center hover:text-gray-300 pl-4 pb-2 pt-2 hover:bg-[gray]">
            <FaUserFriends className="text-l hover:text-gray-300" />
            <Link to="/dashboard/users" className=" flex gap-4 pl-4 pb-2 pt-2 items-center hover:text-gray-300">
                  Users
            </Link>
          </div>
          
        </li>
        <li className=" flex flex-col">
          <div className="flex items-center hover:text-gray-300 pl-4 pb-2 pt-2 hover:bg-[gray]" onClick={toggleGroups}>
            <MdGroups className="mr-5 text-xl hover:text-gray-300" />
            <h1 className='text-md'>Groups</h1>
            {isGroupsOpen ? <IoIosArrowUp className="ml-auto mr-4" /> : <IoIosArrowDown className="ml-auto mr-4" />}
          </div>
          {isGroupsOpen && (
            <ul className="">
              <li className=" hover:bg-gray-700">
                <Link to="/dashboard/addgroup" className="pl-12 pt-2 hover:text-gray-300 text-md">
                  Add Group
                </Link>
              </li>
              <li className=" hover:bg-gray-700">
                <Link to="/dashboard/groups" className="pl-12 pt-2 hover:text-gray-300 text-md">
                  Groups List
                </Link>
              </li>
            </ul>
          )}
        </li>

        <hr className='mb-[4%] mt-[4%]'/>
        <li className=" flex items-center hover:text-gray-300 pl-4 pb-2 pt-2 hover:bg-[gray]">
          <Link to="/dashboard/settings" className="flex items-center hover:text-gray-300">
            <GrUserSettings className="mr-5 hover:text-gray-300 text-md" />
            <h1 className='text-md'>Settings</h1>
          </Link>
        </li>
        <li className="flex items-center hover:text-gray-300 pl-4 pb-2 pt-2 hover:bg-[gray]">
          <Link to="/" className="flex items-center hover:text-gray-300">
            <FaPowerOff className="mr-5 hover:text-gray-300 text-md" />
            <h1 className='text-md'>Logout</h1>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
