#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /app/tmp/pids/server.pid

# Wait for database to be ready
echo "Waiting for database..."
until bundle exec rails runner "ActiveRecord::Base.connection" 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 1
done
echo "Database is ready!"

# Wait for Redis to be ready
echo "Waiting for Redis..."
until redis-cli -h redis ping 2>/dev/null; do
  echo "Redis is unavailable - sleeping"
  sleep 1
done
echo "Redis is ready!"

# Run database migrations
echo "Running database migrations..."
bundle exec rails db:migrate 2>/dev/null || bundle exec rails db:setup

# Seed database if needed (only in development or if specifically requested)
if [ "$RAILS_ENV" != "production" ] || [ "$SEED_DB" = "true" ]; then
  echo "Seeding database..."
  bundle exec rails db:seed
fi

# Create admin user if specified
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "Creating admin user..."
  bundle exec rails runner "
    user = User.find_or_initialize_by(email: '$ADMIN_EMAIL')
    user.password = '$ADMIN_PASSWORD'
    user.role = 'superuser'
    user.save!
    puts 'Admin user created: $ADMIN_EMAIL'
  "
fi

# Start the main process
echo "Starting Rails server..."
exec "$@" 