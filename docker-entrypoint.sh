#!/bin/sh

echo Migrating database.
exec flash db upgrade
echo Starting Flask.
exec flask run -h 0.0.0.0 -p 5000
