import React from "react";
import { Outlet } from "react-router-dom";
import ModSidebar from "./ModSidebar";

const ModRoot = () => {
  return (
    <div className=" flex flex-row">
      <div className=" min-h-screen w-1/5">
        <ModSidebar />
      </div>
      <div className="flex flex-col w-4/5">
       
        <Outlet/>   
      </div>
    </div>
  );
};

export default ModRoot;
