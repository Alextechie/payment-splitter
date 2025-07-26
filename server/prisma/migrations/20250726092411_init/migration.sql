/*
  Warnings:

  - You are about to drop the column `amoung` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Split` table. All the data in the column will be lost.
  - Added the required column `amoutg` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RuleGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outcomeId` to the `Split` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Split` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Split` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Split" DROP CONSTRAINT "Split_paymentId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amoung",
ADD COLUMN     "amoutg" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "outcomeId" TEXT;

-- AlterTable
ALTER TABLE "RuleGroup" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Split" DROP COLUMN "createdAt",
ADD COLUMN     "outcomeId" TEXT NOT NULL,
ADD COLUMN     "percentage" DOUBLE PRECISION,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "paymentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outcome" (
    "id" TEXT NOT NULL,
    "status" TEXT,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Condition_ruleId_key" ON "Condition"("ruleId");

-- AddForeignKey
ALTER TABLE "Split" ADD CONSTRAINT "Split_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Split" ADD CONSTRAINT "Split_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
