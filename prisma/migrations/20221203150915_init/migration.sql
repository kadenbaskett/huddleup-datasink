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

    UNIQUE INDEX `NFLGame_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `League` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_nfl_team_external_id_fkey` FOREIGN KEY (`nfl_team_external_id`) REFERENCES `NFLTeam`(`external_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
