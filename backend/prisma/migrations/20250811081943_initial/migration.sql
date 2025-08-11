/*
  Warnings:

  - A unique constraint covering the columns `[orderReference]` on the table `Rental` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderReference` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'STAFF';

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "rentalId" TEXT;

-- AlterTable
ALTER TABLE "public"."Pickup" ADD COLUMN     "actualPickup" TIMESTAMP(3),
ADD COLUMN     "staffId" TEXT;

-- AlterTable
ALTER TABLE "public"."Pricelist" ADD COLUMN     "customerGroup" TEXT;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."Quotation" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "public"."Rental" ADD COLUMN     "orderReference" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."RentalReturn" ADD COLUMN     "actualReturn" TIMESTAMP(3),
ADD COLUMN     "daysLate" INTEGER,
ADD COLUMN     "staffId" TEXT;

-- CreateTable
CREATE TABLE "public"."RentalHistory" (
    "id" TEXT NOT NULL,
    "rentalId" TEXT NOT NULL,
    "oldStatus" "public"."RentalStatus" NOT NULL,
    "newStatus" "public"."RentalStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedById" TEXT,

    CONSTRAINT "RentalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rental_orderReference_key" ON "public"."Rental"("orderReference");

-- AddForeignKey
ALTER TABLE "public"."RentalHistory" ADD CONSTRAINT "RentalHistory_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "public"."Rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalHistory" ADD CONSTRAINT "RentalHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pickup" ADD CONSTRAINT "Pickup_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalReturn" ADD CONSTRAINT "RentalReturn_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "public"."Rental"("id") ON DELETE SET NULL ON UPDATE CASCADE;
