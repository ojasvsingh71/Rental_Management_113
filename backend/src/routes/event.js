import express from "express";
import prisma from "../prismaClient.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all events (for calendar)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Example: fetch events for the logged-in user
    const events = await prisma.event.findMany({
      where: { userId: req.user.id },
      orderBy: { date: "asc" },
    });
    res.json(events);
  } catch (error) {
    console.error("Error in /api/event:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
