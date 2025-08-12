import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import automationRoutes, { applyLateFees, sendOverdueReminders } from "./routes/automation.js";
import cors from "cors"

// Load env variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ----------------------
// ROUTES
// ----------------------
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import bulkRoutes from "./routes/bulk.js";
import customerRoutes from "./routes/customer.js";
import invoiceRoutes from "./routes/invoice.js";
import notificationRoutes from "./routes/notification.js";
import paymentRoutes from "./routes/payment.js";
import pickupRoutes from "./routes/pickup.js";
import pricelistRoutes from "./routes/pricelist.js";
import productRoutes from "./routes/product.js";
import quotationRoutes from "./routes/quotation.js";
import rentalRoutes from "./routes/rental.js";
import rentalReturnRoutes from "./routes/rentalReturn.js";
import reportRoutes from "./routes/report.js";
import searchRoutes from "./routes/search.js";
import eventRoutes from "./routes/event.js";
import contractRoutes from "./routes/contract.js";

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/automation", automationRoutes);
app.use("/api/bulk", bulkRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/pickup", pickupRoutes);
app.use("/api/pricelist", pricelistRoutes);
app.use("/api/product", productRoutes);
app.use("/api/quotation", quotationRoutes);
app.use("/api/rental", rentalRoutes);
app.use("/api/rental-return", rentalReturnRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/contract", contractRoutes);

// ----------------------
// CRON JOBS
// ----------------------

// Daily late fees
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily late fee job...");
  const count = await applyLateFees();
  console.log(`Applied late fees to ${count} rentals`);
});

// Daily overdue reminders
cron.schedule("0 8 * * *", async () => {
  console.log("Running daily overdue reminder job...");
  const count = await sendOverdueReminders();
  console.log(`Sent ${count} reminders`);
});

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    prisma.$disconnect();
  });
});