import App from '@/app';

const app = new App();
app.initialUpdate().then(() => app.startUpdateLoop());
