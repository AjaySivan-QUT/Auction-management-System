// routes/auctionRoutes.js
const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');

// Auction CRUD
router.post('/', protect, auctionController.createAuction); // Create auction
router.get('/', auctionController.getAuctions); // Get all auctions
router.get('/:id', auctionController.getAuctionById); // Get auction by ID
router.put('/:id', protect, auctionController.updateAuction); // Update auction
router.delete('/:id', protect, auctionController.deleteAuction); // Delete auction

// Bidding
router.post('/:id/bid', protect, auctionController.placeBid); // Place a bid on auction
router.get('/:id/bids', auctionController.getBids); // Get all bids for auction

module.exports = router;
