import React from "react";
import AHeader from "./AHeader";
import ASidebar from "./ASidebar";
import { Outlet } from "react-router-dom";

const AdminRoot = () => {
  return (
    <div className=" flex flex-row">
      <div className=" min-h-screen w-1/5">
        <ASidebar />
      </div>
      <div className="flex flex-col w-4/5">
       
        <Outlet/>   
      </div>
    </div>
  );
};

export default AdminRoot;
