
class App {

  constructor() {
  }

  startUpdates()
  {
    setInterval(this.updateTimeframes, 5000);
  }

  updateTimeframes()
  {
    console.log("update");
  }

  updateTeams()
  {
    console.log("update");
  }

  updateGames()
  {
    console.log("update");
  }

  updatePlayerDetails()
  {
    console.log("update player");
  }

  updateGamesInProgress()
  {
    console.log("update games in prog");
  }

}



export default App;
