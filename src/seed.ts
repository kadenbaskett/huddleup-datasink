import DatabaseService from '@services/database.service';
import StatsService from '@services/stats.service';
import { League, Roster, RosterPlayer, Team, User } from '@prisma/client';

class Seed {

  stats: StatsService;
  db: DatabaseService;

  constructor()
  {
    this.stats = new StatsService();
    this.db = new DatabaseService();
  }

  async seedDB()
  {
    await this.createUsers();
    await this.createLeagues();
    await this.createTeams();
    await this.createRosters();
    await this.createRostersPlayers();
  }

  randomString(start: string)
  {
    return `${start} ${Math.floor(Math.random() * 10)}`;
  }

  async createUsers()
  {
    const users: User[] = [
      {
        id: 1,
        username: 'joe', 
        email: 'joe@gmail.com',
      },
      {
        id: 2,
        username: 'jake', 
        email: 'jake@gmail.com',
      },
      {
        id: 3,
        username: 'kaden', 
        email: 'kaden@gmail.com',
      },
      {
        id: 4,
        username: 'justin', 
        email: 'justin@gmail.com',
      },
   ];

    for(const user of users)
    {
        const resp = await this.db.client.user.upsert({
            where: { 
              id: user.id,
            },
            update: user,
            create: user,
        }); 
        console.log(resp);
    }
  }

  async createLeagues()
  {
    const leagues: League[] = [
      {
          id: 1,
          name: 'Hunter renfroe fan club',
          commissioner_id: 1,
      },
      {
          id: 2,
          name: 'Joe Bidens clique',
          commissioner_id: 2,
      },
        
    ];

    for(const league of leagues)
    {
        const resp = await this.db.client.league.upsert({
            where: { 
              id: league.id,
            },
            update: league,
            create: league,
        }); 
        console.log(resp);
    }
  }

  async createTeams()
  {
    const teams: Team[] = [
      {
          id: 1,
          name: 'Joe team',
          league_id: 1,
          team_settings_id: 1,
      },
      {
          id: 2,
          name: 'Jake team',
          league_id: 1,
          team_settings_id: 2,
      },
    ];

    for(const team of teams)
    {
      const t = await this.db.client.teamSettings.upsert({
            where: { 
              id: team.team_settings_id,
            },
            update: {
              id: team.team_settings_id,
            },
            create: {
              id: team.team_settings_id,
            },
      });

      console.log(t);

        const resp = await this.db.client.team.upsert({
            where: { 
              id: team.id,
            },
            update: team,
            create: team,
        }); 
        console.log(resp);
    }
  }


  async createRosters()
  {
    const rosters: Roster[] = [
      {
          id: 1,
          week: 1,
          teamId: 1,
          season: 2022,
      },
      {
          id: 2,
          week: 1,
          teamId: 1,
          season: 2022,
      },
    ];

    for(const roster of rosters)
    {
        const resp = await this.db.client.roster.upsert({
            where: { 
              id: roster.id,
            },
            update: roster,
            create: roster,
        }); 
        console.log(resp);
    }
  }
  
  async createRostersPlayers()
  {
    const rps: RosterPlayer[] = [
      {
          id: 1,
          external_id: 4314,
          position: 'QB',
          roster_id: 1,
      },
      {
          id: 2,
          external_id: 18877,
          position: 'RB',
          roster_id: 1,
      },
    ];

    for(const r of rps)
    {
        const resp = await this.db.client.rosterPlayer.upsert({
            where: { 
              id: r.id,
            },
            update: r,
            create: r,
        }); 
        console.log(resp);
    }
  }





}





export default Seed;
