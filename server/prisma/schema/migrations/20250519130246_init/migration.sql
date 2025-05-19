-- CreateTable
CREATE TABLE "ChatList" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_user_id" TEXT NOT NULL,
    "last_message" TEXT,
    "last_timestamp" TIMESTAMP(3),
    "unread_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ChatList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatList_user_id_contact_user_id_key" ON "ChatList"("user_id", "contact_user_id");

-- AddForeignKey
ALTER TABLE "ChatList" ADD CONSTRAINT "ChatList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatList" ADD CONSTRAINT "ChatList_contact_user_id_fkey" FOREIGN KEY ("contact_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
