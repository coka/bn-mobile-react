#!/bin/bash +xe

cd $(pwd)/$(dirname $0)/..

asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git
bash ~/.asdf/plugins/nodejs/bin/import-release-team-keyring
asdf plugin-add ruby https://github.com/asdf-vm/asdf-ruby.git

asdf install
npm install
gem install bundle
bundle install

echo 'You must be logged into the expo CLI and mobile app in order to test notifications...'
npm run expo -- login
