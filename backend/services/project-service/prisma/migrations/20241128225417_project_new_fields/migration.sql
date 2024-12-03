/*
  Warnings:

  - Added the required column `amount` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "start_date" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
