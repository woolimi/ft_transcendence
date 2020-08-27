#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

yarn install
bundle exec rake db:exists && bundle exec rake db:migrate || bundle exec rake db:setup

# seed data
bundle exec rake db:seed

# https://stackoverflow.com/questions/25775266/how-to-keep-docker-container-running-after-starting-services
tail -f /dev/null

# bundle exec rails s -b 0.0.0.0
