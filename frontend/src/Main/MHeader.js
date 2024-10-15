import React, { useState, useEffect } from "react";
import logo from "../Assets/mv.png";
import Login from "../components/Login";
import { FaBars, FaRegUserCircle, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { getRole, isAuthenticated, logout, getUserInfo } from "../utils/auth";

const MHeader = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setRole(getRole());
  }, []);

  const NavbarMenu = [
    { name: "Home", path: "/" },
    { name: "Resorts", path: "/resorts" },
    { name: "Event & Services", path: "/event" },
    { name: "Contact us", path: "/contact" },
  ];

  
  const user = getUserInfo();

  return (
    <div >
      {/* Desktop Responsive */}
      <div onMouseLeave={() => setIsOpen(false)} className="max-res1:hidden z-50 bg-white flex flex-row justify-between items-center px-10 py-2 w-full border-b shadow-md">
        <img className="w-56" src={logo} alt="Logo" />
        <ul className="flex flex-row space-x-12 px-4">
        <HeaderItem
          to="/"
          label="Home"
          isActive={location.pathname === "/"}
        />
        <HeaderItem
          to="/resorts"
          label="Resorts"
          isActive={location.pathname === "/resorts"}
        />
        <HeaderItem
          to="/event"
          label="Event & Services"
          isActive={location.pathname === "/event"}
        />
        <HeaderItem
          to="/contact"
          label="Contact us"
          isActive={location.pathname === "/contact"}
        />
        </ul>
        <div className="relative w-56 flex justify-end">
          <button
            className="text-3xl mr-4 hover:bg-blue-600 p-2 rounded-full"
            type="button"
            onMouseEnter={() => setIsOpen(true)}
          >
            {user && user.name ? (
              <div className="avatar placeholder flex justify-center">
                <div className="bg-blue-600 text-white w-12 rounded-full">
                  <span className="text-xl uppercase">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
            ) : (
              <FaRegUserCircle />
            )}
          </button>
          {isOpen && (
            <div
              id="dropdown"
              className="z-50 top-14 absolute bg-gray-50 divide-y divide-gray-100 rounded-lg drop-shadow-lg w-44"
            >
              {isLoggedIn ? (
                <div className="flex flex-col items-center py-2">
                  <span className="block px-4 py-2">
                    {role === "admin" && (
                      <Link to="/admin">Admin Dashboard</Link>
                    )}
                    {role === "moderator" && (
                      <Link to="/moderator">Moderator Panel</Link>
                    )}
                    {role === "user" && <Link to="/userinfo">{user.name}</Link>}
                  </span>
                  <Link to="/mrecent"><div className="hover:bg-red-500">Recent Books</div></Link>
                  <button
                    onClick={logout}
                    className="block w-full text-center py-2 hover:bg-red-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="block w-full text-center py-2 hover:bg-blue-500"
                >
                  Log in
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Responsive */}
      <div
        className="flex bg-white res1:hidden flex-row w-full justify-around items-center"
      >
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <label htmlFor="my-drawer" className="btn text-xl drawer-button">
          <FaBars />
        </label>
        <div className="drawer-side z-20">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="items-center flex flex-col bg-white  min-h-full w-80 p-4">
          <HeaderItem
          to="/"
          label="Home"
          isActive={location.pathname === "/"}
        />
        <HeaderItem
          to="/resorts"
          label="Resorts"
          isActive={location.pathname === "/resorts"}
        />
        <HeaderItem
          to="/event"
          label="Event & Services"
          isActive={location.pathname === "/event"}
        />
        <HeaderItem
          to="/contact"
          label="Contact us"
          isActive={location.pathname === "/contact"}
        />
          </ul>
        </div>
        <img className="w-56" src={logo} alt="Logo" />
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className=" m-1 text-3xl "
          >
            {user && user.name ? (
              <div className="avatar placeholder flex justify-center">
                <div className="bg-blue-600 text-white w-12 rounded-full">
                  <span className="text-xl uppercase">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
            ) : (
              <FaRegUserCircle />
            )}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 right-2 rounded-box z-[1] w-44 p-2  shadow"
          >
            {isLoggedIn ? (
              <div className="flex flex-col items-center py-2">
                <span className="block px-4 py-2">
                  {role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
                  {role === "moderator" && (
                    <Link to="/moderator">Moderator Panel</Link>
                  )}
                  {role === "user" && <Link to="/userinfo">{user.name}</Link>}
                </span>
                <div>Recent Books</div>
                <button
                  onClick={logout}
                  className="block w-full text-center py-2 hover:bg-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="block w-full text-center py-2 hover:bg-blue-500"
              >
                Log in
              </button>
            )}
          </ul>
        </div>
        {/* <button
          className="text-3xl mr-4 hover:bg-blue-500 p-3 rounded-full"
          type="button"
          onMouseEnter={() => setIsOpen(true)}
        >
          <FaRegUserCircle />
        </button>
        {isOpen && (
          <div
            id="dropdown"
            className="z-50 top-14 absolute bg-gray-50 divide-y divide-gray-100 rounded-lg drop-shadow-lg w-44"
          >
            {isLoggedIn ? (
              <div className="flex flex-col items-center py-2">
                <span className="block px-4 py-2">
                  {role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
                  {role === "moderator" && (
                    <Link to="/moderator">Moderator Panel</Link>
                  )}
                  {role === "user" && <Link to="/user">User Profile</Link>}
                </span>
                <button
                  onClick={logout}
                  className="block w-full text-center py-2 hover:bg-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="block w-full text-center py-2 hover:bg-blue-500"
              >
                Log in
              </button>
            )}
          </div>
        )} */}
      </div>
      {/* <div className="res1:hidden flex flex-row bg-white justify-between">
        
        <img className="w-56" src={logo} alt="Logo" />
        <div className="relative flex justify-end">
          <button
            className="text-3xl mr-4 hover:bg-blue-500 p-3 rounded-full"
            type="button"
            onMouseEnter={() => setIsOpen(true)}
          >
            <FaRegUserCircle />
          </button>
          {isOpen && (
            <div
              id="dropdown"
              className="z-50 top-14 absolute bg-gray-50 divide-y divide-gray-100 rounded-lg drop-shadow-lg w-44"
              onMouseLeave={() => setIsOpen(false)}
            >
              {isLoggedIn ? (
                <div className="flex flex-col items-center py-2">
                  <span className="block px-4 py-2">
                    {role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
                    {role === "moderator" && <Link to="/moderator">Moderator Panel</Link>}
                    {role === "user" && <Link to="/user">User Profile</Link>}
                  </span>
                  <button onClick={logout} className="block w-full text-center py-2 hover:bg-red-500">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="block w-full text-center py-2 hover:bg-blue-500"
                >
                  Log in
                </button>
              )}
            </div>
          )}
        </div>
      </div> */}

      {/* Modal */}
      {showModal &&
        createPortal(
          <Login isOpen={showModal} onClose={() => setShowModal(false)} />,
          document.body
        )}
        
    </div>
  );
};
const HeaderItem = ({ to, label, isActive }) => (
  <Link to={to}>
    <li
      className={`flex items-center  lg:text-lg p-2 md:p-3 lg:p-4 space-x-2 ${
        isActive
          ? "text-blue-500 hover:text-blue-500 border-b-2 border-blue-500"
          : "hover:text-blue-500"
      }`}
    >
      <span className="">{label}</span>
    </li>
  </Link>
);

export default MHeader;
