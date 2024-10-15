import React from 'react';
import { MdNotifications } from "react-icons/md";
import { logout } from '../utils/auth'; 


const AHeader = () => {
 
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 drop-shadow-md p-4 w-full">
      <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">Welcome, Admin!</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={logout}
          className="text-red-500 hover:bg-red-100 rounded-lg px-3 py-1 text-sm font-medium transition-colors duration-200 md:px-4 md:py-2 md:text-base"
        >
          Logout
        </button>
        <div className="text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200 hidden md:block">
          Settings
        </div>
        <div className="text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
          <MdNotifications />
        </div>
      </div>
    </div>
  );
};

export default AHeader;
