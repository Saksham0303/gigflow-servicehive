const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../middleware/auth');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig is not open for bids' });
    }

    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.userId,
    });

    if (existingBid) {
      return res.status(409).json({ message: 'You have already bid on this gig' });
    }

    const bid = new Bid({
      gigId,
      freelancerId: req.userId,
      message,
      price,
    });

    await bid.save();
    await bid.populate('freelancerId', 'name email');
    await bid.populate('gigId');

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.userId })
      .populate('freelancerId', 'name email')
      .populate('gigId')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:gigId', async (req, res) => {
  try {
    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email')
      .populate('gigId')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:bidId/hire', authenticate, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = await Gig.findById(bid.gigId).session(session);

    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.userId) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Only gig owner can hire' });
    }

    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Gig is already assigned' });
    }

    gig.status = 'assigned';
    gig.assignedTo = bid.freelancerId;
    await gig.save({ session });

    bid.status = 'hired';
    await bid.save({ session });

    await Bid.updateMany(
      { gigId: bid.gigId, _id: { $ne: bid._id }, status: 'pending' },
      { status: 'rejected' },
      { session }
    );

    await session.commitTransaction();

    await bid.populate('freelancerId', 'name email');
    await bid.populate('gigId');

    res.json({
      message: 'Freelancer hired successfully',
      bid,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    await session.endSession();
  }
});

module.exports = router;