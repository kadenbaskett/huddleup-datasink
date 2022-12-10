/*
  Warnings:

  - Added the required column `name` to the `League` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `league` ADD COLUMN `name` VARCHAR(191) NOT NULL;
