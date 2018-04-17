-- build trips from placemarks
CREATE TABLE IF NOT EXISTS trips AS (
	SELECT vin,
		   created_at AS departed_at,
		   next_created_at AS arrived_at,
		   created_at - previous_arrived_at AS idle_time,
		   coordinates AS departure_coordinates,
		   next_coordinates AS arrival_coordinates
		FROM (
			SELECT vin,
				   created_at,
				   coordinates,
				   first_value(created_at) OVER(PARTITION BY vin, coordinates ORDER BY created_at) AS previous_arrived_at,
				   lead(created_at) OVER(PARTITION BY vin ORDER BY created_at) AS next_created_at,
				   lead(coordinates) OVER(PARTITION BY vin ORDER BY created_at) AS next_coordinates
				FROM placemarks) unfiltered_trips
		WHERE NOT ST_EQUALS(coordinates, next_coordinates)
);
