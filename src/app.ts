import { NFLGame, NFLTeam, Player, Timeframe } from '@prisma/client';
import { respObj } from '@interfaces/respobj.interface';
import DatabaseService from '@services/database.service';
import StatsService from '@services/stats.service';

const hoursToMilliseconds = (hours) => {
  return hours * 60 * 60 * 1000;
};

// TODO create a config file
const config = {
  timeframe: hoursToMilliseconds(1),
  teams: hoursToMilliseconds(1),
  players: hoursToMilliseconds(1),
  schedule: hoursToMilliseconds(1),
  gamesInProgress: 60000, // Update once a minute
};


class App {

  stats: StatsService;
  db: DatabaseService;

  constructor()
  {
    this.stats = new StatsService();
    this.db = new DatabaseService();
  }

  startUpdateLoop()
  {
    setInterval(this.updateTimeframes.bind(this), config.timeframe);
    setInterval(this.updateTeams.bind(this), config.teams);
    setInterval(this.updatePlayers.bind(this), config.players);
    setInterval(this.updateSchedule.bind(this), config.schedule);
    setInterval(this.updateGameScoresAndPlayerStats.bind(this), config.gamesInProgress);
  }

  async printDatabase()
  {
      const timeframe = await this.db.getTimeframe();
      console.log('Timeframe: ', timeframe);
      const teams = await this.db.getNFLTeams();
      console.log('Teams: ', teams);
      const schedule = await this.db.getNFLSchedule();
      console.log('Schedule: ', schedule);
      const players = await this.db.getPlayers();
      console.log('Players: ', players);
  }

  async initialUpdate()
  {
    await this.updateTimeframes();
    await this.updateTeams();
    await this.updateSchedule();
    await this.updatePlayers();
    //await this.updateGameScoresAndPlayerStats();

    //await this.printDatabase();
  }

  async updateTimeframes()
  {
    const resp = await this.stats.getTimeframe();

    if(resp.data)
    {
      const timeframe = Object(resp.data[0]);
      await this.db.setTimeframe(Number(timeframe.Season), Number(timeframe.Week));
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

          const teams = data.map(team => {
              return {
                external_id: team.TeamID,
                key: team.Key,
                city: team.City,
                name: team.Name,
              };
            });
          
          await this.db.setNFLTeams(teams);
        }
    }
  }

  async updatePlayers()
  {
      const resp: respObj = await this.stats.getPlayers();

      if(resp.data)
      {
        const data = Object(resp.data);

        const players: Player[] = data.filter(p => p.GlobalTeamID > 0).map(p => {
            return {
              external_id: p.PlayerID,
              first_name: p.FirstName,
              last_name: p.LastName,
              status: p.Status,
              position: p.Position,
              photo_url: p.PhotoUrl,
              nfl_team_external_id: p.GlobalTeamID,
            };
        });

        await this.db.setPlayers(players);
      }
  }


  async updateSchedule() {

    const timeframe: Timeframe = await this.db.getTimeframe();

    if(timeframe)
    {
        const resp: respObj = await this.stats.getSchedules(timeframe.current_season);

        if(resp.data)
        {
          const data = Object(resp.data);

          const games: NFLGame[] = data.filter(g => g.GameKey).map(g => {

              return {
                external_id: Number(g.GameKey),
                season: g.Season,
                week: g.Week,
                date: new Date(g.Date),
                away_team_id: g.GlobalAwayTeamID,
                home_team_id: g.GlobalHomeTeamID,
                status: g.Status,
                external_score_id: g.ScoreID,
              };
          });

          await this.db.setNFLSchedule(games);
        }
    }
  }

  async updateGameScoresAndPlayerStats()
  {
      const gamesInProgress = await this.db.getGamesInProgress();

      if(gamesInProgress.length)
      {
        for(const game of gamesInProgress)
        {
            const resp: respObj = await this.stats.getBoxScore(game.external_score_id);

            if(resp.data)
            {
              const boxScore = Object(resp.data);
              
              await this.db.updateScore(boxScore.GameKey, boxScore.homeScore, boxScore.AwayScore);

              for(const pg of boxScore.PlayerGames)
              {
                  const gameStats = {
                    external_player_id: pg.PlayerID,
                    external_game_id: Number(pg.GameKey),
                    pass_yards: Math.floor(pg.PassingYards),
                    pass_attempts: Math.floor(pg.PassingAttempts),
                    completions: Math.floor(pg.PassingCompletions),
                    pass_td: Math.floor(pg.PassingTouchdowns),
                    interceptions_thrown: Math.floor(pg.PassingInterceptions),
                    receptions: Math.floor(pg.Receptions),
                    rec_yards: Math.floor(pg.ReceivingYards),
                    targets: Math.floor(pg.ReceivingTargets),
                    rush_attempts: Math.floor(pg.RushingAttempts),
                    rush_yards: Math.floor(pg.RushingYards),
                    rush_td: Math.floor(pg.RushingTouchdowns),
                    two_point_conversion_passes: Math.floor(pg.TwoPointConversionPasses),
                    two_point_conversion_runs: Math.floor(pg.TwoPointConversionRuns),
                    two_point_conversion_receptions: Math.floor(pg.TwoPointConversionReceptions),
                  };

                  await this.db.updatePlayerGameStats(gameStats);
              }
            }
        }
      }
  }


}





export default App;
