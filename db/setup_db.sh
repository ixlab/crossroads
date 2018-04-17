#!/usr/bin/env bash
psql -U $1 -a -f ./db/setup/database-setup.sql -v db_name=$2
node ./db/index.js
psql -U $1 -d $2 -a -f ./db/migration/create_trips_table.sql
psql -U $1 -d $2 -a -f ./db/migration/upload_sample_data.sql
psql -U $1 -d $2 -a -f ./db/migration/create_query_view.sql
