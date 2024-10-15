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
      <div className="avatar placeholder flex justify-center m-4">
        <div className="bg-gray-600 text-neutral-content w-14 rounded-full">
          <span className="text-xl uppercase">{user.name.charAt(0)}</span>
        </div>
      </div>
      <div className="flex justify-center text-sm lg:text-base indent-1 text-white">
        Welcome, Admin
      </div>
      <ul className="flex flex-col space-y-2 lg:space-y-4 p-2 lg:p-4">
        <SidebarItem
          to="/admin"
          icon={<MdSpaceDashboard size="24" />}
          label="Dashboard"
          isActive={location.pathname === "/admin"}
        />
        <SidebarItem
          to="/resortmngt"
          icon={<MdSpaceDashboard size="24" />}
          label="Resort Management"
          isActive={location.pathname === "/resortmngt"}
        />
        <SidebarItem
          to="/recent-bookings"
          icon={<MdSettings size="24" />}
          label="Recent Bookings"
          isActive={location.pathname === "/recent-bookings"}
        />
        <SidebarItem
          to="/accmngt"
          icon={<PiUserCircleGearDuotone size="24" />}
          label="Resort Accounts"
          isActive={location.pathname === "/accmngt"}
        />
        <SidebarItem
          to="/fee"
          icon={<PiUserCircleGearDuotone size="24" />}
          label="Finance Payment"
          isActive={location.pathname === "/fee"}
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
        isActive ? "text-white" : "hover:text-white"
      }`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </li>
  </Link>
);

export default ASidebar;
