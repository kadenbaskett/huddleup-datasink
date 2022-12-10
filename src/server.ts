import App from '@/app';
import Seed from './seed';

const dev = true;

const app = new App();

if(dev)
{
    const seed = new Seed();
    app.initialUpdate().then(() => seed.seedDB());
}
else
{
    app.initialUpdate().then(() => app.startUpdateLoop());
}

