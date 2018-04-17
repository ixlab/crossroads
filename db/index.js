var migrateStates = require("./migration/migrate-states.js");
var migrateServiceRegions = require("./migration/migrate-service-regions.js");
var migratePlacemarks = require("./migration/migrate-placemarks.js");

migrateServiceRegions();
migrateStates();
migratePlacemarks();
