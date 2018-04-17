/*
	Test Framework: [mocha](https://mochajs.org/)
	Test Utility: [expect](https://github.com/mjackson/expect)

	To run tests: `npm run api-tests`
*/ 

// external imports
import expect from 'expect';

// custom imports
import SQLInputManager, {
	getWhereClauses, getDayOfWeekFilter,
	getDepartedFromFilter, getArrivedAtFilter,
	getDepartureTimeOfDayFilter, getArrivalTimeOfDayFilter,
	getVinFilter
} from '../sql-filters.js';

// can import config data from json files and such too if needed
// to keep the test file clean

describe('sql-filters tests', () => {
	
	// can store variables needed for each test here

	beforeEach(() => {
		// any setup needed before each test (each `it` body)
	});

	afterEach(() => {
		// cleanup to be performed after each test (each `it` body)
	});

	// can place `it` blocks within additional describe blocks
	describe('someMethod', () => {
		
		// `it` blocks almost always start with "should"; this test reads
		// "someMethod should do this"
		it('should do this', () => {
			// body of the test
		});

	});

	// test example for `sql-filters.test.js`
	describe('SQLInputManager', () => {

		// standard first test is to ensure the component exists:
		it('should exist', () => {
			expect(SQLInputManager).toExist();
		});

		// good to have a describe block for each method of the export
		// (if a class, builder, etc.)
		describe('constructor', () => {
			// set needed variables
			let inputManager;

			beforeEach(() => {
				// create a clean instance before each test
				inputManager = new SQLInputManager();
			});

			it('should have an default offset of 0', () => {
				// can give custom error messages if desired, usually default is fine
				expect(inputManager.currentTag).toEqual(0, `Value was not 0, was ${inputManager.currentTag}`);
			});

			it('should have an empty array for inputs', () => {
				expect(inputManager.inputs).toEqual([]);
			});

			it('should have an empty array for clauses', () => {
				expect(inputManager.clauses).toEqual([]);
			});
		});

		describe('getTag', () => {
			let inputManager;

			beforeEach(() => {
				inputManager = new SQLInputManager();
			});

			it('should exist', () => {
				expect(inputManager.getTag).toExist();
			});
		});

		describe('getTags', () => {
			let inputManager;

			beforeEach(() => {
				inputManager = new SQLInputManager();
			});

			it('should exist', () => {
				expect(inputManager.getTags).toExist();
			});
		});

		describe('addClause', () => {
			let inputManager;

			beforeEach(() => {
				inputManager = new SQLInputManager();
			});

			it('should exist', () => {
				expect(inputManager.addClause).toExist();
			});
		});

	});

	getWhereClauses, getDayOfWeekFilter,
	getDepartedFromFilter, getArrivedAtFilter,
	getDepartureTimeOfDayFilter, getArrivalTimeOfDayFilter,
	getVinFilter

});