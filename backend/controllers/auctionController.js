// controllers/auctionController.js
const AuctionItem = require('../models/AuctionItem');

// Create a new auction
exports.createAuction = async (req, res) => {
  try {
    const { title, description, startingPrice, auctionEndTime } = req.body;

    if (!title || !description || !startingPrice || !auctionEndTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (new Date(auctionEndTime) <= new Date()) {
      return res.status(400).json({ message: 'Auction end time must be in the future' });
    }

    const auction = new AuctionItem({
      title,
      description,
      startingPrice,
      currentPrice: startingPrice,
      auctionEndTime,
      createdBy: req.user._id,
    });

    await auction.save();
    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all auctions (optionally filter by status)
exports.getAuctions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const auctions = await AuctionItem.find(filter)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get auction by ID
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('bids.bidder', 'username email');
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update auction (only creator allowed)
exports.updateAuction = async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    if (!auction.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this auction' });
    }

    if (auction.status !== 'open') {
      return res.status(400).json({ message: 'Cannot update closed or cancelled auction' });
    }

    const { title, description, auctionEndTime } = req.body;
    if (title) auction.title = title;
    if (description) auction.description = description;
    if (auctionEndTime) {
      if (new Date(auctionEndTime) <= new Date()) {
        return res.status(400).json({ message: 'Auction end time must be in the future' });
      }
      auction.auctionEndTime = auctionEndTime;
    }

    await auction.save();
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete auction (only creator allowed)
exports.deleteAuction = async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    if (!auction.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this auction' });
    }

    await auction.remove();
    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Place a bid on an auction
exports.placeBid = async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    if (auction.status !== 'open') {
      return res.status(400).json({ message: 'Auction is not open for bidding' });
    }

    if (new Date() > new Date(auction.auctionEndTime)) {
      auction.status = 'closed';
      await auction.save();
      return res.status(400).json({ message: 'Auction has ended' });
    }

    const bidAmount = req.body.amount;
    if (!bidAmount || bidAmount <= auction.currentPrice) {
      return res.status(400).json({ message: `Bid must be higher than current price (${auction.currentPrice})` });
    }

    // Add bid
    auction.bids.push({
      bidder: req.user._id,
      amount: bidAmount,
      bidAt: new Date(),
    });

    auction.currentPrice = bidAmount;
    await auction.save();

    res.status(201).json({ message: 'Bid placed successfully', auction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bids for an auction
exports.getBids = async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id).populate('bids.bidder', 'username email');
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    res.json(auction.bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
