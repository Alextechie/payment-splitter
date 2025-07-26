/*
  Warnings:

  - A unique constraint covering the columns `[ruleId]` on the table `Outcome` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ruleId` to the `Outcome` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rule" DROP CONSTRAINT "Rule_outcomeId_fkey";

-- AlterTable
ALTER TABLE "Outcome" ADD COLUMN     "ruleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Outcome_ruleId_key" ON "Outcome"("ruleId");

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
