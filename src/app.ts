import { NFLGame, NFLTeam, Player, Timeframe } from '@prisma/client';
import { respObj } from '@interfaces/respobj.interface';
import DatabaseService from '@services/database.service';
import StatsService from '@services/stats.service';
import { timeStamp } from 'console';

// TODO create a config file
const config = {
  timeframe: 5000,
  teams: 5000,
  players: 5000,
  schedule: 5000,
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

  startUpdateLoop()
  {
    setInterval(this.updateTimeframes.bind(this), config.timeframe);
    setInterval(this.updateTeams.bind(this), config.teams);
    setInterval(this.updatePlayers.bind(this), config.players);
    setInterval(this.updateSchedule.bind(this), config.schedule);
  }

  async printDatabase()
  {
      const timeframe = await this.db.getTimeframe();
      const teams = await this.db.getNFLTeams();
      const schedule = await this.db.getNFLSchedule();
      const players = await this.db.getPlayers();

      console.log(timeframe[0], teams[0], schedule[0], players[0]);
  }

  async initialUpdate()
  {
    await this.updateTimeframes();
    await this.updateSchedule();
    await this.updateSchedule();
    await this.updatePlayers();

    await this.printDatabase();
  }

  async updateTimeframes()
  {
    const resp = await this.stats.getTimeframe();

    if(resp.data)
    {
      const timeframe = Object(resp.data);
      await this.db.setTimeframe(Number(timeframe.Season), Number(timeframe.Year));
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

          const games: NFLGame[] = data.map(g => {
              return {
                external_id: g.GameKey,
                season: g.Season,
                week: g.Week,
                date: g.Date,
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
                    external_game_id: pg.GameKey,
                    pass_yards: pg.PassingYards,
                    pass_attempts: pg.PassingAttempts,
                    completions: pg.PassingCompletions,
                    pass_td: pg.PassingTouchdowns,
                    interceptions_thrown: pg.PassingInterceptions,
                    receptions: pg.Receptions,
                    rec_yards: pg.ReceivingYards,
                    targets: pg.ReceivingTargets,
                    rush_attempts: pg.RushingAttempts,
                    rush_yards: pg.RushingYards,
                    rush_td: pg.RushingTouchdowns,
                    two_point_conversion_passes: pg.TwoPointConversionPasses,
                    two_point_conversion_runs: pg.TwoPointConversionRuns,
                    two_point_conversion_receptions: pg.TwoPointConversionReceptions,
                  };

                  await this.db.updatePlayerGameStats(gameStats);
              }
            }
        }
      }
  }


}





export default App;
