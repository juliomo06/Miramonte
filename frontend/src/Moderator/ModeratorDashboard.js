import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { MdAddShoppingCart, MdPendingActions } from "react-icons/md";
import { FaFolderPlus, FaCheckCircle } from "react-icons/fa";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = momentLocalizer(moment);

const ModDashboard = () => {
  const [events, setEvents] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/bookings/moderator",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const bookings = response.data.map((booking) => ({
          title: `Booked by: ${booking.userId}`, 
          start: new Date(booking.checkInDate),
          end: new Date(booking.checkOutDate),
          allDay: false,
          resource: booking,
        }));

        setEvents(bookings);
        setTotalBookings(bookings.length); 
        const confirmed = bookings.filter(
          (booking) => booking.resource.status === "confirmed"
        ).length;
        const pending = bookings.filter(
          (booking) => booking.resource.status === "pending"
        ).length;

        setConfirmedCount(confirmed);
        setPendingCount(pending);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="w-full h-full bg-gray-100 p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Resort Dashboard
      </h1>
      <p className="mb-2">
        Booking Overview - Manage and monitor all booking details
      </p>
      <div className="flex mb-2 space-x-2">
        <Boxanaly>
          <div className="text-2xl flex absolute top-4 right-4 text-green-500">
            <MdAddShoppingCart />
          </div>
          <div className="flex flex-col inset-0 absolute justify-center items-center">
            <div className="text-3xl font-bold text-gray-700">
              {loading ? "Loading..." : totalBookings}
            </div>
            <div className="text-md text-gray-500">Total Bookings</div>
          </div>
        </Boxanaly>
        <Boxanaly>
          <div className="text-2xl flex absolute top-4 right-4 text-purple-500">
            <FaCheckCircle />
          </div>
          <div className="flex flex-col inset-0 absolute justify-center items-center">
            <div className="text-3xl font-bold text-gray-700">
              {loading ? "Loading..." : confirmedCount}
            </div>
            <div className="text-md text-gray-500">Confirmed Reservations</div>
          </div>
        </Boxanaly>
        <Boxanaly>
          <div className="text-2xl flex absolute top-4 right-4 text-yellow-500">
            <MdPendingActions />
          </div>
          <div className="flex flex-col inset-0 absolute justify-center items-center">
            <div className="text-3xl font-bold text-gray-700">
              {loading ? "Loading..." : pendingCount}
            </div>
            <div className="text-md text-gray-500">Pending Reservations</div>
          </div>
        </Boxanaly>
      </div>
      <div className="bg-white">
        <div style={{ height: "80vh" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModDashboard;

function Boxanaly({ children }) {
  return (
    <div className="bg-white relative rounded-md h-40 p-4 flex-1 flex-col border border-gray-200 flex items-center transition-transform transform hover:scale-105">
      {children}
    </div>
  );
}
