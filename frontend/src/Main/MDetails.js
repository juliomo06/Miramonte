import React, { useEffect, useState } from "react";
import {
  FaSwimmingPool,
  FaWifi,
  FaShare,
  FaRegHeart,
  FaAngleDown,
} from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { TbToolsKitchen } from "react-icons/tb";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import Datepicker from "react-tailwindcss-datepicker";

const MDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resort, setResort] = useState(null);
  const [swimmingCost, setSwimmingCost] = useState(0);
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  });
  const [reservedDates, setReservedDates] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [collapsedMeals, setCollapsedMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [totalCost, setTotalCost] = useState(0);
  const [swimmingType, setSwimmingType] = useState("day");
  const [serviceCosts, setServiceCosts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resortResponse, reservedDatesResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/resorts/${id}`),
          axios.get(`http://localhost:8080/api/bookings/${id}/booked-dates`),
        ]);
        setResort(resortResponse.data);
        setReservedDates(reservedDatesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    } else {
      console.error("ID is undefined");
    }
  }, [id]);

  useEffect(() => {
    const costs = selectedServices.includes("catering") ? 2000 : 0;
    setServiceCosts(costs);
  }, [selectedServices]);

  useEffect(() => {
    if (resort) {
      const days =
        dayjs(dates.endDate).diff(dayjs(dates.startDate), "day") || 1;
      const roomRate = resort.priceMin;
      const total = roomRate * days + serviceCosts + swimmingCost;
      setTotalCost(total);
    }
  }, [dates, selectedServices, resort, serviceCosts, swimmingCost]);

  const handleBooking = () => {
    navigate(`/payment/${resort._id}`, {
      state: {
        resortId: resort.id,
        resortName: resort.name,
        checkInDate: dates.startDate,
        checkOutDate: dates.endDate,
        totalCost,
        swimmingType,
        priceMin: resort.priceMin,
        selectedServices,
        serviceCosts,
      },
    });
  };

  const handleDateChange = (newValue) => {
    if (newValue?.startDate) {
      let newStartDate = dayjs(newValue.startDate);
      let newEndDate = dayjs(newValue.endDate || newStartDate);

      if (swimmingType === "day") {
        newStartDate = newStartDate
          .set("hour", 7)
          .set("minute", 0)
          .set("second", 0);
        newEndDate = newStartDate
          .set("hour", 17)
          .set("minute", 0)
          .set("second", 0);
      } else if (swimmingType === "night") {
        newStartDate = newStartDate
          .set("hour", 19)
          .set("minute", 0)
          .set("second", 0);
        newEndDate = newStartDate
          .add(1, "day")
          .set("hour", 5)
          .set("minute", 0)
          .set("second", 0);
      } else if (swimmingType === "whole-day") {
        newStartDate = newStartDate
          .set("hour", 7)
          .set("minute", 0)
          .set("second", 0);
        newEndDate = newStartDate
          .add(1, "day")
          .set("hour", 5)
          .set("minute", 0)
          .set("second", 0);
      }
      setDates({
        startDate: newStartDate.toDate(),
        endDate: newEndDate.toDate(),
      });
    }
  };

  const handleSwimmingTypeChange = (type) => {
    setSwimmingType(type);
    const costs = {
      day: 0,
      night: 500,
      "whole-day": 3000,
    };
    setSwimmingCost(costs[type] || 0);

    const today = dayjs();
    let newStartDate;
    let newEndDate;

    if (type === "day") {
      newStartDate = today.set("hour", 7).set("minute", 0).set("second", 0);
      newEndDate = today.set("hour", 17).set("minute", 0).set("second", 0);
    } else if (type === "night") {
      newStartDate = today.set("hour", 19).set("minute", 0).set("second", 0);
      newEndDate = today
        .add(1, "day")
        .set("hour", 5)
        .set("minute", 0)
        .set("second", 0);
    } else if (type === "whole-day") {
      newStartDate = today.set("hour", 7).set("minute", 0).set("second", 0);
      newEndDate = today
        .add(1, "day")
        .set("hour", 5)
        .set("minute", 0)
        .set("second", 0);
    }
    setDates({
      startDate: newStartDate.toDate(),
      endDate: newEndDate.toDate(),
    });
  };

  const isDateDisabled = (date) => {
    return reservedDates.some((range) => {
      const checkIn = new Date(range.checkInDate);
      const checkOut = new Date(range.checkOutDate);
      return date >= checkIn && date <= checkOut;
    });
  };
  const toggleMealCollapse = (meal) => {
    setCollapsedMeals((prev) => ({ ...prev, [meal]: !prev[meal] }));
  };

  const handleServiceChange = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  if (!resort) {
    return (
      <div className="flex justify-center items-center">
        <div className="spinner"></div>
        <p>Loading resort details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full justify-center items-center font-sans mb-10">
      <div className="w-full max-w-6xl mx-auto mt-6 rounded-xl">
        {/* Img showcasing */}
        <div className="w-full flex flex-col md:flex-row h-auto md:h-[450px] shadow-lg rounded-3xl mt-4 overflow-hidden">
          <div className="w-full md:w-1/2">
            <img
              className="w-full h-full pr-2 object-cover"
              src={`http://localhost:8080${resort.images[0]?.path}`}
              alt={resort.name}
              onError={(e) => (e.target.src = "/path/to/fallback/image.jpg")}
            />
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 grid-rows-2 gap-1">
            {resort.images.slice(1, 5).map((image, index) => (
              <img
                key={index}
                className="w-full h-full  object-cover"
                src={`http://localhost:8080${image?.path}`}
                alt={resort.name}
                onError={(e) => (e.target.src = "/path/to/fallback/image.jpg")}
              />
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row mt-10">
          <div className="mr-0 md:mr-10 w-full md:w-1/2">
            <div className="flex flex-row justify-between">
              <h2 className="font-semibold text-3xl font-sans">
                {resort.name}
              </h2>
              <div className="flex flex-row">
                <div className="flex flex-row items-center space-x-1 hover:bg-gray-100 rounded-lg px-2">
                  <FaShare />
                  <h4 className="text-sm underline">Share</h4>
                </div>
                <div className="flex flex-row items-center space-x-1 hover:bg-gray-100 rounded-lg px-2">
                  <FaRegHeart />
                  <h4 className="text-sm underline">Save</h4>
                </div>
              </div>
            </div>
            <h3 className="mt-6 font-sans font-extralight">{resort.details}</h3>
            <div className="border-y p-2 border-black mt-8 text-4xl">
              <ul className="ml-2 flex flex-col md:flex-row font-thin space-y-4 md:space-y-0 md:space-x-8">
                <li className="flex flex-col items-center">
                  <FaSwimmingPool />
                  <h4 className="text-base font-sans">Resorts Facilities</h4>
                </li>
                <li className="flex flex-col items-center">
                  <FaWifi />
                  <h4 className="text-base font-sans">Free Wifi</h4>
                </li>
                <li className="flex flex-col items-center">
                  <IoBed />
                  <h4 className="text-base font-sans">4 Rooms</h4>
                </li>
                <li className="flex flex-col items-center">
                  <TbToolsKitchen />
                  <h4 className="text-base font-sans">Kitchen</h4>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full max-w-xl border rounded-lg shadow-lg p-6 bg-white mt-6 md:mt-0">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-semibold text-gray-800">
                ₱{resort.priceMin} - ₱{resort.priceMax}
              </h1>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-700">
                Select Swimming Type
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {["day", "night", "whole-day"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100 transition"
                  >
                    <input
                      type="radio"
                      value={type}
                      checked={swimmingType === type}
                      onChange={() => handleSwimmingTypeChange(type)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">
                      {type === "day"
                        ? "Day Swimming (7 AM - 5 PM)"
                        : type === "night"
                        ? "Night Swimming (7 PM - 5 AM) + ₱500"
                        : "Whole Day (7 AM - 5 AM) + ₱3000"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-700">Choose Date</h2>
              <div className="mt-2">
                <Datepicker
                  useRange={false}
                  value={dates}
                  onChange={handleDateChange}
                  inputClassName="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-lg text-gray-600 focus:outline-none focus:border-blue-500 transition"
                  minDate={new Date()}
                  closeOnScroll={(e) => e.target === document}
                  disabledDates={reservedDates.map((range) => ({
                    startDate: new Date(range.checkInDate),
                    endDate: new Date(range.checkOutDate),
                  }))}
                  isDateDisabled={isDateDisabled}
                />
              </div>
            </div>
            <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-700">Select Service</h2>
      <div className="mt-3">
        <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100 transition">
          <input
            type="checkbox"
            onChange={() => handleServiceChange('catering')}
            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Catering + ₱2000</span>
        </label>
      </div>

      {selectedServices.includes('catering') && (
        <div className="mt-4 pl-4">
          <h3 className="text-md font-medium text-gray-600">Meals</h3>
          <div>
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
              <div key={meal} className="mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={() => toggleMealCollapse(meal)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 capitalize">{meal}</span>
                </label>
                {collapsedMeals[meal] && (
                  <div className="mt-2 pl-4">
                    <h4 className="text-sm font-medium text-gray-600">Menu:</h4>
                    <ul className="list-disc pl-5">
                      <li>Pancakes</li>
                      <li>Fruit Salad</li>
                      <li>Omelettes</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
            <div className="mt-6 text-center">
              <h1 className="text-3xl font-semibold text-gray-800">
                Total: ₱{totalCost}
              </h1>
            </div>
            <button
              className="mt-6 w-full bg-blue-600 text-white text-lg font-medium py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              onClick={handleBooking}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MDetails;
