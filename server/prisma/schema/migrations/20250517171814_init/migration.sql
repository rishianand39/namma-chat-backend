/*
  Warnings:

  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "read",
DROP COLUMN "timestamp",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "edited_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_delivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_edited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_read" BOOLEAN,
ADD COLUMN     "is_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quote_message_id" TEXT,
ADD COLUMN     "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
