import { calculateMean, calculateStandardDeviation } from "@/utils/chart-grouping";
import { nelsonRule1, nelsonRule2, nelsonRule3 } from "@/utils/chart-rules";

// Run: npm test -- chart.test

describe("chart helpers", () => {
	it ("handles empty input for the mean", () => {
		expect(calculateMean([])).toBe(0);
	});

	it ("Calculates the mean", () => {
		expect(calculateMean([10, 20, 30, 40])).toBe(25);
	});

	it ("handles minimum value for the standard deviation", () => {
		expect(calculateStandardDeviation([], 0)).toBe(0);
		expect(calculateStandardDeviation([10], 10)).toBe(0);
	});

	it ("Calculates the standard deviation", () => {
		const values = [2, 4, 4, 4, 5, 5, 7, 9];
		const mean = calculateMean(values);
		const standardDeviation = calculateStandardDeviation(values, mean);

		expect(mean).toBe(5);
		expect(standardDeviation).toBeCloseTo(2, 10);
	});
});

describe("nelson decision rules", () => {
	it ("Rule 1 flags points outside control limits", () => {
		const values = [...Array(19).fill(0), 100];
		const result = nelsonRule1(values);

		expect(result.triggers).toBe(1);
		expect(result.positions).toEqual([19]);
		expect(result.mean).toBe(5);
		expect(result.upperBound).toBeCloseTo(70.3834841531101, 10);
		expect(result.lowerBound).toBeCloseTo(-60.38348415311011, 10);
	});

	it ("Rule 2 flags a run of 7 points on one side of the mean", () => {
		const values = [10, 1, 1, 1, 1, 1, 1, 1, 10];
		const result = nelsonRule2(values);

		expect(result.triggers).toBe(1);
		expect(result.groups).toEqual([[0, 1, 2, 3, 4, 5, 6, 7]]);
		expect(result.positions).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
	});

	it ("Rule 3 flags a trend of 7 points", () => {
		const values = [1, 2, 3, 4, 5, 6, 7];
		const result = nelsonRule3(values);

		expect(result.triggers).toBe(1);
		expect(result.groups).toEqual([[0, 1, 2, 3, 4, 5, 6]]);
		expect(result.positions).toEqual([0, 1, 2, 3, 4, 5, 6]);
	});
});