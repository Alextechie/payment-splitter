/*
  Warnings:

  - You are about to drop the column `ruleId` on the `Outcome` table. All the data in the column will be lost.
  - Made the column `outcomeId` on table `Rule` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Outcome" DROP CONSTRAINT "Outcome_ruleId_fkey";

-- DropIndex
DROP INDEX "Outcome_ruleId_key";

-- AlterTable
ALTER TABLE "Outcome" DROP COLUMN "ruleId";

-- AlterTable
ALTER TABLE "Rule" ALTER COLUMN "priority" SET DATA TYPE TEXT,
ALTER COLUMN "outcomeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
