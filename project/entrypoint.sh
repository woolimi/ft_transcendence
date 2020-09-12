#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi


# bundle exec rake db:exists && bundle exec rake db:migrate || bundle exec rake db:setup
# bundle exec rake db:seed

export SECRET_KEY_BASE=$(bundle exec rake secret)
export DISABLE_DATABASE_ENVIRONMENT_CHECK=1

rails db:environment:set RAILS_ENV=production
RAILS_ENV=production bundle exec rake db:drop db:create db:migrate db:seed

RAILS_ENV=production bundle exec rake log:clear
RAILS_ENV=production bundle exec rake tmp:clear

# RAILS_ENV=production bundle exec rake assets:clobber --trace
# RAILS_ENV=production bundle exec rake webpacker:clobber
# yarn cache clean
yarn install --check-files
RAILS_ENV=production bundle exec rake assets:precompile --trace
# RAILS_ENV=production bundle exec rake webpacker:compile

RAILS_ENV=production RACK_ENV=production NODE_ENV=production ./bin/webpack

# --------------
# https://stackoverflow.com/questions/25775266/how-to-keep-docker-container-running-after-starting-services

#./bin/webpack-dev-server &
RAILS_SERVE_STATIC_FILES=true RAILS_ENV=production rails s -b 0.0.0.0 -e production &
tail -f /dev/null


