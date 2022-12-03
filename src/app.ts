import DatabaseService from '@services/database.service';
import StatsService from '@services/stats.service';

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
    setInterval(this.updateTimeframes.bind(this), config.timeframe);
  }

  async updateTimeframes()
  {
    const season = await this.stats.getCurrentSeason();
    const week = await this.stats.getCurrentWeek();
    console.log(season, week);

    if(season.data && week.data)
    {
      const timeframe = await this.db.setTimeframe(Number(season.data), Number(week.data));
    }
  }

  updateTeams()
  {
    const teams = this.stats.getNFLTeams();
    console.log(teams);
  }

  updateGames()
  {
    console.log('update');
  }

  updatePlayerDetails()
  {
    console.log('update player');
  }

  updateGamesInProgress()
  {
    console.log('update games in prog');
  }

}



export default App;
