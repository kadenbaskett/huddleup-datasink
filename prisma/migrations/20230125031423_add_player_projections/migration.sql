-- CreateTable
CREATE TABLE `PlayerProjections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_player_id` INTEGER NOT NULL,
    `external_game_id` INTEGER NOT NULL,
    `pass_yards` INTEGER NOT NULL,
    `pass_attempts` INTEGER NOT NULL,
    `completions` INTEGER NOT NULL,
    `pass_td` INTEGER NOT NULL,
    `interceptions_thrown` INTEGER NOT NULL,
    `fumbles` INTEGER NOT NULL,
    `receptions` INTEGER NOT NULL,
    `targets` INTEGER NOT NULL,
    `rec_yards` INTEGER NOT NULL,
    `rec_td` INTEGER NOT NULL,
    `rush_yards` INTEGER NOT NULL,
    `rush_attempts` INTEGER NOT NULL,
    `rush_td` INTEGER NOT NULL,
    `two_point_conversion_passes` INTEGER NOT NULL,
    `two_point_conversion_receptions` INTEGER NOT NULL,
    `two_point_conversion_runs` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `game_id` INTEGER NOT NULL,

    UNIQUE INDEX `PlayerProjections_external_game_id_external_player_id_key`(`external_game_id`, `external_player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlayerProjections` ADD CONSTRAINT `PlayerProjections_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `NFLTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerProjections` ADD CONSTRAINT `PlayerProjections_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerProjections` ADD CONSTRAINT `PlayerProjections_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `NFLGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
