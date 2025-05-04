/*
  Warnings:

  - You are about to drop the column `chat_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `file_url` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `seen_at` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiver_user_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_user_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ChatUser" DROP CONSTRAINT "ChatUser_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatUser" DROP CONSTRAINT "ChatUser_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sender_id_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chat_id",
DROP COLUMN "created_at",
DROP COLUMN "file_url",
DROP COLUMN "seen_at",
DROP COLUMN "sender_id",
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiver_user_id" TEXT NOT NULL,
ADD COLUMN     "sender_user_id" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "content" SET NOT NULL;

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "ChatUser";
