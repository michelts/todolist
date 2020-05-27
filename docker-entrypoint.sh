#!/bin/sh

echo Migrating database.
flask db upgrade

echo Starting Flask.
exec flask run -h 0.0.0.0 -p 5000
