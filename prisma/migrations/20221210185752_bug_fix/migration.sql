-- DropForeignKey
ALTER TABLE `playergamestats` DROP FOREIGN KEY `PlayerGameStats_team_id_fkey`;

-- AddForeignKey
ALTER TABLE `PlayerGameStats` ADD CONSTRAINT `PlayerGameStats_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `NFLTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
