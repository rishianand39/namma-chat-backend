/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `code` on the `Otp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL;
