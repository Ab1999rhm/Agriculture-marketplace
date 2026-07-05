const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');
const { createNotification } = require('../services/notify');

async function checkAndCloseAuction(auction, auctionId) {
  if (auction.auctionStatus === 'live' && auction.auctionEndsAt && new Date(auction.auctionEndsAt) <= new Date()) {
    auction.auctionStatus = 'closed';
    auction.status = 'closed';
    await db.collection('auctions').doc(auctionId).update({
      auctionStatus: 'closed',
      status: 'closed',
      updatedAt: new Date().toISOString(),
    });
  }
  return auction;
}

router.get('/', async (req, res) => {
  try {
    const { farmerId, buyerId } = req.query;
    let query = db.collection('auctions');
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
    }
    const snapshot = await query.get();
    let items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Auto-close expired auctions
    for (let i = 0; i < items.length; i++) {
      items[i] = await checkAndCloseAuction(items[i], items[i].id);
    }

    // Filter out closed auctions from listing
    items = items.filter((item) => item.auctionStatus !== 'closed');

    if (buyerId) {
      items = items.filter((item) => Array.isArray(item.bids) && item.bids.some((bid) => bid.bidderId === buyerId));
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('auctions').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    let auction = { id: doc.id, ...doc.data() };
    auction = await checkAndCloseAuction(auction, auction.id);
    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmerId, productId, product, startingPrice, duration, minBid, status, bids, auctionStatus } = req.body;
    
    // Validation: required fields
    if (!farmerId) {
      return res.status(400).json({ error: 'farmerId is required' });
    }
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    if (!product) {
      return res.status(400).json({ error: 'product name is required' });
    }
    if (!startingPrice || startingPrice <= 0) {
      return res.status(400).json({ error: 'startingPrice must be greater than 0' });
    }
    if (!duration || duration <= 0) {
      return res.status(400).json({ error: 'duration must be greater than 0' });
    }
    if (!minBid || minBid <= 0) {
      return res.status(400).json({ error: 'minBid must be greater than 0' });
    }
    
    const docRef = await db.collection('auctions').add({
      farmerId,
      productId,
      product,
      startingPrice,
      duration,
      minBid,
      status: status || 'active',
      auctionStatus: auctionStatus || 'live',
      bids: bids || [],
      currentBid: startingPrice,
      createdAt: new Date().toISOString(),
    });

    // Compute auctionEndsAt from duration
    const durationStr = String(duration || '').toLowerCase();
    let durationMs = 24 * 60 * 60 * 1000; // default 24h
    if (durationStr.includes('14')) durationMs = 14 * 24 * 60 * 60 * 1000;
    else if (durationStr.includes('7')) durationMs = 7 * 24 * 60 * 60 * 1000;
    else if (durationStr.includes('3')) durationMs = 3 * 24 * 60 * 60 * 1000;
    const auctionEndsAt = new Date(Date.now() + durationMs).toISOString();
    await db.collection('auctions').doc(docRef.id).update({ auctionEndsAt });

    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { productId, product, startingPrice, duration, minBid, status, bids, auctionStatus, currentBid } = req.body;
    const updateData = {
      product,
      startingPrice,
      duration,
      minBid,
      status,
      bids,
      currentBid,
      updatedAt: new Date().toISOString(),
    };
    if (productId !== undefined) updateData.productId = productId;
    if (auctionStatus !== undefined) updateData.auctionStatus = auctionStatus;
    
    await db.collection('auctions').doc(req.params.id).update(updateData);
    const doc = await db.collection('auctions').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/bid', async (req, res) => {
  try {
    const { bidAmount, bidderName, bidderId } = req.body;
    const auctionDoc = await db.collection('auctions').doc(req.params.id).get();
    if (!auctionDoc.exists) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    
    let auction = { id: auctionDoc.id, ...auctionDoc.data() };
    auction = await checkAndCloseAuction(auction, auction.id);
    
    if (auction.auctionStatus === 'closed') {
      return res.status(400).json({ error: 'Auction is closed' });
    }
    
    if (!bidAmount || bidAmount <= auction.currentBid) {
      return res.status(400).json({ error: `Bid must be greater than current bid (${auction.currentBid} ETB)` });
    }
    
    if (bidAmount < auction.minBid) {
      return res.status(400).json({ error: `Bid must be at least minimum bid (${auction.minBid} ETB)` });
    }
    
    const newBid = {
      amount: bidAmount,
      bidderName,
      bidderId,
      timestamp: new Date().toISOString(),
    };
    
    const previousHighestBid = auction.bids.length > 0
      ? auction.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max, auction.bids[0])
      : null;

    const updatedBids = [...auction.bids, newBid];
    
    await db.collection('auctions').doc(req.params.id).update({
      bids: updatedBids,
      currentBid: bidAmount,
      updatedAt: new Date().toISOString(),
    });
    
    const updatedDoc = await db.collection('auctions').doc(req.params.id).get();

    // Notify the farmer
    createNotification({
      toUserId: auction.farmerId,
      fromUserId: bidderId,
      fromUserName: bidderName,
      type: 'new_bid',
      title: 'New Bid Received',
      message: `${bidderName} placed a bid of ${bidAmount} ETB on ${auction.product}`,
      relatedId: req.params.id,
    });

    // Notify the previous highest bidder if they are not the current bidder
    if (previousHighestBid && previousHighestBid.bidderId !== bidderId) {
      createNotification({
        toUserId: previousHighestBid.bidderId,
        fromUserId: bidderId,
        fromUserName: bidderName,
        type: 'outbid',
        title: "You've Been Outbid",
        message: `Someone placed a higher bid of ${bidAmount} ETB on ${auction.product}`,
        relatedId: req.params.id,
      });
    }
    
    res.status(200).json({
      id: updatedDoc.id,
      auction: updatedDoc.data(),
      message: `Bid of ${bidAmount} ETB placed successfully`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('auctions').doc(req.params.id).delete();
    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
