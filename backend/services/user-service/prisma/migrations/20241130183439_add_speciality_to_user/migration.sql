-- AlterTable
ALTER TABLE "User" ADD COLUMN     "speciality" TEXT,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;
