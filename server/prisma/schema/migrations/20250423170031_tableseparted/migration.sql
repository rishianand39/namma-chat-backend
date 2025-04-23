-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "name" TEXT,
    "about" TEXT,
    "profileImage" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatUser" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "file_url" TEXT,
    "seen_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Otp_phone_idx" ON "Otp"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
