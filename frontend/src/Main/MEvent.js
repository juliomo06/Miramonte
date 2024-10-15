import React from "react";
import out from "../Assets/outing.JPG";
import gat from '../Assets/gathering.png';
import wed from '../Assets/wed.jpg';
import se from '../Assets/se.JPG';
import { Link } from "react-router-dom";


const MEvent = () => {
  return (
    <div className="relative w-full h-screen">
      <ul className="flex flex-wrap flex-row max-md:flex-col">
        <li className="w-1/4 group max-md:w-full z-10 overflow-hidden relative h-screen max-md:h-2/3">
          <Link to='/event/wedding'>
            <div className="h-full transition-all duration-300 group-hover:scale-110">
              <img
                className="group-hover:grayscale brightness-75 object-cover w-full h-full"
                src={wed}
                alt="WEDDING"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 p-4">
                <h1 className="font-f3 text-3xl text-white">Wedding</h1>
                <h4 className="text-white font-f2">
                  We make every wedding unique and memorable in its own way.
                </h4>
                <button className="text-white uppercase border group-hover:border-hidden px-6 py-4 group-hover:bg-[#008DDA] group-hover:text-[#F7EEDD]">
                  View More
                </button>
              </div>
            </div>
          </Link>
        </li>
        
        <li className="w-1/4 group max-md:w-full z-10 overflow-hidden relative h-screen max-md:h-2/3">
        <Link to='/event/gathering'>
          <div className="h-full transition-all duration-300 group-hover:scale-110">
            <img
              className="group-hover:grayscale brightness-75 object-cover w-full h-full"
              src={gat}
              alt="gathering"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-4">
              <h1 className="font-f3 text-3xl text-white">Gathering</h1>
              <h4 className="text-white font-f2">
                We make every gathering unique and memorable in its own way.
              </h4>
              <button className="text-white uppercase border group-hover:border-hidden px-6 py-4 group-hover:bg-[#008DDA] group-hover:text-[#F7EEDD]">
                View More
              </button>
            </div>
          </div>
          </Link>
        </li>

        <li className="w-1/4 group max-md:w-full z-10 overflow-hidden relative h-screen max-md:h-2/3">
        <Link to='/event/birthday'>
          <div className="h-full transition-all duration-300 group-hover:scale-110">
            <img
              className="group-hover:grayscale brightness-75 object-cover w-full h-full"
              src={out}
              alt="OUTING"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-4">
              <h1 className="font-f3 text-3xl text-white">Birthday</h1>
              <h4 className="text-white font-f2">
                We make every birthday unique and memorable in its own way.
              </h4>
              <button className="text-white uppercase border group-hover:border-hidden px-6 py-4 group-hover:bg-[#008DDA] group-hover:text-[#F7EEDD]">
                View More
              </button>
            </div>
          </div>
          </Link>
        </li>

        <li className="w-1/4 group max-md:w-full z-10 overflow-hidden relative h-screen max-md:h-2/3">
        <Link to='/event/se'>
          <div className="h-full transition-all duration-300 group-hover:scale-110">
            <img
              className="group-hover:grayscale brightness-75 object-cover w-full h-full"
              src={se}
              alt="SPECIAL EVENT"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-4">
              <h1 className="font-f3 text-3xl text-white">Special Event</h1>
              <h4 className="text-white font-f2">
                We make every special event unique and memorable in its own way.
              </h4>
              <button className="text-white uppercase border group-hover:border-hidden px-6 py-4 group-hover:bg-[#008DDA] group-hover:text-[#F7EEDD]">
                View More
              </button>
            </div>
          </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MEvent;
