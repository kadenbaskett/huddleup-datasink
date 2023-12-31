-- CreateTable
CREATE TABLE `League` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `commissioner_id` INTEGER NOT NULL,
    `settings_id` INTEGER NOT NULL,

    UNIQUE INDEX `League_token_key`(`token`),
    UNIQUE INDEX `League_settings_id_key`(`settings_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeagueSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `num_teams` INTEGER NOT NULL,
    `public_join` BOOLEAN NOT NULL,
    `min_players` INTEGER NOT NULL,
    `max_players` INTEGER NOT NULL,
    `draft_settings_id` INTEGER NOT NULL,
    `roster_settings_id` INTEGER NOT NULL,
    `scoring_settings_id` INTEGER NOT NULL,
    `waiver_settings_id` INTEGER NOT NULL,
    `trade_settings_id` INTEGER NOT NULL,
    `schedule_settings_id` INTEGER NOT NULL,

    UNIQUE INDEX `LeagueSettings_draft_settings_id_key`(`draft_settings_id`),
    UNIQUE INDEX `LeagueSettings_roster_settings_id_key`(`roster_settings_id`),
    UNIQUE INDEX `LeagueSettings_scoring_settings_id_key`(`scoring_settings_id`),
    UNIQUE INDEX `LeagueSettings_waiver_settings_id_key`(`waiver_settings_id`),
    UNIQUE INDEX `LeagueSettings_trade_settings_id_key`(`trade_settings_id`),
    UNIQUE INDEX `LeagueSettings_schedule_settings_id_key`(`schedule_settings_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DraftSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `seconds_per_pick` INTEGER NOT NULL,
    `order_generation_type` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DraftOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pick_number` INTEGER NOT NULL,
    `draft_settings_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RosterSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `num_qb` INTEGER NOT NULL,
    `num_rb` INTEGER NOT NULL,
    `num_wr` INTEGER NOT NULL,
    `num_te` INTEGER NOT NULL,
    `num_flex` INTEGER NOT NULL,
    `roster_size_limit` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TradeSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trade_deadline` DATETIME(3) NULL,
    `review_period_hours` INTEGER NOT NULL,
    `votes_to_veto_trade` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScoringSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `points_per_reception` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduleSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_week` INTEGER NOT NULL,
    `end_week` INTEGER NOT NULL,
    `playoff_start_week` INTEGER NOT NULL,
    `playoff_end_week` INTEGER NOT NULL,
    `num_playoff_teams` INTEGER NOT NULL,
    `weeks_per_playoff_matchup` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WaiverSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `waiver_period_hours` INTEGER NOT NULL,
    `waiver_order_type` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserToTeam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `is_captain` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `league_id` INTEGER NOT NULL,
    `team_settings_id` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Team_team_settings_id_key`(`team_settings_id`),
    UNIQUE INDEX `Team_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Matchup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `week` INTEGER NOT NULL,
    `league_id` INTEGER NOT NULL,
    `home_team_id` INTEGER NOT NULL,
    `away_team_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `week` INTEGER NOT NULL,
    `season` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RosterPlayer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` INTEGER NOT NULL,
    `player_id` INTEGER NULL,
    `position` VARCHAR(191) NOT NULL,
    `roster_id` INTEGER NULL,

    UNIQUE INDEX `RosterPlayer_player_id_roster_id_key`(`player_id`, `roster_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionPlayer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `joins_proposing_team` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `creation_date` DATETIME(3) NOT NULL,
    `expiration_date` DATETIME(3) NOT NULL,
    `execution_date` DATETIME(3) NOT NULL,
    `week` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL DEFAULT 0,
    `proposing_team_id` INTEGER NOT NULL DEFAULT 0,
    `related_team_id` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionAction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` INTEGER NOT NULL DEFAULT 0,
    `user_id` INTEGER NOT NULL DEFAULT 0,
    `action_date` DATETIME(3) NOT NULL,
    `action_type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` INTEGER NOT NULL,
    `updated_date` VARCHAR(191) NOT NULL,
    `time_posted` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGBLOB NOT NULL,
    `external_player_id` INTEGER NULL,
    `external_player_id2` INTEGER NULL,
    `external_team_id` INTEGER NULL,
    `external_team_id2` INTEGER NULL,
    `source` VARCHAR(191) NULL,
    `source_url` VARCHAR(191) NULL,

    UNIQUE INDEX `News_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Timeframe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `week` INTEGER NOT NULL,
    `season` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,
    `has_started` BOOLEAN NOT NULL,
    `has_ended` BOOLEAN NOT NULL,

    UNIQUE INDEX `Timeframe_season_week_type_key`(`season`, `week`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NFLTeam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `season` INTEGER NOT NULL,

    UNIQUE INDEX `NFLTeam_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `photo_url` VARCHAR(191) NOT NULL,
    `current_nfl_team_external_id` INTEGER NOT NULL,

    UNIQUE INDEX `Player_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NFLGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_id` INTEGER NOT NULL,
    `season` INTEGER NOT NULL,
    `week` INTEGER NOT NULL,
    `external_score_id` INTEGER NOT NULL,
    `home_score` INTEGER NOT NULL,
    `away_score` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `away_team_id` INTEGER NOT NULL,
    `home_team_id` INTEGER NOT NULL,

    UNIQUE INDEX `NFLGame_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerGameStats` (
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

    UNIQUE INDEX `PlayerGameStats_external_game_id_external_player_id_key`(`external_game_id`, `external_player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `League` ADD CONSTRAINT `League_commissioner_id_fkey` FOREIGN KEY (`commissioner_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `League` ADD CONSTRAINT `League_settings_id_fkey` FOREIGN KEY (`settings_id`) REFERENCES `LeagueSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeagueSettings` ADD CONSTRAINT `LeagueSettings_draft_settings_id_fkey` FOREIGN KEY (`draft_settings_id`) REFERENCES `DraftSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeagueSettings` ADD CONSTRAINT `LeagueSettings_roster_settings_id_fkey` FOREIGN KEY (`roster_settings_id`) REFERENCES `RosterSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeagueSettings` ADD CONSTRAINT `LeagueSettings_scoring_settings_id_fkey` FOREIGN KEY (`scoring_settings_id`) REFERENCES `ScoringSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeagueSettings` ADD CONSTRAINT `LeagueSettings_waiver_settings_id_fkey` FOREIGN KEY (`waiver_settings_id`) REFERENCES `WaiverSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeagueSettings` ADD CONSTRAINT `LeagueSettings_trade_settings_id_fkey` FOREIGN KEY (`trade_settings_id`) REFERENCES `TradeSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeagueSettings` ADD CONSTRAINT `LeagueSettings_schedule_settings_id_fkey` FOREIGN KEY (`schedule_settings_id`) REFERENCES `ScheduleSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DraftOrder` ADD CONSTRAINT `DraftOrder_draft_settings_id_fkey` FOREIGN KEY (`draft_settings_id`) REFERENCES `DraftSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DraftOrder` ADD CONSTRAINT `DraftOrder_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserToTeam` ADD CONSTRAINT `UserToTeam_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserToTeam` ADD CONSTRAINT `UserToTeam_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_league_id_fkey` FOREIGN KEY (`league_id`) REFERENCES `League`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_team_settings_id_fkey` FOREIGN KEY (`team_settings_id`) REFERENCES `TeamSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matchup` ADD CONSTRAINT `Matchup_league_id_fkey` FOREIGN KEY (`league_id`) REFERENCES `League`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matchup` ADD CONSTRAINT `Matchup_home_team_id_fkey` FOREIGN KEY (`home_team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matchup` ADD CONSTRAINT `Matchup_away_team_id_fkey` FOREIGN KEY (`away_team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Roster` ADD CONSTRAINT `Roster_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RosterPlayer` ADD CONSTRAINT `RosterPlayer_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RosterPlayer` ADD CONSTRAINT `RosterPlayer_roster_id_fkey` FOREIGN KEY (`roster_id`) REFERENCES `Roster`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionPlayer` ADD CONSTRAINT `TransactionPlayer_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionPlayer` ADD CONSTRAINT `TransactionPlayer_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_proposing_team_id_fkey` FOREIGN KEY (`proposing_team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_related_team_id_fkey` FOREIGN KEY (`related_team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionAction` ADD CONSTRAINT `TransactionAction_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionAction` ADD CONSTRAINT `TransactionAction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_current_nfl_team_external_id_fkey` FOREIGN KEY (`current_nfl_team_external_id`) REFERENCES `NFLTeam`(`external_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NFLGame` ADD CONSTRAINT `NFLGame_away_team_id_fkey` FOREIGN KEY (`away_team_id`) REFERENCES `NFLTeam`(`external_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NFLGame` ADD CONSTRAINT `NFLGame_home_team_id_fkey` FOREIGN KEY (`home_team_id`) REFERENCES `NFLTeam`(`external_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerGameStats` ADD CONSTRAINT `PlayerGameStats_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `NFLTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerGameStats` ADD CONSTRAINT `PlayerGameStats_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerGameStats` ADD CONSTRAINT `PlayerGameStats_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `NFLGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerProjections` ADD CONSTRAINT `PlayerProjections_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `NFLTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerProjections` ADD CONSTRAINT `PlayerProjections_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerProjections` ADD CONSTRAINT `PlayerProjections_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `NFLGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
