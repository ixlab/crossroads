#!/usr/bin/env bash
# Uploads shape files for timezones to the specified instance. Note, coordinates 
# are formatted (long, lat)
shp2pgsql -I -s 4326 ../data/tz_world_mp.shp public.timezones | psql -U docker -d car2go -p 25432 -h localhost