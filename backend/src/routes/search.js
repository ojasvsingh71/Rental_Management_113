import { Router } from "express";
import pkg from "@prisma/client";
const { PrismaClient, RentalStatus } = pkg;
import { z } from "zod";

const router = Router();

// Product search filters
const productSearchSchema = z.object({
  keyword: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  availableFrom: z.coerce.date().optional(),
  availableTo: z.coerce.date().optional(),
});

// Rental filter
const rentalFilterSchema = z.object({
    status: z.enum(Object.values(RentalStatus)).optional(),
    customerId: z.string().cuid().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

// --------------------
// GET /products/search
// --------------------
router.get("/products/search", async (req, res) => {
  try {
    const filters = productSearchSchema.parse(req.query);

    const products = await prisma.product.findMany({
      where: {
        name: filters.keyword ? { contains: filters.keyword, mode: "insensitive" } : undefined,
        category: filters.category || undefined,
        basePrice: {
          gte: filters.minPrice || undefined,
          lte: filters.maxPrice || undefined,
        },
      },
    });

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --------------------
// GET /rentals/filter
// --------------------
router.get("/rentals/filter", async (req, res) => {
  try {
    const filters = rentalFilterSchema.parse(req.query);

    const rentals = await prisma.rental.findMany({
      where: {
        status: filters.status || undefined,
        customerId: filters.customerId || undefined,
        startDate: filters.startDate ? { gte: filters.startDate } : undefined,
        endDate: filters.endDate ? { lte: filters.endDate } : undefined,
      },
      include: { product: true, customer: true },
    });

    res.json(rentals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
