'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sqlFilters = require('../sql-filters.js');

var _sqlFilters2 = _interopRequireDefault(_sqlFilters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// can import config data from json files and such too if needed
// to keep the test file clean

/*
	Test Framework: [mocha](https://mochajs.org/)
	Test Utility: [expect](https://github.com/mjackson/expect)

	To run tests: `npm run api-tests`
*/

// external imports
describe('sql-filters tests', function () {

	// can store variables needed for each test here

	beforeEach(function () {
		// any setup needed before each test (each `it` body)
	});

	afterEach(function () {
		// cleanup to be performed after each test (each `it` body)
	});

	// can place `it` blocks within additional describe blocks
	describe('someMethod', function () {

		// `it` blocks almost always start with "should"; this test reads
		// "someMethod should do this"
		it('should do this', function () {
			// body of the test
		});
	});

	// test example for `sql-filters.test.js`
	describe('SQLInputManager', function () {

		// standard first test is to ensure the component exists:
		it('should exist', function () {
			(0, _expect2.default)(_sqlFilters2.default).toExist();
		});

		// good to have a describe block for each method of the export
		// (if a class, builder, etc.)
		describe('constructor', function () {
			// set needed variables
			var inputManager = void 0;

			beforeEach(function () {
				// create a clean instance before each test
				inputManager = new _sqlFilters2.default();
			});

			it('should have an default offset of 0', function () {
				// can give custom error messages if desired, usually default is fine
				(0, _expect2.default)(inputManager.currentTag).toEqual(0, 'Value was not 0, was ' + inputManager.currentTag);
			});

			it('should have an empty array for inputs', function () {
				(0, _expect2.default)(inputManager.inputs).toEqual([]);
			});

			it('should have an empty array for clauses', function () {
				(0, _expect2.default)(inputManager.clauses).toEqual([]);
			});
		});

		describe('getTag', function () {
			var inputManager = void 0;

			beforeEach(function () {
				inputManager = new _sqlFilters2.default();
			});

			it('should exist', function () {
				(0, _expect2.default)(inputManager.getTag).toExist();
			});
		});

		describe('getTags', function () {
			var inputManager = void 0;

			beforeEach(function () {
				inputManager = new _sqlFilters2.default();
			});

			it('should exist', function () {
				(0, _expect2.default)(inputManager.getTags).toExist();
			});
		});

		describe('addClause', function () {
			var inputManager = void 0;

			beforeEach(function () {
				inputManager = new _sqlFilters2.default();
			});

			it('should exist', function () {
				(0, _expect2.default)(inputManager.addClause).toExist();
			});
		});
	});

	_sqlFilters.getWhereClauses, _sqlFilters.getDayOfWeekFilter, _sqlFilters.getDepartedFromFilter, _sqlFilters.getArrivedAtFilter, _sqlFilters.getDepartureTimeOfDayFilter, _sqlFilters.getArrivalTimeOfDayFilter, _sqlFilters.getVinFilter;
});

// custom imports