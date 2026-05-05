/*
  Warnings:

  - You are about to drop the column `cleanerId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `clientEmail` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `serviceDate` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `serviceType` on the `booking` table. All the data in the column will be lost.
  - The `status` column on the `booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `cleaner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `checkIn` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOut` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestEmail` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestName` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('SIMPLES', 'DUPLO', 'SUITE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT');

-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_cleanerId_fkey";

-- DropForeignKey
ALTER TABLE "cleaner" DROP CONSTRAINT "cleaner_adminId_fkey";

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "cleanerId",
DROP COLUMN "clientEmail",
DROP COLUMN "clientName",
DROP COLUMN "notes",
DROP COLUMN "serviceDate",
DROP COLUMN "serviceType",
ADD COLUMN     "checkIn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "checkOut" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "guestEmail" TEXT NOT NULL,
ADD COLUMN     "guestName" TEXT NOT NULL,
ADD COLUMN     "roomId" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "cleaner";

-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "category" "RoomCategory" NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_rule" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "priceMultiplier" DOUBLE PRECISION DEFAULT 1.0,
    "fixedPrice" DOUBLE PRECISION,
    "category" "RoomCategory",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "details" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_number_key" ON "room"("number");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
