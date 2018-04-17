/**
	NOTE: needs to be run with `babel-node` NOT `node`:
	```sh
  # globally installed
  babel-node generate-weather-data.js

	# not globally installed
	./node_modules/babel-node generate-weather-data.js
	```
*/

// external modules
import fs from "fs";
import path from "path";

// column names
const COLS = [
   "timestamp",
   "location",
   "lat",
   "lng",
   "weather",
   "temperature",
   "pressure",
   "humidity",
   "wind_speed",
   "wind_direction",
   "clouds"
];

// options for the "weather" column
const WEATHER = [
   "showers",
   "thunderstorm",
   "hail",
   "snow",
   "sleet",
   "windy",
   "cloudy",
   "partly cloudy",
   "sunny"
];

// options for the "wind_direction" column
const DIRECTION = ["N", "E", "S", "W", "NE", "NW", "SE", "SW"];

/**
 * Generates a random number on the range [a, b)
 * @param {number} a - the start of the range (inclusive)
 * @param {number} b - the end of the range (exclusive)
 * @return {number} the randomly generate value
 */
const generateNum = (a, b) => {
   const raw = Math.random() * (b - a) + a;
   return Math.round(raw * 100) / 100;
};

/**
 * Generates a random index for a given array.
 * @param {number} len - the array's length
 * @return {number} the randomly generated index
 */
const generateIndex = len => {
   const raw = generateNum(0, len);
   return Math.floor(raw);
};

/**
 * Gets a random weather condition.
 * @return {string} a random value from `WEATHER`
 */
const getWeather = () => {
   return WEATHER[generateIndex(WEATHER.length)];
};

/**
 * Generate a random direction.
 * @return {string} a random value from `DIRECTION`
 */
const getDirection = () => {
   return DIRECTION[generateIndex(DIRECTION.length)];
};

/**
 * Gnerate a CSV of random weather data, and output the file.
 * NOTE: `clouds` will not correspond to `weather`, although in
 * theory it should.
 */
const generateCSV = () => {
   const rows = [[...COLS]];

   /**
		the min and max timestamps from the db .will need to update
		as new data is added, use the following sql query:

		SELECT min(arrived_at), max(arrived_at)
			FROM trips;
	*/
   const TM = {
      MIN: 1483246800,
      MAX: 1501473600
   };

   const iters = Math.floor((TM.MAX - TM.MIN) / 300);

   for (let i = 0; i < iters; i++)
      rows.push(
         [
            TM.MIN + 300 * i,
            "Columbus",
            39.9612,
            82.9988,
            getWeather(),
            generateNum(-15, 90), // in degress F
            generateNum(740, 780), // in mmHg
            generateNum(0, 100), // a percentage
            generateNum(0, 30), // in mph
            getDirection(),
            generateNum(0, 100) // a percentage of coverage
         ].join(",")
      );

   const filePath = path.resolve(__dirname, "data", "weather-data.csv");
   fs.writeFileSync(filePath, rows.join("\n"));

   process.exit();
};

generateCSV();
