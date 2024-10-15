import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentBookings = () => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/bookings/user/recent', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecentBookings(response.data);
      } catch (error) {
        console.error('Error fetching recent bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:8080/api/bookings/${bookingId}`, {
        status: 'cancelled',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentBookings((prevBookings) => 
        prevBookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );

      // Optionally, show a success message
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Recent Bookings</h2>
      {recentBookings.length === 0 ? (
        <p className="text-gray-500">No recent bookings found.</p>
      ) : (
        <ul className="space-y-4 w-full">
        {recentBookings.map((booking) => (
          <li key={booking._id} className="flex flex-col bg-white p-4 rounded-md shadow-md transition-transform transform hover:scale-105">
            <p className="text-gray-600">Status: <span className="font-semibold">{booking.status}</span></p>
            <p className="text-gray-600">Resort: <span className="font-semibold">{booking.resortName}</span></p>
            <p className="text-gray-600">Booking Time: <span className="font-semibold">{booking.swimmingType}</span></p>
            <p className="text-gray-600">Check-in: <span className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</span></p>
            <p className="text-gray-600">Check-out: <span className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</span></p>
            {booking.status !== 'cancelled' && (
              <button 
                onClick={() => cancelBooking(booking._id)} 
                className="mt-2 px-4 py-2 w-24 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Cancel Booking
              </button>
            )}
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default RecentBookings;
