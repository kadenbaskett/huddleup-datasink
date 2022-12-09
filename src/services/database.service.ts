import { 
    NFLGame,
    NFLTeam,
    Player,
    PrismaClient, 
    Timeframe,
    PlayerGameStats,
} from '@prisma/client';

class DatabaseService {

    client: PrismaClient;

    constructor()
    {
        this.client = new PrismaClient();
    }

    // ***************** SETTERS ******************

    public async setTimeframe(season: number, week: number): Promise<Timeframe>
    {
        try 
        {
            const timeframe: Timeframe = await this.client.timeframe.upsert({
                where: { 
                    current_season_current_week: { 
                        current_season: season,
                        current_week: week,
                    },
                 },
                update: {}, // Don't update if the current season and week match
                create: {
                    current_season: season,
                    current_week: week,
                },
            });

            return timeframe;
        }
        catch(e) {
           console.log(e);
           return null; 
        }
    }

    public async setNFLTeams(teams): Promise<NFLTeam[]>
    {
        for(const t of teams)
        {
            try {
                await this.client.nFLTeam.upsert({
                    where: { 
                        external_id: t.external_id,
                    },
                    update: {
                        external_id: t.external_id,
                        name: t.name,
                        key: t.key,
                        city: t.city,
                    },
                    create: {
                        external_id: t.external_id,
                        name: t.name,
                        key: t.key,
                        city: t.city,
                    },
                }); 
            }
            catch(e)
            {
                console.log(e);
                console.log(t);
                return null;
            }
        } 
    }


    public async setPlayers(players): Promise<Player[]>
    {
        for(const p of players)
        {
            try {
                await this.client.player.upsert({
                    where: { 
                        external_id: p.external_id,
                    },
                    update: {
                        external_id: p.external_id,
                        first_name: p.first_name,
                        last_name: p.last_name,
                        status: p.status,
                        position: p.position,
                        photo_url: p.photo_url,
                        nfl_team_external_id: p.nfl_team_external_id,
                    },
                    create: {
                        external_id: p.external_id,
                        first_name: p.first_name,
                        last_name: p.last_name,
                        status: p.status,
                        position: p.position,
                        photo_url: p.photo_url,
                        nfl_team_external_id: p.nfl_team_external_id,
                    },
                }); 

            }
            catch(e)
            {
                console.log(e);
                console.log(p);
                return null;
            }
        } 
    }

    public async getNFLTeams(): Promise<NFLTeam[]>
    {
        try {
            const teams = this.client.nFLTeam.findMany();

            return teams;
        }
        catch(e)
        {
            console.log(e);
            return null;
        }
    }

    public async setNFLSchedule(games): Promise<NFLGame[]>
    {
        for(const g of games)
        {
            try {
                await this.client.nFLGame.upsert({
                    where: { 
                        external_id: g.external_id,
                    },
                    update: {
                        external_id: g.external_id,
                        season: g.season,
                        week: g.week,
                        date: g.date,
                        away_team_id: g.away_team_id,
                        home_team_id: g.home_team_id,
                        status: g.status,
                        external_score_id: g.external_score_id,
                    },
                    create: {
                        external_id: g.external_id,
                        season: g.season,
                        week: g.week,
                        date: g.date,
                        away_team_id: g.away_team_id,
                        home_team_id: g.home_team_id,
                        status: g.status,
                        external_score_id: g.external_score_id,
                        home_score: 0,
                        away_score: 0,
                    },
                }); 

            }
            catch(e)
            {
                console.log(e);
                console.log(g);
                return null;
            }
        } 
    }

    public async updateScore(external_game_id: number, home_score: number, away_score: number)
    {
        try {
            await this.client.nFLGame.update({
                where: { 
                    external_id: external_game_id,
                },
                data: {
                    home_score: home_score,
                    away_score: away_score,
                },
            }); 
        }
        catch(e)
        {
            console.log(external_game_id, home_score, away_score);
            console.log(e);
        }
    }

    public async updatePlayerGameStats(gameStats)
    {
        try {
            await this.client.playerGameStats.upsert({
                where: {
                    external_game_id_external_player_id: {
                        external_game_id: gameStats.external_game_id,
                        external_player_id: gameStats.external_player_id,
                    },
                },
                update: {
                    external_game_id: gameStats.external_game_id,
                    external_player_id: gameStats.external_player_id,
                    pass_yards: gameStats.pass_yards,
                    pass_attempts: gameStats.pass_attempts,
                    completions: gameStats.completions,
                    pass_td: gameStats.pass_td,
                    interceptions_thrown: gameStats.interceptions_thrown,
                    receptions: gameStats.receptions,
                    rec_yards: gameStats.rec_yards,
                    targets: gameStats.targets,
                    rush_attempts: gameStats.rush_attempts,
                    rush_yards: gameStats.rush_yards,
                    rush_td: gameStats.rush_td,
                    two_point_conversion_passes: gameStats.two_point_conversion_passes,
                    two_point_conversion_runs: gameStats.two_point_conversion_runs,
                    two_point_conversion_receptions: gameStats.two_point_conversion_runs,
                },
                create: {
                    external_game_id: gameStats.external_game_id,
                    external_player_id: gameStats.external_player_id,
                    pass_yards: gameStats.pass_yards,
                    pass_attempts: gameStats.pass_attempts,
                    completions: gameStats.completions,
                    pass_td: gameStats.pass_td,
                    interceptions_thrown: gameStats.interceptions_thrown,
                    receptions: gameStats.receptions,
                    rec_yards: gameStats.rec_yards,
                    targets: gameStats.targets,
                    rush_attempts: gameStats.rush_attempts,
                    rush_yards: gameStats.rush_yards,
                    rush_td: gameStats.rush_td,
                    two_point_conversion_passes: gameStats.two_point_conversion_passes,
                    two_point_conversion_runs: gameStats.two_point_conversion_runs,
                    two_point_conversion_receptions: gameStats.two_point_conversion_runs,
                },
            });
        }
        catch(e)
        {
            console.log(gameStats);
            console.log(e);
        }
    }

    // ***************** GETTERS ******************

    public async getPlayers(): Promise<Player[]>
    {
        try {
            return await this.client.player.findMany();
        }
        catch(e)
        {
            console.log(e);
            return null;
        }
    }

    public async getTimeframe(): Promise<Timeframe>
    {
        try {
            return await this.client.timeframe.findFirst();
        }
        catch(e)
        {
            console.log(e);
            return null;
        }
    }


    public async getAllNFLGames(): Promise<NFLGame[]>
    {
        try {
            return this.client.nFLGame.findMany();
        }
        catch(e)
        {
            console.log(e);
            return null;
        }
    }

    public async getAllPlayerStats(): Promise<PlayerGameStats[]>
    {
        try {
            return this.client.playerGameStats.findMany();
        }
        catch(e)
        {
            console.log(e);
            return null;
        }
    }

    public async getGamesInProgress(): Promise<NFLGame[]>
    {
        try {
            const games = this.client.nFLGame.findMany({
                where: { status: 'InProgress' },
            });

            return games;
        }
        catch(e)
        {
            console.log(e);
            return null;
        }
    }


    public async getCompletedGames(): Promise<NFLGame[]>
    {
        try {
            const games = this.client.nFLGame.findMany({
                where: { status: 'Final' },
            });

            return games;
        }
        catch(e)
        {
            console.log(e);
            return null;
        }
    }



}

export default DatabaseService;