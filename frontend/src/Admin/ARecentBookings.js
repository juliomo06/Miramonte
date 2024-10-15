import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const ARecentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const openModal = (screenshotUrl) => {
    console.log("Opening modal with screenshot URL:", screenshotUrl);
    setSelectedScreenshot(screenshotUrl);
  };

  const closeModal = () => {
    setSelectedScreenshot(null);
  };

  const handleAction = async (bookingId, action) => {
    setLoading(true);
    try {
      const url = `http://localhost:8080/api/bookings/${bookingId}/${action}`;
      await axios.patch(url);
  
      const response = await axios.get("http://localhost:8080/api/bookings");
      setBookings(response.data);
  
      if (action === 'confirmed') {
        Swal.fire("Confirmed!", "Booking confirmed and email sent to user.", "success");
      } else if (action === 'cancelled') {
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
      }
  
    } catch (error) {
      console.error(`Error ${action} booking:`, error);
      Swal.fire("Error", `Failed to ${action} booking. Please try again.`, "error");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCancelClick = (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes,",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAction(bookingId, "cancelled"); 
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
      }
    });
  };

  const confirmBooking = (bookingId) => {
    handleAction(bookingId, "confirmed");
    Swal.fire("Confirmed!", "Your booking has been confirmed.", "success");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Recent Resort Bookings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => {
          const formattedCheckInDate = dayjs(booking.checkInDate).format(
            "MMMM D, YYYY h:mm a"
          );
          const formattedCheckOutDate = dayjs(booking.checkOutDate).format(
            "MMMM D, YYYY h:mm a"
          );
          const screenshotUrl = `http://localhost:8080/gcash/${booking.gcashScreenshot}`;

          return (
            <div
              key={booking._id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="font-semibold">{booking.resortName}</h3>
                <p>Name: {booking.userId}</p>
                <p>Status: {booking.status}</p>
                <p>
                  Date Book: {formattedCheckInDate} - {formattedCheckOutDate}
                </p>
                <p>Amount: ₱{booking.totalCost.toLocaleString()}</p>
                <p>Booking Time: {booking.swimmingType}</p>
                <p>Gcash Ref Number: {booking.gcashRefNumber}</p>
                <p>Booking Ref: {booking.bookingReference}</p>
              </div>

              {booking.status === "pending" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCancelClick(booking._id)}
                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmBooking(booking._id)}
                    className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
                  >
                    Confirm
                  </button>
                </div>
              )}

              {booking.status === "confirmed" && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleCancelClick(booking._id)}
                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                onClick={() => openModal(screenshotUrl)}
              >
                Show Screenshot
              </button>
            </div>
          );
        })}
      </div>

      {selectedScreenshot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-2 w-80">
            <img
              src={selectedScreenshot}
              alt="GCash Screenshot"
              className="w-full h-auto mb-2"
            />
            <button
              className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARecentBookings;
