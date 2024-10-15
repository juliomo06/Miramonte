import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAddShoppingCart, MdPendingActions } from "react-icons/md";
import { FaFolderPlus, FaCheckCircle } from "react-icons/fa";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Swal from 'sweetalert2';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ADashboard = () => {
  const [resortCount, setResortCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/bookings");
        setBookings(response.data);
        setTotalBookings(response.data.length);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError('Failed to fetch bookings');
      }
    };

    const fetchResortCount = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/resorts/count');
        setResortCount(response.data.count);
      } catch (err) {
        console.error("Error fetching resort count:", err);
        setError('Failed to fetch resort count');
      }
    };

    const fetchConfirmedCount = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/bookings/confirmed/count');
        setConfirmedCount(response.data.count);
      } catch (err) {
        console.error("Error fetching confirmed reservations count:", err);
        setError('Failed to fetch confirmed reservations count');
      }
    };

    const fetchPendingCount = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/bookings/pending/count');
        setPendingCount(response.data.count);
      } catch (err) {
        console.error("Error fetching pending reservations count:", err);
        setError('Failed to fetch pending reservations count');
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBookings(), fetchResortCount(), fetchConfirmedCount(), fetchPendingCount()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calendarEvents = bookings.map(booking => ({
      title: booking.resortName, 
      name: booking.userId,
      status: booking.status,
      start: new Date(booking.checkInDate), 
      end: new Date(booking.checkOutDate),  
      allDay: true,
    }));
    setEvents(calendarEvents);
  }, [bookings]);

  return (
    <div className="w-full h-full bg-gray-100 p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Boxanaly>
          <div className="text-2xl flex absolute top-4 right-4 text-green-500"><MdAddShoppingCart /></div>
          <div className="flex flex-col inset-0 absolute justify-center items-center">
            <div className="text-3xl font-bold text-gray-700">{loading ? 'Loading...' : totalBookings}</div>
            <div className="text-md text-gray-500">Total Events</div>
          </div>
        </Boxanaly>
        <Boxanaly>
          <div className="text-2xl flex absolute top-4 right-4 text-blue-500"><FaFolderPlus /></div>
          <div className="flex flex-col inset-0 absolute justify-center items-center">
            <div className="text-3xl font-bold text-gray-700">{loading ? 'Loading...' : resortCount}</div>
            {error && <p className="error text-red-500">{error}</p>}
            <div className="text-md text-gray-500">Total Resorts</div>
          </div>
        </Boxanaly>
        <Boxanaly>
          <div className="text-2xl flex absolute top-4 right-4 text-purple-500"><FaCheckCircle /></div>
          <div className="flex flex-col inset-0 absolute justify-center items-center">
            <div className="text-3xl font-bold text-gray-700">{loading ? 'Loading...' : confirmedCount}</div>
            <div className="text-md text-gray-500">Confirmed Reservations</div>
          </div>
        </Boxanaly>
        <Boxanaly>
          <div className="text-2xl flex absolute top-4 right-4 text-yellow-500"><MdPendingActions /></div>
          <div className="flex flex-col inset-0 absolute justify-center items-center">
            <div className="text-3xl font-bold text-gray-700">{loading ? 'Loading...' : pendingCount}</div>
            <div className="text-md text-gray-500">Pending Reservations</div>
          </div>
        </Boxanaly>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Bookings Calendar</h2>
        <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 500, margin: '50px' }}
  selectable
  onSelectEvent={(event) =>
    Swal.fire({
      title: `Resort: ${event.title}`,
      html: `<b>Status:</b> ${event.status}<br/><b>Booked by:</b> ${event.name}`,
      icon: 'info',
      confirmButtonText: 'OK',
    })
    
  }
  onSelectSlot={(slotInfo) =>
    Swal.fire({
      title: 'Selected Slot',
      html: `<b>Start:</b> ${slotInfo.start.toLocaleString()}<br/><b>End:</b> ${slotInfo.end.toLocaleString()}`,
      icon: 'info',
      confirmButtonText: 'OK',
    })
  }
/>
      </div>
    </div>
  );
};

export default ADashboard;

function Boxanaly({ children }) {
  return (
    <div className="bg-white relative rounded-md h-40 p-4 flex-1 flex-col border border-gray-200 flex items-center transition-transform transform hover:scale-105">
      {children}
    </div>
  );
}