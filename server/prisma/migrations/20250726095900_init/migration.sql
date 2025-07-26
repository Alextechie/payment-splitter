-- DropForeignKey
ALTER TABLE "Rule" DROP CONSTRAINT "Rule_recipientId_fkey";

-- AlterTable
ALTER TABLE "Rule" ALTER COLUMN "recipientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
