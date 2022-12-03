import { 
    NFLTeam,
    Player,
    PrismaClient, 
    Timeframe,
} from '@prisma/client';

class DatabaseService {

    client: PrismaClient;

    constructor()
    {
        this.client = new PrismaClient();
    }

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
                update: {},
                create: {
                    current_season: season,
                    current_week: week,
                },
            });

            return timeframe;
        }
        catch(e) {
           return null; 
        }
    }

    public async getTimeframe(): Promise<Timeframe>
    {
        try {
            const timeframe = await this.client.timeframe.findFirstOrThrow();

            return timeframe;
        }
        catch(e)
        {
            return null;
        }
    }

    public async clearTimeframes(): Promise<boolean>
    {
        try 
        {
            await this.client.timeframe.deleteMany({});
            return true;
        }
        catch(e) {
            return null; 
        }
    }

    public async setNFLTeams(teams): Promise<NFLTeam[]>
    {
        for(const t of teams)
        {
            try {
                const team: NFLTeam = await this.client.nFLTeam.upsert({
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
            return null;
        }
    }

    public async setPlayers(players): Promise<Player[]>
    {
        for(const p of players)
        {
            try {
                const db_player: Player = await this.client.player.upsert({
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
        const patty = await this.client.player.findFirst({
            where: {
                last_name: 'Mahomes',
            },
        });
        console.log(patty);
    }

    // public async createLeague(): Promise<League>
    // {
    //     try {
    //         const league: League = await this.client.league.create({
    //             data: {
    //                 teams: null,
    //                 commissioner: 0,
    //                 settings: null,
    //             },
    //         });

    //         return league;
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getLeagues(): Promise<League[]>
    // {
    //     try {
    //         return await this.client.league.findMany();
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getLeagueDetails(leagueId: number)
    // {
    //     try {
    //         return await this.client.league.findUnique({
    //             where: { id: leagueId },
    //         });
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getLeagueSettings(leagueId: number)
    // {
    //     try {
    //         return await this.client.leagueSettings.findUnique({
    //             where: { id: leagueId },
    //         });
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getTeamsInLeague(leagueId: number): Promise<Team[]>
    // {
    //     try {
    //         return await this.client.team.findMany({
    //             where: { leagueId: leagueId },
    //         });
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getTeamDetails(teamId: number): Promise<Team>
    // {
    //     try {
    //         return await this.client.team.findUnique({
    //             where: { id: teamId },
    //         });
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getTeamRoster(teamId: number): Promise<Roster>
    // {
    //     try {
    //         // TODO need to add week as well
    //         return await this.client.roster.findUnique({
    //             where: { id: teamId },
    //         });
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }


    // public async getUsersLeagues(userId: number): Promise<League[]>
    // {
    //     try {
    //         // TODO filter the leagues based off the user
    //         return await this.client.league.findMany();
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getUsersTeams(userId: number): Promise<Team[]>
    // {
    //     try {
    //         // TODO filter teams based off user
    //         return await this.client.team.findMany();
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getTeamSchedule(teamId: number): Promise<Matchup[]>
    // {
    //     try {
    //         // TODO
    //         return await this.client.matchup.findMany();
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getLeaguePlayers(leagueId: number)
    // {
    //     try {
    //         // Should this return all rosters or list of players
    //         return await this.client.roster.findMany();
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getLeagueSchedule(leagueId: number): Promise<Matchup[]>
    // {
    //     try {
    //         return await this.client.matchup.findMany();
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async getStandings(leagueId: number): Promise<Team[]>
    // {
    //     try {
    //         return await this.client.team.findMany();
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async submitTransaction()
    // {
    //     try {
    //         return await this.client.league.findMany();
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }

    // public async submitTrade()
    // {
    //     try {
    //         return await this.client.league.findMany();
    //     }
    //     catch(e) {
    //        return null; 
    //     }
    // }



}

export default DatabaseService;