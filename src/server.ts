import App from '@/app';
import Seed from './seed';

const init = false; // Do we need to fill the DB with NFL stats? (it takes a few minutes to do so)
const dev = true;
const app = new App();

if(dev)
{
    const seed = new Seed();

    if(init)
    {
        app.initialUpdate().then(() => seed.seedDB());
    }
    else
    {
        seed.seedDB();
    }
}
else
{
    app.initialUpdate().then(() => app.startUpdateLoop());
}

