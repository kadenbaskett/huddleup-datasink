import { 
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
        //this.clearTimeframes();
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

            const tf = await this.client.timeframe.findMany();
            console.log(tf);

            return timeframe;
        }
        catch(e) {
           return null; 
        }
    }


    public async clearTimeframes(): Promise<boolean>
    {
        try 
        {
            const deleteTimeframes = await this.client.timeframe.deleteMany({});
            console.log(deleteTimeframes);

            return true;
        }
        catch(e) {
            return null; 
        }
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