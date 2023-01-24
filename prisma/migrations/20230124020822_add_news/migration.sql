-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` INTEGER NOT NULL,
    `updated_date` VARCHAR(191) NOT NULL,
    `time_posted` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGBLOB NOT NULL,
    `external_player_id` INTEGER NOT NULL,
    `external_team_id` INTEGER NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `source_url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `News_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
