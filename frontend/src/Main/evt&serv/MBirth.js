import React, { useEffect, useState } from "react";
import out from "../../Assets/outing.JPG";
import Wave from "../../Assets/wave.png";
import wed2 from "../../Assets/wed2.jpeg";
import axios from "axios";

const MWed = () => {
  const [weddingResorts, setWeddingResorts] = useState([]);

  useEffect(() => {
    const fetchWeddingResorts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/bookings/resorts?evfilter=Birthday"
        );
        setWeddingResorts(response.data.resorts);  
      } catch (error) {
        console.error("Error fetching wedding resorts:", error);
      }
    };

    fetchWeddingResorts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-full -z-10">
      <div className="flex flex-col items-center">
        <img
          className="absolute top-0 left-0 w-full h-[550px] object-buttom object-cover brightness-50 z-[-1]"
          src={out}
          alt="background"
        />
        <div className="items-center flex flex-col justify-center mt-40">
          <h1 className=" text-6xl text-white font-f3 font-bold tracking-wider">
            Birthday
          </h1>
          <div className="w-4/5 bg-white mt-24 px-48 py-8">
            <h1 className="text-3xl font-f3 text-center text-blue-400">
              We make every birthday unique and memorable in its own way.
            </h1>
            <h2 className="text-md text-center mt-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              luctus pharetra dolor, in rutrum ipsum aliquam non. Phasellus
              mauris justo, malesuada ac hendrerit id, tempus a nisl.
            </h2>
          </div>
          <div className="px-48 flex flex-col justify-center items-center py-8 mt-12">
            <img className="w-4/5" src={wed2} alt="wed2" />
            <h2 className="text-md mt-6 text-left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus pharetra dolor, in rutrum ipsum aliquam non. Phasellus mauris justo, malesuada ac hendrerit id tempus a nisl. In consequat nibh vel dui scelerisque consectetur.
            </h2>
          </div>
        </div>
      </div>

      <div className=" flex flex-col justify-center w-full px-4 py-12">
        <section className="flex flex-col items-center ">
          <img className="w-16" src={Wave} alt="wave" />
          <h2 className="text-2xl md:text-3xl font-semibold mt-4">
            Top Wedding Resorts
          </h2>
          <p className="text-gray-500 my-4">Top Booked for Weddings</p>
        </section>
        
        <div className="flex flex-row justify-center w-full gap-8">
          {weddingResorts.slice(0, 3).map((resort, index) => ( 
            <div key={index}>
              {resort.images?.[0]?.path ? (
                <img
                  className="rounded-lg shadow-lg w-64 h-64 object-cover"
                  src={`http://localhost:8080${resort.images[0].path}`}
                  alt={`resort-${index}`}
                />
              ) : (
                <p>No image available</p> 
              )}
              <h3 className="text-center ">{resort.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MWed;
