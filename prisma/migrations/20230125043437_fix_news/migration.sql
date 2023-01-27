-- AlterTable
ALTER TABLE `news` ADD COLUMN `external_player_id2` INTEGER NULL,
    ADD COLUMN `externl_team_id2` INTEGER NULL,
    MODIFY `external_player_id` INTEGER NULL,
    MODIFY `external_team_id` INTEGER NULL;
