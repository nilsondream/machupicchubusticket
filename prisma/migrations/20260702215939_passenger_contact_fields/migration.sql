/*
  Warnings:

  - You are about to drop the column `contactEmail` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Passenger" ADD COLUMN     "email" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "contactEmail",
DROP COLUMN "contactPhone",
DROP COLUMN "notes";
