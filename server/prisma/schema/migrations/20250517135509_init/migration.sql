-- CreateTable
CREATE TABLE "ContactList" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "contacts" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactList_owner_id_key" ON "ContactList"("owner_id");

-- AddForeignKey
ALTER TABLE "ContactList" ADD CONSTRAINT "ContactList_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
