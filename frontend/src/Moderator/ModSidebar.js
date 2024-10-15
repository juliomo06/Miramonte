import React from "react";
import { MdSpaceDashboard, MdSettings, MdAccountCircle } from "react-icons/md";
import { PiUserCircleGearDuotone } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { getUserInfo, logout } from "../utils/auth";
import { BiLogOut } from "react-icons/bi";

const ASidebar = () => {
  const location = useLocation();
  const user = getUserInfo();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-[#00A9FF] w-full  h-full flex flex-col lg:rounded-r-3xl">
      <div className="flex justify-center mt-10 text-5xl lg:text-7xl text-gray-800">
        <PiUserCircleGearDuotone />
      </div>
      <div className="flex justify-center mt-2 text-sm lg:text-base indent-1 text-white">
        Welcome, <span className="capitalize ml-1">{user.name}</span>
      </div>
      <ul className="flex flex-col space-y-2 lg:space-y-4 p-2 lg:p-4">
        <SidebarItem
          to="/moderator"
          icon={<MdSpaceDashboard size="24" />}
          label="Dashboard"
          isActive={location.pathname === "/moderator"}
        />
        <SidebarItem
          to="/rmngt"
          icon={<MdSpaceDashboard size="24" />}
          label="Resort Management"
          isActive={location.pathname === "/rmngt"}
        />
        <SidebarItem
          to="/mrecent-bookings"
          icon={<MdSettings size="24" />}
          label="Resort Recent Bookings"
          isActive={location.pathname === "/mrecent-bookings"}
        />
        <li
          className="flex items-center text-sm p-3 space-x-2 rounded-md cursor-pointer hover:text-white"
          onClick={handleLogout}
        >
          <BiLogOut size="24" />
          <span className="hidden lg:inline">Logout</span>
        </li>
      </ul>
    </div>
  );
};

const SidebarItem = ({ to, icon, label, isActive }) => (
  <Link to={to}>
    <li
      className={`flex items-center text-xs lg:text-sm p-2 lg:p-3 space-x-2 rounded-md ${
        isActive ? 'text-white' : 'hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </li>
  </Link>
);

export default ASidebar;
