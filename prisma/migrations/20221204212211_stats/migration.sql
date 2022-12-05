-- CreateTable
CREATE TABLE `Timeframe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `current_week` INTEGER NOT NULL,
    `current_season` INTEGER NOT NULL,

    UNIQUE INDEX `Timeframe_current_season_current_week_key`(`current_season`, `current_week`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NFLTeam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `NFLTeam_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` INTEGER NOT NULL,
    `nfl_team_external_id` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `photo_url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Player_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NFLGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` INTEGER NOT NULL,
    `season` INTEGER NOT NULL,
    `week` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `away_team_id` INTEGER NOT NULL,
    `home_team_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `external_score_id` INTEGER NOT NULL,
    `home_score` INTEGER NOT NULL,
    `away_score` INTEGER NOT NULL,

    UNIQUE INDEX `NFLGame_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerGameStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_player_id` INTEGER NOT NULL,
    `external_game_id` INTEGER NOT NULL,
    `pass_yards` DOUBLE NOT NULL,
    `pass_attempts` INTEGER NOT NULL,
    `completions` INTEGER NOT NULL,
    `pass_td` INTEGER NOT NULL,
    `interceptions_thrown` INTEGER NOT NULL,
    `receptions` INTEGER NOT NULL,
    `targets` INTEGER NOT NULL,
    `rec_yards` DOUBLE NOT NULL,
    `rush_yards` DOUBLE NOT NULL,
    `rush_attempts` INTEGER NOT NULL,
    `rush_td` INTEGER NOT NULL,
    `two_point_conversion_passes` INTEGER NOT NULL,
    `two_point_conversion_receptions` INTEGER NOT NULL,
    `two_point_conversion_runs` INTEGER NOT NULL,

    UNIQUE INDEX `PlayerGameStats_external_player_id_key`(`external_player_id`),
    UNIQUE INDEX `PlayerGameStats_external_game_id_key`(`external_game_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `League` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_nfl_team_external_id_fkey` FOREIGN KEY (`nfl_team_external_id`) REFERENCES `NFLTeam`(`external_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NFLGame` ADD CONSTRAINT `NFLGame_away_team_id_fkey` FOREIGN KEY (`away_team_id`) REFERENCES `NFLTeam`(`external_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NFLGame` ADD CONSTRAINT `NFLGame_home_team_id_fkey` FOREIGN KEY (`home_team_id`) REFERENCES `NFLTeam`(`external_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
