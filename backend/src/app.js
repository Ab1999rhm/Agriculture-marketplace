require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("./middleware/auth");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
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

// Serve uploaded product images
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Apply token verification middleware globally
app.use(authMiddleware.verifyToken);

// Public routes (no auth required)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bulletins", bulletinRoutes);

// Protected routes (auth required)
app.use("/api/farmers", authMiddleware.verifyToken, farmerRoutes);
app.use("/api/buyers", authMiddleware.verifyToken, buyerRoutes);
app.use("/api/orders", authMiddleware.verifyToken, orderRoutes);
app.use("/api/payments", authMiddleware.verifyToken, paymentRoutes);
app.use("/api/admin", authMiddleware.requireAdmin, adminRoutes);
app.use("/api/crop-plans", authMiddleware.verifyToken, cropPlanRoutes);
app.use("/api/inventory", authMiddleware.verifyToken, inventoryRoutes);
app.use("/api/equipment", authMiddleware.verifyToken, equipmentRoutes);
app.use("/api/storage", authMiddleware.verifyToken, storageRoutes);
app.use("/api/batch-lots", authMiddleware.verifyToken, batchLotRoutes);
app.use("/api/quality-grades", authMiddleware.verifyToken, qualityGradeRoutes);
app.use("/api/certifications", authMiddleware.verifyToken, certificationRoutes);
app.use("/api/loans", authMiddleware.verifyToken, loanRoutes);
app.use("/api/lab-tests", authMiddleware.verifyToken, labTestRoutes);
app.use(
  "/api/production-costs",
  authMiddleware.verifyToken,
  productionCostRoutes,
);
app.use("/api/insurance", authMiddleware.verifyToken, insuranceRoutes);
app.use("/api/subsidies", authMiddleware.verifyToken, subsidyRoutes);
app.use("/api/auctions", authMiddleware.verifyToken, auctionRoutes);
app.use("/api/contracts", authMiddleware.verifyToken, contractRoutes);
app.use("/api/bulk-discounts", authMiddleware.verifyToken, bulkDiscountRoutes);
app.use("/api/pre-harvest", authMiddleware.verifyToken, preHarvestRoutes);
app.use("/api/wishlist", authMiddleware.verifyToken, wishlistRoutes);
app.use(
  "/api/supplier-reviews",
  authMiddleware.verifyToken,
  supplierReviewRoutes,
);
app.use("/api/quality-audits", authMiddleware.verifyToken, qualityAuditRoutes);
app.use("/api/disputes", authMiddleware.verifyToken, disputeRoutes);
app.use("/api/notifications", authMiddleware.verifyToken, notificationRoutes);

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
