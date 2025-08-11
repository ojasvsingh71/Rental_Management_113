import { Router } from "express";
import { prisma } from "../prismaClient.js";
import { z } from "zod";

const router = Router();

const impersonateSchema = z.object({
  userId: z.string().cuid(),
});

// --------------------
// GET /admin/dashboard
// --------------------
router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalRentals = await prisma.rental.count();
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
    });

    res.json({
      totalUsers,
      totalProducts,
      totalRentals,
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------------
// POST /admin/impersonate/:userId
// --------------------
router.post("/impersonate/:userId", async (req, res) => {
  try {
    const { userId } = impersonateSchema.parse(req.params);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ⚠️ In a real app, you'd create a temporary token for impersonation
    res.json({ message: `Now impersonating ${user.name}`, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
