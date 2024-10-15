const Booking = require('../models/bookingModel');
const Resort = require('../models/resortModel');


const getModeratorBookings = async (req, res) => {
  try {
    const moderatorId = req.user._id; 
    const resorts = await Resort.find({ moderatorId });
    const bookings = await Booking.find({ resortId: { $in: resorts.map(r => r._id) } })
                                  .populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings for moderator:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecentBookings = async (req, res) => {
  try {
    const moderatorId = req.params._id; 
    const recentBookings = await Booking.find({ moderatorId })
      .sort({ createdAt: -1 }) 
      .limit(5) 
      .populate('userId', 'name email'); 

    res.json(recentBookings);
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserRecentBookings = async (req, res) => {
  const userName = req.user.name; 

  try {
    const recentBookings = await Booking.find({ userId: userName })
      .sort({ createdAt: -1 }) 
      .limit(5); 

    res.json(recentBookings);
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = { getRecentBookings,getModeratorBookings, getUserRecentBookings };
