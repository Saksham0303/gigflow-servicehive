const express = require('express');
const authenticate = require('../middleware/auth');
const Gig = require('../models/Gig');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find()
      .populate('ownerId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || budget === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (budget <= 0) {
      return res.status(400).json({ message: 'Budget must be greater than 0' });
    }

    const gig = new Gig({
      title,
      description,
      budget,
      ownerId: req.userId,
    });

    await gig.save();
    await gig.populate('ownerId', 'name email');

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:gigId', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId)
      .populate('ownerId', 'name email')
      .populate('assignedTo', 'name email');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
