import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import r5 from "../Assets/r5.jpg";
import Wave from "../Assets/wave.png";
import out from "../Assets/outing.JPG";
import axios from "axios";
import { Link } from "react-router-dom";

const MContent = () => {
  const [topResorts, setTopResorts] = useState([]);

  useEffect(() => {
    const fetchTopResorts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/bookings/top-resorts"
        );
        setTopResorts(response.data);
      } catch (error) {
        console.error("Error fetching top-performing resorts:", error);
      }
    };

    fetchTopResorts();
  }, []);

  const [resorts, setResorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/resorts");
        setResorts(response.data.resorts);
      } catch (error) {
        console.error("Error fetching resorts:", error);
      }
    };

    fetchResorts();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % resorts.length);
    }, 5000); 
  
    return () => clearInterval(intervalId);
  }, [resorts]);
  
  return (
    <div className="flex flex-col items-center">

  <div className="relative w-full h-screen overflow-hidden">
  {resorts.length > 0 && (
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {resorts.map((resort, index) => (
              <div className="min-w-full h-screen" key={index}>
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={`http://localhost:8080${resort.images[0]?.path}`}
                  alt={resort.name}
                  onError={(e) =>
                    (e.target.src = "/path/to/fallback/image.jpg")
                  }
                />
              </div>
            ))}
          </div>
      )}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-35">
      <h1 className="font-serif font-bold text-4xl lg:text-6xl">
        PROMOTING SUSTAINABLE RESORT
      </h1>
      <div className="h-1 w-24 lg:w-96 bg-white my-6"></div>
      <button className="rounded-md bg-gradient-to-r hover:bg-gradient-to-l from-blue-500 to-teal-500 px-6 py-4 text-xl font-bold text-white shadow-lg hover:shadow-xl transition">
        BOOK NOW
      </button>
    </div>
  </div>

  <div className="w-full md:w-9/12">
  <section className="flex flex-col items-center mt-10">
    <img className="w-16" src={Wave} alt="wave" />
    <h2 className="text-2xl md:text-3xl font-semibold mt-4">
      Top Resorts in Miramonte
    </h2>
    <p className="text-gray-500 mt-2">Top Booked</p>
  </section>
  
  {topResorts.length > 0 ? (
    <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {topResorts.map((resort, index) => (
        <li
          key={resort._id?._id || index}
          className="flex flex-col items-center transition-transform transform hover:scale-105"
        >
           <Link to={`/resorts/${resort._id?._id}`} key={index} className="w-full">
            <img
              className="rounded-lg shadow-lg w-full h-72"
              src={`http://localhost:8080${resort._id?.images[0]?.path}`}
              alt={resort._id?.name || "Unknown Resort"}
              onError={(e) =>
                (e.target.src = "/path/to/fallback/image.jpg")
              }
            />
            <div className="text-center mt-4">
              <p className="font-semibold text-lg">
                {resort._id?.name || "Unknown Resort"}
              </p>
              <p className="text-gray-500">Accommodations: {resort.count}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center mt-8">No data available</p>
  )}
</div>
  <section className="mt-16 w-full md:w-3/4 flex flex-col items-center">
    <img className="w-16" src={Wave} alt="wave" />
    <h2 className="text-2xl md:text-3xl font-semibold mt-4">
      Miramonte Village Service
    </h2>
    <p className="text-gray-500 mt-2">What We Offer</p>

    <div className="flex flex-col md:flex-row mt-8 space-y-4 md:space-y-0 md:space-x-4 text-lg">
      <button className="py-2 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition w-full md:w-auto">
        Family Outings
      </button>
      <button className="py-2 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition w-full md:w-auto">
        Weddings
      </button>
      <button className="py-2 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition w-full md:w-auto">
        Special Events
      </button>
    </div>

    <div className="flex mt-10">
      <img
        className="rounded-lg shadow-lg w-full max-w-md"
        src={out}
        alt="Family outing"
      />
    </div>
  </section>

  
</div>

  );
};

export default MContent;
