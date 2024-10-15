import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { getUserInfo } from "../utils/auth";

const ModeratorRecentBooking = () => {
  const user = getUserInfo(); 
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBooking, setNewBooking] = useState({
    userId: "",
    email: user?.email || '',
    resortId: localStorage.getItem("userId"),
    resortName: user?.name || "",
    checkInDate: new Date(),
    checkOutDate: new Date(),
    totalCost: "",
    paymentMethod: "Manual", 
    gcashRefNumber: "",
    bookingReference: "",
    swimmingType: "day",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/bookings/moderator",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecentBookings(response.data);
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
        setError("Failed to fetch recent bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBookings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking((prev) => ({
      ...prev,
      [name]: name === "checkInDate" || name === "checkOutDate" ? new Date(value) : value,
    }));
  };

  const validateForm = () => {
    const { userId, totalCost, paymentMethod, gcashRefNumber, bookingReference } = newBooking;

    if (!userId || !totalCost) {
      setError("Customer ID and Total Cost are required.");
      return false;
    }

    if (isNaN(totalCost)) {
      setError("Total cost must be a valid number.");
      return false;
    }
    if (paymentMethod !== "Manual") {
      if (gcashRefNumber.length !== 7) {
        setError("GCash Ref Number must be 7 digits.");
        return false;
      }

      if (bookingReference.length !== 6) {
        setError("Booking Reference Number must be 6 digits.");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/bookings/manual",
        newBooking,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecentBookings((prev) => [response.data, ...prev]);
      setSuccessMessage("Booking created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Failed to create booking. Please try again.");
    }
  };

  const resetForm = () => {
    setNewBooking({
      userId: "",
      email: user?.email || '',
      resortId: localStorage.getItem("userId"),
      resortName: user?.name || "",
      checkInDate: new Date(),
      checkOutDate: new Date(),
      totalCost: "",
      paymentMethod: "Manual",
      gcashRefNumber: "",
      bookingReference: "",
      swimmingType: "day",
    });
    setError(null);
    setSuccessMessage("");
  };

  if (loading) {
    return <div>Loading recent bookings...</div>;
  }

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
      
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <h3 className="font-semibold text-lg">Create Manual Booking</h3>

        <input
          type="text"
          name="userId"
          placeholder="Customer ID"
          value={newBooking.userId}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 w-full"
        />

        <input
          type="number"
          name="totalCost"
          placeholder="Total Cost"
          value={newBooking.totalCost}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 w-full"
        />

        <select
          name="paymentMethod"
          value={newBooking.paymentMethod}
          onChange={handleInputChange}
          className="border rounded-md p-2 w-full"
        >
          <option value="Manual">Manual</option>
          <option value="GCash">GCash</option>
        </select>

        {/* Conditionally show GCash fields if payment method is GCash */}
        {newBooking.paymentMethod !== "Manual" && (
          <>
            <input
              type="text"
              name="gcashRefNumber"
              placeholder="GCash Ref Number (7 digits)"
              value={newBooking.gcashRefNumber}
              onChange={handleInputChange}
              required={newBooking.paymentMethod !== "Manual"} // Required if not Manual
              className="border rounded-md p-2 w-full"
            />

            <input
              type="text"
              name="bookingReference"
              placeholder="Booking Ref Number (6 digits)"
              value={newBooking.bookingReference}
              onChange={handleInputChange}
              required={newBooking.paymentMethod !== "Manual"} // Required if not Manual
              className="border rounded-md p-2 w-full"
            />
          </>
        )}

        <select
          name="swimmingType"
          value={newBooking.swimmingType}
          onChange={handleInputChange}
          className="border rounded-md p-2 w-full"
        >
          <option value="day">Day Swimming</option>
          <option value="night">Night Swimming</option>
          <option value="whole-day">Whole Day Swimming</option>
        </select>

        <input
          type="date"
          name="checkInDate"
          value={dayjs(newBooking.checkInDate).format("YYYY-MM-DD")}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 w-full"
        />

        <input
          type="date"
          name="checkOutDate"
          value={dayjs(newBooking.checkOutDate).format("YYYY-MM-DD")}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 w-full"
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded-md w-full">
          Create Booking
        </button>
      </form>

      {recentBookings.length === 0 ? (
        <p>No recent bookings available.</p>
      ) : (
        <ul className="space-y-4">
          {recentBookings.map((booking) => {
            const formattedCheckInDate = dayjs(booking.checkInDate).format("MMM D, YYYY");
            const formattedCheckOutDate = dayjs(booking.checkOutDate).format("MMM D, YYYY");

            return (
              <li key={booking._id} className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="font-bold text-lg">Customer: {booking.userId}</h3>
                <p>Status: {booking.status}</p>
                <p>Booking Type: {booking.swimmingType}</p>
                <p>Check-in: {formattedCheckInDate}</p>
                <p>Check-out: {formattedCheckOutDate}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ModeratorRecentBooking;
