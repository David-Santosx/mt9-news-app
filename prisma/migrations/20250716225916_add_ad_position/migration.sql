/*
  Warnings:

  - Added the required column `position` to the `Advertisement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdPosition" AS ENUM ('HEADER', 'HIGHLIGHT');

-- AlterTable
ALTER TABLE "Advertisement" ADD COLUMN     "position" "AdPosition" NOT NULL;
