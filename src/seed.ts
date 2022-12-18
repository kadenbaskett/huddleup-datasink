import { PrismaClient } from '@prisma/client';
import { crossOriginResourcePolicy } from 'helmet';


/*
 *  Seeds the database with mock data. The simulate league function will
 *  create new users, leagues, teams, rosters, and roster players
 */
class Seed {

  client: PrismaClient;

  constructor()
  {
    this.client = new PrismaClient();
  }

  async seedDB()
  {
    await this.clearLeagueStuff();

    const numLeagues = 3;
    const numUsers = 12;
    const users = await this.createUsers(numUsers);
    const leagueNames = this.generateLeagueNames(numLeagues);

    for(let i = 0; i < leagueNames.length; i++)
    {
      const commish = users[Math.floor(Math.random() * users.length)]; 
      await this.simulateLeague(users, leagueNames[i], commish);
    }
  }

  async clearLeagueStuff()
  {
    // The order that the tables are cleared in is important
    // We can't clear a table that is referenced by another table using a foreign key without first clearing
    // the table that references it
    await this.client.rosterPlayer.deleteMany();
    await this.client.roster.deleteMany();
    await this.client.userToTeam.deleteMany();
    await this.client.team.deleteMany();
    await this.client.teamSettings.deleteMany();
    await this.client.league.deleteMany();
    await this.client.user.deleteMany();

    console.log('Cleared db successfully of old league data');
  }

  async simulateLeague(users, name, commish)
  {
    const numTeams = 12;
    const weeks = 18;
    const season = 2022;
    const teamNames = this.generateTeamNames(numTeams);
    console.log(commish);

    const league = await this.createLeague(name, commish.id);
    const teams = await this.createTeams(league, users, teamNames);

    console.log(teams);

    for(let week = 1; week <= weeks; week++)
    {
      console.log('WEEK ' + week);

      let playerIdsUsed = [];
      let weekRosters = [];

      for(const team of teams)
      {
        const roster = await this.buildRandomRoster(week, team.id, season, playerIdsUsed);
        if(roster.players)
        {
          const rosterPlayerIds = roster.players.map(p => p.external_id);
          playerIdsUsed = playerIdsUsed.concat(rosterPlayerIds);
        }

        weekRosters = weekRosters.concat(roster);
      }

      console.log(JSON.stringify(weekRosters, null, 2));
    }
  }

  async createUsers(numUsers)
  {
   const userNames = await this.createUsernames(numUsers);
   const users = [];

   for(const name of userNames)
   {
      const u = {
        username: name,
        email: `${name}@gmail.com`,
      };
      users.push(u);
   }

   const createdUsers = [];

    for(const user of users)
    {
        const resp = await this.client.user.create({
            data: user,
        }); 
        createdUsers.push(resp);
    }

    return createdUsers;
  }

  async createLeague(name, commishID)
  {
    const league = {
        name: name,
        commissioner_id: commishID,
    };

    const resp = await this.client.league.create({
      data: league,
    }); 

    return resp;
  }

  async createTeams(league, users, teamNames)
  {
    const teams = [];

    for(let i = 0; i < teamNames.length; i++)
    {
      const ts = await this.client.teamSettings.create({
        data: {},
      });

      const team = {
          name: teamNames[i],
          league_id: league.id,
          team_settings_id: ts.id,
      };

      const resp = await this.client.team.create({
        data: team,
      }); 

      await this.client.userToTeam.create({
        data: {
          team_id: resp.id,
          user_id: users[i].id,
          is_captain: true,
        },
      });

      teams.push(resp);
    }

    return teams;
  }


  async buildRandomRoster(week, team_id, season, playerIdsUsed)
  {
    const r = {
        week,
        team_id,
        season,
    };

    const roster = await this.client.roster.create({
      data: r,
    }); 

    const constraints = {
      'QB': 1,
      'RB': 2,
      'WR': 3,
      'TE': 1,
      'FLEX': 1,
      'TOTAL': 15,
    };

    const allowedPositions = [ 'RB', 'WR', 'TE', 'QB', 'K' ];
    const flexPositions = [ 'RB', 'WR', 'TE' ];
    const players = await this.client.player.findMany();
    this.shuffleArray(players);

    for(const p of players)
    {
      const rp = {
        external_id: p.external_id,
        position: p.position,
        roster_id: roster.id,
        player_id: p.id,
      };

      if(playerIdsUsed.includes(rp.external_id) || !allowedPositions.includes(p.position))
      {
        // Skip the player if someone owns them already
        continue;
      }
      else if(constraints[p.position])
      {
        await this.client.rosterPlayer.create({
          data: rp,
        });

        constraints[rp.position]--;
      }
      else if (constraints['FLEX'] && flexPositions.includes(p.position))
      {
        rp.position = 'FLEX';

        await this.client.rosterPlayer.create({
          data: rp,
        });

        constraints[rp.position]--;
      }
      else if(constraints['TOTAL'] && allowedPositions.includes(p.position))
      {
        rp.position = 'BE';

        await this.client.rosterPlayer.create({
          data: rp,
        });

        constraints[rp.position]--;
      }
        
      constraints['TOTAL']--;

      if(!constraints['TOTAL'])
      {
        break;
      }
    }

    const created = this.client.roster.findFirstOrThrow({
      where: {
        id: roster.id,
      },
      include: {
        players: true,
      },
    });

    return created;
  }


  // Helper methods that don't interact with the database

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ array[i], array[j] ] = [ array[j], array[i] ];
    }
  }

  generateTeamNames(numTeams)
  {
    const names = [];
    const rand = Math.round(Math.random() * 1000);

    for(let i = 0; i < numTeams; i++)
    {
      names.push('Team ' + i * rand);
    }

    return names;
  }

  createUsernames(num)
  {
    const base = 'user';
    const users = [];

    for(let i = 0; i < num; i++)
    {
      users.push(`${base}${i}`);
    }

    return users;
  }

  generateLeagueNames(numLeagues)
  {
    const names = [];
    const rand = Math.round(Math.random() * 1000);

    for(let i = 0; i < numLeagues; i++)
    {
      names.push('League ' + i * rand);
    }

    return names;
  }




}





export default Seed;