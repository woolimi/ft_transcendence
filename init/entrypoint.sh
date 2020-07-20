#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

bundle exec rake db:exists && bundle exec rake db:migrate || bundle exec rake db:setup
# bundle exec rails s -b 0.0.0.0
bundle exec puma -b 'ssl://0.0.0.0:3000?key=.ssh/server.key&cert=.ssh/server.crt'
