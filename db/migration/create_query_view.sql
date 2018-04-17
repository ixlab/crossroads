-- Create the query view
CREATE MATERIALIZED VIEW query_view AS (
   SELECT vin,
          departed_at,
          arrived_at,
          date_part('hour', TIMESTAMP 'epoch' + arrived_at * INTERVAL '1 second') AS hr,
          extract(DOW FROM TIMESTAMP 'epoch' + arrived_at * INTERVAL '1 second') AS dow,
          arrival_coordinates,
          departure_coordinates,
          ST_Y(arrival_coordinates) AS arrival_lat,
          ST_X(arrival_coordinates) AS arrival_lng,
          ST_Y(departure_coordinates) AS departure_lat,
          ST_X(departure_coordinates) AS departure_lng,
          ST_DistanceSphere(arrival_coordinates, departure_coordinates) / 1000.0 AS trip_distance_km,
          (arrived_at - departed_at) / 60.0 AS trip_time
   	FROM trips
);
