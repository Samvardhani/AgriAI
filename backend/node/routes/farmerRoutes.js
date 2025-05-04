import express from 'express';
import Farmer from '../models/farmer.js';
import { getFarmerData, updateFarmerData } from '../controllers/farmerController.js';

const router = express.Router();

// Register a new farmer (no auth middleware for testing)
router.post('/register', async (req, res) => {
  try {
    console.log("Received registration data:", req.body); // Debug log
    
    const { userId, personalInfo, landInfo } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const farmer = new Farmer({
      userId,
      personalInfo,
      landInfo
    });

    const savedFarmer = await farmer.save();
    res.status(201).json(savedFarmer);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ message: error.message });
  }
});



// Get farmer profile
router.get('/profile/:uid', async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.params.uid });
    if (!farmer) {
      console.log('Farmer not found for uid:', req.params.uid); // Debug log
      return res.status(404).json({ message: 'Farmer profile not found' });
    }
    res.json(farmer);
  } catch (error) {
    console.error('Error finding farmer:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
});

router.get('/data/:userId', (req, res, next) => {
  console.log("Route hit for userId:", req.params.userId); // Log the route hit
  next(); // Call the next middleware (controller)
}, getFarmerData);

router.put('/data/:userId', updateFarmerData); // Ensure this route is defined


export default router; 