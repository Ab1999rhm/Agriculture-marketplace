require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("./middleware/auth");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const farmerRoutes = require("./routes/farmers");
const buyerRoutes = require("./routes/buyers");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payments");
const bulletinRoutes = require("./routes/bulletins");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const cropPlanRoutes = require("./routes/cropPlans");
const inventoryRoutes = require("./routes/inventory");
const equipmentRoutes = require("./routes/equipment");
const storageRoutes = require("./routes/storage");
const batchLotRoutes = require("./routes/batchLots");
const qualityGradeRoutes = require("./routes/qualityGrades");
const certificationRoutes = require("./routes/certifications");
const loanRoutes = require("./routes/loans");
const labTestRoutes = require("./routes/labTests");
const productionCostRoutes = require("./routes/productionCosts");
const insuranceRoutes = require("./routes/insurance");
const subsidyRoutes = require("./routes/subsidies");
const auctionRoutes = require("./routes/auctions");
const contractRoutes = require("./routes/contracts");
const bulkDiscountRoutes = require("./routes/bulkDiscounts");
const preHarvestRoutes = require("./routes/preHarvest");
const wishlistRoutes = require("./routes/wishlist");
const supplierReviewRoutes = require("./routes/supplierReviews");
const qualityAuditRoutes = require("./routes/qualityAudits");
const disputeRoutes = require("./routes/disputes");
const notificationRoutes = require("./routes/notifications");

const app = express();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("combined"));
app.use(express.json());

// Serve uploaded files (must be before auth middleware for public access)
const uploadsPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// Apply token verification middleware globally (but not for /uploads)
app.use((req, res, next) => {
  if (req.path.startsWith('/uploads')) {
    return next();
  }
  return authMiddleware.verifyToken(req, res, next);
});

// Public routes (no auth required)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bulletins", bulletinRoutes);
app.get("/api/banks", async (req, res) => {
  try {
    const { db } = require('./services/firebase');
    const banksSnapshot = await db.collection('banks').get();
    const banks = banksSnapshot.docs.map(doc => doc.data());
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
});

// Protected routes (auth required)
app.use("/api/farmers", farmerRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", authMiddleware.requireAdmin, adminRoutes);
app.use("/api/crop-plans", cropPlanRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/batch-lots", batchLotRoutes);
app.use("/api/quality-grades", qualityGradeRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/lab-tests", labTestRoutes);
app.use("/api/production-costs", productionCostRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/subsidies", subsidyRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/bulk-discounts", bulkDiscountRoutes);
app.use("/api/pre-harvest", preHarvestRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/supplier-reviews", supplierReviewRoutes);
app.use("/api/quality-audits", qualityAuditRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/notifications", notificationRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

module.exports = app;
