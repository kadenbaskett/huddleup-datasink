/*
  Warnings:

  - A unique constraint covering the columns `[current_season,current_week]` on the table `Timeframe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Timeframe_current_season_current_week_key` ON `Timeframe`(`current_season`, `current_week`);
