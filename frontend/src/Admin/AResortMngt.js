import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ResortUpload = () => {
  const [resorts, setResorts] = useState([]);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/resorts");
        if (response.data && Array.isArray(response.data.resorts)) {
          setResorts(response.data.resorts);
        } else {
          console.error("Unexpected data format:", response.data);
          setResorts([]);
        }
      } catch (error) {
        console.error("Error fetching resorts:", error);
      }
    };
    fetchResorts();
  }, []);

  const handleDelete = async (resortId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this resort?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/resorts/${resortId}`);
          setResorts(resorts.filter((resort) => resort._id !== resortId));
          Swal.fire("Deleted!", "The resort has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting resort:", error);
          Swal.fire("Error!", "There was an error deleting the resort.", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 shadow-lg rounded-xl mt-12">
      <h2 className="text-2xl font-bold mt-12 text-gray-900">
        Resort List ({resorts.length})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {resorts.length > 0 ? (
          resorts.map((resort) => (
            <div
              key={resort._id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {resort.name}
              </h3>
              <h3>Resort ID: {resort.moderatorId}</h3>
              <p className="text-gray-700">Pax: {resort.pax}</p>
              <p className="text-gray-700">
                Price Range: {resort.priceMin} - {resort.priceMax}
              </p>

              <button
                onClick={() => handleDelete(resort._id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete Resort
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No resorts available.</p>
        )}
      </div>
    </div>
  );
};

export default ResortUpload;
