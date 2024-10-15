import React, { useEffect, useMemo, useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import tulip from "../Assets/tulip.png";
import { Link } from "react-router-dom";
import Slider from "react-slider";
import axios from "axios";

const MResorts = () => {
  const [resorts, setResorts] = useState([]);

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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100000);

  const handleMinChange = (e) => {
    const value = Math.max(
      0,
      Math.min(max, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)
    );
    setMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(
      min,
      Math.min(100000, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)
    );
    setMax(value);
  };

  const resetValues = () => {
    setMin(0);
    setMax(100000);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const filteredItems = useMemo(() => {
    return resorts.filter((resort) => {
      const isInRange = resort.priceMin >= min && resort.priceMax <= max;
      const matchesSearchTerm = resort.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesAmenities = selectedFilters.every((filter) =>
        resort.evfilter.includes(filter)
      );
      return isInRange && matchesSearchTerm && matchesAmenities;
    });
  }, [resorts, min, max, searchTerm, selectedFilters]);
  const filters = [
    { label: "Wedding" },
    { label: "Gathering" },
    { label: "Birthday" },
    { label: "Special Event" },
  ];

  return (
    <div className="flex flex-col justify-center items-center font-f1 w-full h-full">
      <div className="w-full h-full z-0 flex justify-center">
        <img
          src={tulip}
          alt=""
          className="absolute w-full object-top object-cover h-96 brightness-75"
        />
      </div>
      {/* RESORT SEARCH BAR */}
      <div className="h-full z-0 max-laptop:container mx-auto w-3/4 flex flex-col items-center justify-center mt-24">
        <h1 className="text-4xl text-white font-serif font-semibold uppercase">
          RESORTS
        </h1>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search Resort"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full mt-8 border-2 p-2 rounded-lg"
        />
      </div>
      <div className="w-3/4 max-2xl:w-4/5 max-xl:w-11/12 mt-44 flex flex-row max-laptop:flex-col justify-center">
        <div className="w-1/4 max-laptop:hidden">
          {/* PRICE RANGE */}
          <div className="mt-8 p-4">
            <h1 className="text-gray-500 font-semibold">Your Budget</h1>
            <Slider
              className="w-full mt-4 h-1 bg-blue-500 flex justify-center items-center rounded-lg"
              thumbClassName="w-5 bg-white h-5 border border-blue-500 rounded-full cursor-grab"
              trackClassName="bg-blue-400"
              defaultValue={[min, max]}
              min={0}
              max={100000}
              onChange={(values) => {
                setMin(values[0]);
                setMax(values[1]);
              }}
              value={[min, max]}
              ariaLabel={["Min price", "Max price"]}
            />
            <div className="flex justify-between w-full mt-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold">MIN</span>
                <input
                  type="text"
                  aria-label="Minimum price"
                  className="w-24 max-lg:w-16 text-center border border-black rounded"
                  value={min}
                  onChange={handleMinChange}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">MAX</span>
                <input
                  type="text"
                  aria-label="Maximum price"
                  className="w-24 max-lg:w-16 text-center border border-black rounded"
                  value={max}
                  onChange={handleMaxChange}
                />
              </div>
            </div>
          </div>
          {/* Filter */}
          <div className="flex flex-col p-4 border-t">
            <h2 className="text-gray-500 my-4 font-semibold">
              Event Filters
            </h2>
            <ul className="space-y-2">
              {filters.map((filter, index) => (
                <li key={index}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={selectedFilters.includes(filter.label)}
                      onChange={() => toggleFilter(filter.label)}
                    />
                    <span className="ml-2 text-gray-700">{filter.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* FILTER MOBILE */}
        <div className="bg-gray-100 p-2 laptop:hidden flex flex-row mt-2">
          <div className="text-sm bg-white flex flex-row items-center space-x-2 border-2 rounded-full py-1 px-3">
            <FaSlidersH />
            <h1>Filter</h1>
          </div>
        </div>
        {/* RESORTS LIST */}
        <div className="w-full mt-4 max-laptop:mt-2">
          <ul className="grid grid-flow-row grid-cols-4 max-lg:grid-cols-2 gap-x-4 gap-y-6 bg-gray-100 rounded-lg mt-2 p-4">
            {filteredItems.map((resort, index) => (
              <Link to={`/resorts/${resort._id}`} key={index}>
                <li className="flex flex-col rounded-lg cursor-pointer">
                  <div className="carousel w-full">
                    <img
                      className="size-64 object-cover rounded-lg"
                      src={`http://localhost:8080${resort.images[0]?.path}`}
                      alt={resort.name}
                      onError={(e) =>
                        (e.target.src = "/path/to/fallback/image.jpg")
                      }
                    />
                  </div>

                  <h1 className="font-semibold mt-2 font-serif">
                    {resort.name}
                  </h1>
                  <h2 className="text-sm mt text-gray-500">
                    Max pax - {resort.pax}
                  </h2>
                  <h2 className="text-sm mt text-gray-500">
                    ₱{resort.priceMin} - ₱{resort.priceMax}
                  </h2>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MResorts;
