const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');
const resortController = require('./controllers/resortController');
const ResortModel = require('./models/resortModel');
const bookingRoutes = require('./routes/booking');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const adminRoutes = require ('./routes/admin');
const { authenticate } = require('./middleware.js/authenticate');
require ('dotenv').config()
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});
//test
app.get('/', (req, res) => res.status(200).json({ message:'MIRAMONTE'}))

// USER ROUTES
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


// Resort Routes
app.get('/api/moderator/resorts', authenticate, resortController.getResortsByModerator);
app.get('/api/resorts/count', resortController.getResortCount);
app.get('/api/resorts', resortController.getAllResorts);
app.get('/api/resorts/:id', resortController.getResortById);
app.post('/api/resorts', authenticate, resortController.createResort);
app.put('/api/resorts/:id', authenticate, resortController.updateResort);
app.delete('/api/resorts/:id', resortController.deleteResort);




//Storage resort images
const resortStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const resortName = req.body.name || 'Unnamed_Resort';
    const uploadDir = path.join('uploads', resortName.replace(/[^a-zA-Z0-9]/g, '_'));

    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return cb(err);
      }
      cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const resortUpload = multer({ storage: resortStorage }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 }
]);

// Route upload resort images
app.post('/api/uploads', authenticate, (req, res) => {
  resortUpload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.error('General error:', err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }

    const { files } = req;

    if (!files.image || !files.image2 || !files.image3 || !files.image4 || !files.image5) {
      return res.status(400).json({ message: 'All images are required' });
    }

    try {
      const imagePaths = Object.keys(files).map(key => ({
        path: `/uploads/${req.body.name.replace(/[^a-zA-Z0-9]/g, '_')}/${files[key][0].filename}`
      }));

      const newResort = new ResortModel({
        name: req.body.name || 'Unnamed Resort',
        pax: req.body.pax,
        evfilter: Array.isArray(req.body.evfilter) ? req.body.evfilter : JSON.parse(req.body.evfilter),
        priceMin: req.body.priceMin,
        priceMax: req.body.priceMax,
        details: req.body.details,
        images: imagePaths,
        moderatorId: req.user._id,
      });
      

      await newResort.save();
      res.status(200).json({ message: 'Resort created successfully', resort: newResort });
    } catch (error) {
      console.error('Error saving resort data:', error);
      res.status(500).json({ message: 'Error saving resort data', error: error.message });
    }
  });
});




// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/gcash', express.static(path.join(__dirname, 'gcash')));


// Booking confirmation
app.use('/api/bookings', bookingRoutes);

//start
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port` + PORT);
});