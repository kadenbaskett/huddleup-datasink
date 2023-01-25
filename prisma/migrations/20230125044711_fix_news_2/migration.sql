/*
  Warnings:

  - You are about to drop the column `externl_team_id2` on the `news` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `news` DROP COLUMN `externl_team_id2`,
    ADD COLUMN `external_team_id2` INTEGER NULL;
