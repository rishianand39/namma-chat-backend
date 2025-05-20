/*
  Warnings:

  - A unique constraint covering the columns `[message_id]` on the table `ChatList` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChatList" ADD COLUMN     "message_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ChatList_message_id_key" ON "ChatList"("message_id");

-- AddForeignKey
ALTER TABLE "ChatList" ADD CONSTRAINT "ChatList_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
