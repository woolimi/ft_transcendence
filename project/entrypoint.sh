#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

yarn add flatpickr
yarn add moment
yarn install
# bundle exec rake db:exists && bundle exec rake db:migrate || bundle exec rake db:setup

# seed data
# bundle exec rake db:seed

export SECRET_KEY_BASE=$(bundle exec rake secret)
export DISABLE_DATABASE_ENVIRONMENT_CHECK=1

rails db:environment:set RAILS_ENV=production
RAILS_ENV=production bundle exec rake db:drop db:create db:migrate db:seed

RAILS_ENV=production bundle exec rake assets:clobber
RAILS_ENV=production bundle exec rake assets:precompile

RAILS_ENV=production RACK_ENV=production NODE_ENV=production bin/webpack

# --------------
# https://stackoverflow.com/questions/25775266/how-to-keep-docker-container-running-after-starting-services

#./bin/webpack-dev-server &
RAILS_SERVE_STATIC_FILES=true RAILS_ENV=production rails s -b 0.0.0.0 -e production # &
# tail -f /dev/null


