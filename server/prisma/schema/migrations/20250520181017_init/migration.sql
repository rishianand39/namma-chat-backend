/*
  Warnings:

  - You are about to drop the column `last_message` on the `ChatList` table. All the data in the column will be lost.
  - You are about to drop the column `last_timestamp` on the `ChatList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatList" DROP COLUMN "last_message",
DROP COLUMN "last_timestamp";
