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
  allowedPositions: [ 'QB', 'RB', 'WR', 'TE' ],
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
      const timeframes = await this.db.getTimeframe();
      console.log('Timeframe: ', timeframes);
      const teams = await this.db.getNFLTeams();
      console.log('Teams: ', teams[0]);
      const schedule = await this.db.getAllNFLGames();
      console.log('Schedule: ', schedule[0]);
      const players = await this.db.getPlayers();
      console.log('Players: ', players[0]);
      const stats = await this.db.getAllPlayerStats();
  }

  async clearDB()
  {
    console.log('Clearing the database before initial update');
    await this.db.client.timeframe.deleteMany();
    await this.db.client.playerGameStats.deleteMany();
    await this.db.client.nFLGame.deleteMany();
    await this.db.client.player.deleteMany();
    await this.db.client.nFLTeam.deleteMany();
  }

  async initialUpdate()
  {
    await this.clearDB();

    console.log('Adding all NFL teams, schedules, and players to the db...');
    await this.updateTimeframes();
    await this.updateTeams();
    await this.updateSchedule();
    await this.updatePlayers();
    console.log('Adding all NFL games to the db...');
    await this.updateCompletedGames();
    console.log('Updaing game scores and player stats...');
    await this.updateGameScoresAndPlayerStats();

    await this.printDatabase();
  }

  async updateTimeframes()
  {
    const resp = await this.stats.getTimeframes();

    if(resp.data)
    {
      const timeframes = Object(resp.data);
      await this.db.setTimeframes(timeframes);
    }
  }

  async updateTeams()
  {
    const timeframe: Timeframe = await this.db.getTimeframe();

    if(timeframe)
    {
        const resp: respObj = await this.stats.getNFLTeams(timeframe.season);

        if(resp.data)
        {
          const data = Object(resp.data);

          const teams = data.map(team => {
              return {
                external_id: team.TeamID,
                key: team.Key,
                city: team.City,
                name: team.Name,
                season: timeframe.season,
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

        const players: Player[] = data.filter(p => p.GlobalTeamID > 0 && config.allowedPositions.includes(p.Position)).map(p => {
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
        const resp: respObj = await this.stats.getSchedules(timeframe.season);

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


  async updateCompletedGames()
  {
      const gamesCompleted = await this.db.getCompletedGames();

      if(gamesCompleted.length)
      {
        for(const game of gamesCompleted)
        {
            const resp: respObj = await this.stats.getBoxScore(game.external_score_id);

            if(resp.data)
            {
              const boxScore = Object(resp.data);
              
              const game = await this.db.updateScore(Number(boxScore.Score.GameKey), boxScore.Score.homeScore, boxScore.Score.AwayScore);

              for(const pg of boxScore.PlayerGames)
              {
                  const playerId = await this.db.externalToInternalPlayer(pg.PlayerID);
                  const teamId = await this.db.externalToInternalNFLTeam(Number(pg.GlobalTeamID));

                  if(playerId)
                  {
                    // Have to use Math.floor to convert floats to Int becuase the data is scrambled
                    const gameStats = {
                      external_player_id: pg.PlayerID,
                      external_game_id: Number(pg.GameKey),
                      player_id: playerId,
                      team_id: teamId,
                      game_id: game.id,
                      pass_yards: Math.floor(pg.PassingYards),
                      pass_attempts: Math.floor(pg.PassingAttempts),
                      completions: Math.floor(pg.PassingCompletions),
                      pass_td: Math.floor(pg.PassingTouchdowns),
                      interceptions_thrown: Math.floor(pg.PassingInterceptions),
                      fumbles: Math.floor(pg.Fumbles),
                      receptions: Math.floor(pg.Receptions),
                      rec_td: Math.floor(pg.ReceivingTouchdowns),
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
              
              const game = await this.db.updateScore(Number(boxScore.Score.GameKey), boxScore.Score.homeScore, boxScore.Score.AwayScore);

              for(const pg of boxScore.PlayerGames)
              {
                  const playerId = await this.db.externalToInternalPlayer(pg.PlayerID);
                  const teamId = await this.db.externalToInternalNFLTeam(Number(pg.TeamID));

                  if(playerId)
                  {
                    // Have to use Math.floor to convert floats to Int becuase the data is scrambled
                    const gameStats = {
                      external_player_id: pg.PlayerID,
                      external_game_id: Number(pg.GameKey),
                      player_id: playerId,
                      team_id: teamId,
                      game_id: game.id,
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
}

export default App;
