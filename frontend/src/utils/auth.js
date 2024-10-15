import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 <= Date.now()) {
      logout();
      return false;
    }
    return true;
  } catch (error) {

    logout(); 
    return false;
  }
};

export const getRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    return null;
  }
};

export const getUserInfo = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      name: decoded.name, 
      email: decoded.email 
    };
  } catch (error) {
    return null;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post('http://localhost:8080/api/bookings', bookingData); 
    return response;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error; 
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('reloadAfterLogin');
  window.location.href = '/'; 
};
