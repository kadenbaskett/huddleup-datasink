import DatabaseService from '@services/database.service';
import StatsService from '@services/stats.service';
import { League } from '@prisma/client';

class Seed {

  stats: StatsService;
  db: DatabaseService;

  constructor()
  {
    this.stats = new StatsService();
    this.db = new DatabaseService();
  }

  randomString(start: string)
  {
    return `${start} ${Math.floor(Math.random() * 10)}`;
  }

  createRandomUsers()
  {
    // const users: User[] = [
    //   {
    //     name: "Joe Rodman",
        
    //   },
    // ];

    // for(const user of users)
    // {
    //     this.user = this.db.
    // }
  }

  createRandomLeague()
  {
    // const l: League = {
    //     name: this.randomString('League:'),
        
    // };
  }

}





export default Seed;
