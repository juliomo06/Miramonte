const express = require('express');
const Booking = require('../models/bookingModel');
const Resort = require ('../models/resortModel')
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { getModeratorBookings,getRecentBookings, getUserRecentBookings } = require('../controllers/bookingController');
const { authenticate } = require('../middleware.js/authenticate');
const { sendConfirmationEmail } = require('./mailer');


// gcash
const gcashDir = path.join(__dirname, '../../gcash');
if (!fs.existsSync(gcashDir)) {
  fs.mkdirSync(gcashDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'gcash/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, 
});

// BOOKING
router.post('/', upload.single('gcashScreenshot'), async (req, res) => {
  try {
    const {
      userId,
      email,
      resortId,
      resortName,
      checkInDate,
      checkOutDate,
      totalCost,
      paymentMethod,
      gcashRefNumber,
      bookingReference,
      swimmingType,
    } = req.body;

    if (!userId || !email || !resortId || !checkInDate || !checkOutDate || !totalCost) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const gcashScreenshot = req.file ? req.file.filename : null; 


    const newBooking = new Booking({
      userId,
      email,
      resortId,
      resortName, 
      checkInDate,
      checkOutDate,
      totalCost,
      paymentMethod,
      gcashRefNumber,
      gcashScreenshot, 
      bookingReference,
      swimmingType,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// get all bookings

router.get('/moderator',authenticate, getModeratorBookings);
//admmmin
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId resortId'); 
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});



// get count confirm books
router.patch('/:bookingId/confirmed', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    booking.status = 'confirmed'; 
    await booking.save();

    // Send confirmation email
    await sendConfirmationEmail(booking.email, {
      resortName: booking.resortName,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      totalCost: booking.totalCost,
    });

    res.status(200).send(booking);
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).send('Server error');
  }
});
// Cancel booking
router.patch('/:id/cancelled', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'cancelled';
    booking.cancellationTime = new Date(); 
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Status Count
router.get('/confirmed/count', async (req, res) => {
  try {
    const confirmedCount = await Booking.countDocuments({ status: 'confirmed' });
    res.json({ count: confirmedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get confirmed reservation count' });
  }
});
//pending
router.get('/pending/count', async (req, res) => {
  try {
    const pendingCount = await Booking.countDocuments({ status: 'pending' });
    res.json({ count: pendingCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get pending reservation count' });
  }
});
//topres
router.get('/top-resorts', async (req, res) => {
  try {
    const topResorts = await Booking.aggregate([
      { $match: { status: 'confirmed' } }, 
      { 
        $group: {
          _id: "$resortId", 
          count: { $sum: 1 } 
        }
      },
      { $sort: { count: -1 } }, 
      { $limit: 3} 
    ]);
    const populatedResorts = await Booking.populate(topResorts, { path: '_id', model: 'Resort' });

    res.status(200).json(populatedResorts);
  } catch (error) {
    console.error("Error fetching top-performing resorts:", error);
    res.status(500).json({ message: 'Error fetching top-performing resorts', error: error.message });
  }
});
//bookeddates
router.get('/:resortId/booked-dates', async (req, res) => {
  const { resortId } = req.params;

  try {
    const bookings = await Booking.find({
      resortId,
      status: { $in: ['confirmed', 'pending'] }, 
    }, 'checkInDate checkOutDate -_id');

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    res.status(500).json({ message: 'Error fetching booked dates', error: error.message });
  }
});



router.get('/recent', authenticate, getRecentBookings);

//user side pbooks
router.get('/user/recent', authenticate, getUserRecentBookings);
router.patch('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body; 

    if (status !== 'cancelled') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//manual booking
router.post('/manual', async (req, res) => {
  try {
    const {
      userId,
      resortId,
      resortName,
      checkInDate,
      checkOutDate,
      totalCost,
      paymentMethod,
      gcashRefNumber,
      bookingReference,
      swimmingType,
    } = req.body;

    if (!userId || !resortId || !checkInDate || !checkOutDate || !totalCost) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const newBooking = new Booking({
      userId,
      resortId,
      resortName,
      checkInDate,
      checkOutDate,
      totalCost,
      paymentMethod,
      gcashRefNumber,
      bookingReference,
      swimmingType,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating manual booking:", error);
    res.status(500).json({ message: 'Error creating manual booking', error: error.message });
  }
});

router.get('/resorts', async (req, res) => {
  try {
    const { evfilter } = req.query;
    const query = {};

    if (evfilter) {
      query.evfilter = { $in: [evfilter] };
    }
    const resorts = await Resort.find(query);
    res.status(200).json({ resorts, total: resorts.length, page: 1, limit: 3 });
  } catch (error) {
    console.error("Error fetching resorts:", error);
    res.status(500).json({ message: 'Error fetching resorts', error: error.message });
  }
});




module.exports = router;
