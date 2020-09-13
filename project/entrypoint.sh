#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

# ---------------------------
# For production

# export SECRET_KEY_BASE=$(bundle exec rake secret)
# export DISABLE_DATABASE_ENVIRONMENT_CHECK=1
# export RAILS_ENV=production
# export RACK_ENV=production
# export NODE_ENV=production
# export RAILS_SERVE_STATIC_FILES=true

# echo "-------------------"
# echo "  Database setup"
# echo "-------------------"

# rails db:environment:set RAILS_ENV=production
# rails db:drop db:create db:migrate db:seed

# echo "------------------------"
# echo "  Precompiling assets"
# echo "------------------------"

# bundle exec rake log:clear
# bundle exec rake tmp:clear
# bundle exec rake assets:clobber --trace
# # bundle exec rake webpacker:clobber
# yarn cache clean
# yarn install --check-files

# WEBPACKER_PRECOMPILE=false bundle exec rake assets:precompile --trace
# # bundle exec rake webpacker:compile
# ./bin/webpack --progress --profile --config config/webpack/production.js

# echo "-----------------"
# echo "  Launch server"
# echo "-----------------"

# rails s -b 0.0.0.0 -e production



# ------------------------------
# For development

export RACK_ENV=development
export NODE_ENV=development
export RAILS_ENV=development
rails db:environment:set RAILS_ENV=development
rails db:drop db:create db:migrate db:seed
yarn install --check-files

./bin/webpack-dev-server &
rails s -b 0.0.0.0 &
tail -f /dev/null




