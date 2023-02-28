import App from '@/app';
import Seed from './seed';

const args = process.argv.slice(2);

// Init will add NFL stats to the DB (takes a few mins)
const initOnly = args.includes('init') && !args.includes('seed');
const seedOnly = !args.includes('init') && args.includes('seed');
const initAndSeed = args.includes('init') && args.includes('seed');
const onlyClearDB = args.includes('onlyClearDB');
const fillLeague = args.includes('fillLeague');
const createEmptyLeague = args.includes('createEmptyLeague');
const simulateDraft = args.includes('simulateDraft');
const simulateMatchups = args.includes('simulateMatchups');
const simulateWeek = args.includes('simulateWeek');

const app = new App();

if (process.env.NODE_ENV === 'development') {
  const seed = new Seed();

  if (onlyClearDB) {
    console.log('clear only');
    // Removes all of the seeded league data from the db
    seed.clearLeagueStuff();
  } else if (initAndSeed) {
    console.log('init and seed');
    // Updates the db with NFL players, games, teams, etc, and then seeds it with mock league data
    app.initialUpdate().then(() => seed.seedDB());
  } else if (seedOnly) {
    console.log('seed only');
    // Seeds the db with mock league data
    seed.seedDB();
  } else if (initOnly) {
    console.log('init only');
    // Updates the db with NFL players, games, teams, etc
    app.initialUpdate();
  } else if (fillLeague) {
    console.log('filling league');
    seed.fillLeague(Number(args[1]));
  } else if (createEmptyLeague) {
    console.log('creating an empty league');
    seed.createEmptyLeague();
  } else if (simulateDraft) {
    console.log('simulating draft');
    seed.simulateDraft(Number(args[1]));
  } else if (simulateMatchups) {
    console.log('simulating matchups');
    seed.simulateMatchups(Number(args[1]));
  } else if (simulateWeek) {
    // only works after draft has been simulated
    console.log('simulating week');
    seed.simulateWeek(Number(args[1]), Number(args[2])); // leagueID, week number
  } else {
    console.log(
      'Must run with command line args to output the desired behavior. See package.json for a list of available args',
    );
  }
} else if (process.env.NODE_ENV === 'production') {
  // Updates the db with NFL players, games, teams, etc, and then starts the update loop to keep our DB in sync
  app.initialUpdate().then(() => app.startUpdateLoop());
} else {
  console.log('Unrecognized node env: ', process.env.NODE_ENV);
}
