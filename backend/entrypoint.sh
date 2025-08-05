#!/bin/bash

set -e

echo "Waiting for PostgreSQL to be available..."

echo "PostgreSQL is available...."
sleep 10

echo "Creating and applying migrations..."
if [ ! -d "migrations" ]; then
  flask db init
fi
flask db stamp head

flask db migrate -m "Auto migration" || echo "No changes detected"
flask db upgrade

exec gunicorn --bind 0.0.0.0:5000 "app:create_app()" --timeout 120
