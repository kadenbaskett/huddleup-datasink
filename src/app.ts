import { NFLTeam, Player, Timeframe } from '@prisma/client';
import DatabaseService from '@services/database.service';
import StatsService from '@services/stats.service';
import { length } from 'class-validator';
import { respObj } from './interfaces/respobj.interface';

const config = {
  timeframe: 5000,
  teams: 5000,
  players: 5000,
  games: 5000,
  gamesInProgress: 5000,
};

class App {

  stats: StatsService;
  db: DatabaseService;

  constructor()
  {
    this.stats = new StatsService();
    this.db = new DatabaseService();
  }

  startUpdates()
  {
    //setInterval(this.updateTimeframes.bind(this), config.timeframe);
    //setInterval(this.updateTeams.bind(this), config.teams);
    setTimeout(this.updatePlayers.bind(this), config.players);
  }

  async updateTimeframes()
  {
    const season = await this.stats.getCurrentSeason();
    const week = await this.stats.getCurrentWeek();
    console.log(season, week);

    if(season.data && week.data)
    {
      await this.db.setTimeframe(Number(season.data), Number(week.data));
    }
  }

  async updateTeams()
  {
    const timeframe: Timeframe = await this.db.getTimeframe();

    if(timeframe)
    {
        const resp: respObj = await this.stats.getNFLTeams(timeframe.current_season);

        if(resp.data)
        {
          const data = Object(resp.data);

          const teams: NFLTeam[] = data.map(team => {
              const db_team = {
                external_id: team.TeamID,
                key: team.Key,
                city: team.City,
                name: team.Name,
              };

              return db_team;
          });

          await this.db.setNFLTeams(teams);
          const updatedTeams = await this.db.getNFLTeams();
          console.log(updatedTeams);
        }
    }
    else
    {
      
    }

  }

  async updatePlayers()
  {
      const resp: respObj = await this.stats.getPlayers();

      if(resp.data)
      {
        const d = Object(resp.data);
        // const data = d.slice(0, 10);
        const data = d;

        const players: Player[] = data.filter(p => p.GlobalTeamID > 0).map(p => {
            const db_player = {
              external_id: p.PlayerID,
              first_name: p.FirstName,
              last_name: p.LastName,
              status: p.Status,
              position: p.Position,
              photo_url: p.PhotoUrl,
              nfl_team_external_id: p.GlobalTeamID,
            };

            return db_player;
        });

        await this.db.setPlayers(players);
      }
  }

  updateGames()
  {
    console.log('update');
  }
  updateGamesInProgress()
  {
    console.log('update games in prog');
  }

}



export default App;
