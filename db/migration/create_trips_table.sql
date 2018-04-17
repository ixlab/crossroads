-- create empty trips table
CREATE TABLE trips (
	vin varchar(155),
	idle_time bigint,
	departed_at bigint,
	arrived_at bigint,
	departure_coordinates varchar(500),
	arrival_coordinates varchar(500)
);
ALTER TABLE trips ALTER COLUMN departure_coordinates TYPE Geometry(POINT, 4326) USING ST_SetSRID(departure_coordinates::Geometry,4326);
ALTER TABLE trips ALTER COLUMN arrival_coordinates TYPE Geometry(POINT, 4326) USING ST_SetSRID(arrival_coordinates::Geometry,4326);
