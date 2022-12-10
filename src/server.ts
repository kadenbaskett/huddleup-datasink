import App from '@/app';
import Seed from './seed';

const seedOnly = true;
if(seedOnly)
{
    const seed = new Seed();
    seed.seedDB();
}
else
{
    const app = new App();
    app.initialUpdate().then(() => app.startUpdateLoop());
}


