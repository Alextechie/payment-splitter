/*
  Warnings:

  - You are about to drop the column `type` on the `Rule` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Rule` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Split` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `Split` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `Split` table. All the data in the column will be lost.
  - Added the required column `status` to the `Outcome` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Split` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OutcomeStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "splitType" AS ENUM ('PERCENTAGE', 'FLAT', 'PRIORITY');

-- DropForeignKey
ALTER TABLE "Split" DROP CONSTRAINT "Split_paymentId_fkey";

-- AlterTable
ALTER TABLE "Outcome" DROP COLUMN "status",
ADD COLUMN     "status" "OutcomeStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Rule" DROP COLUMN "type",
DROP COLUMN "value";

-- AlterTable
ALTER TABLE "Split" DROP COLUMN "amount",
DROP COLUMN "paymentId",
DROP COLUMN "percentage",
DROP COLUMN "type",
ADD COLUMN     "type" "splitType" NOT NULL;
