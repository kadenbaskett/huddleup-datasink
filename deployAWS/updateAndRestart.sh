#!/bin/bash

# any future command that fails will exit the script
set -e

# Update  path inorder to use npm and pm2 commands
export PATH="/home/ubuntu/.nvm/versions/node/v19.0.0/lib/node_modules/npm/bin:$PATH"
export PATH="/home/ubuntu/.nvm/versions/node/v19.0.0/bin:$PATH"
export PATH="/home/ubuntu/.nvm/versions/node/v19.0.0/lib/node_modules/pm2/bin:$PATH"

cd huddleup
cd datasink

# turn off command fail causes exit
set +e

# stop, update, and restart service 
pm2 delete datasink 

# any future command that fails will exit the script
set -e

git fetch
git checkout ci-cd
git pull

npx prisma migrate deploy

npm i
npm run initAndSeed

# small comment

# Uncomment when we want datasink to run
# pm2 start npm --name "datasink" -- start
