import express from "express";
import prisma from "../prismaClient.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all contracts for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Example: fetch contracts for the logged-in user
    const contracts = await prisma.contract.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(contracts);
  } catch (error) {
    console.error("Error in /api/contract:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
