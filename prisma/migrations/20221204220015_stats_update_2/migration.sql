/*
  Warnings:

  - A unique constraint covering the columns `[external_game_id,external_player_id]` on the table `PlayerGameStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `PlayerGameStats_external_game_id_key` ON `playergamestats`;

-- DropIndex
DROP INDEX `PlayerGameStats_external_player_id_key` ON `playergamestats`;

-- CreateIndex
CREATE UNIQUE INDEX `PlayerGameStats_external_game_id_external_player_id_key` ON `PlayerGameStats`(`external_game_id`, `external_player_id`);
