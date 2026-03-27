import { calculateMean, calculateStandardDeviation } from "@/utils/chart-grouping";

/*
* • Adapted from: https://github.com/michiel/nelsonrules-js/blob/master/src/rules.js
* • The Nelson's rules 1, 2, 3 were selected as the more effective rules for identifying unnatural variation.
*/

const CONFIDENCE = 7;

// Rule 1 (One): Any one point outside the UCL or LCL
export function nelsonRule1(values: number[]) {
    if (values.length === 0) {
        return {
            mean: 0,
            standardDeviation: 0,
            upperBound: 0,
            lowerBound: 0,
            triggers: 0,
            positions: [] as number[],
        };
    }

    const mean = calculateMean(values);
    const standardDeviation = calculateStandardDeviation(values, mean) * 3;
    const upperBound = mean + standardDeviation;
    const lowerBound = mean - standardDeviation;

    const positions: number[] = [];

    values.forEach((val, idx) => {
        if (val > upperBound || val < lowerBound) {
            positions.push(idx);
        }
    });

    return {
        mean,
        standardDeviation,
        upperBound,
        lowerBound,
        triggers: positions.length,
        positions
    };
}

// Rule 2 (Run): Seven+ points all above or below the center line
export function nelsonRule2(values: number[]) {
    if (values.length === 0) {
        return {
            mean: 0,
            triggers: 0,
            positions: [] as number[],
            groups: [] as number[][],
        };
    }

    const mean = calculateMean(values);

    let over: boolean | null = null;
    let counter = 1;
    let triggers = 0;
    let positions: number[] = [];
    const groups = [] as number[][];

    function counterUp() {
        counter += 1;
        if (counter === CONFIDENCE) {
            triggers += 1;
        }
    }

    function endSequence(idx: number) {
        if (counter > CONFIDENCE - 1) {
            const group: number[] = [];
            for (let i = (idx + 1) - counter; i < idx; i++) {
                group.push(i);
            }
            groups.push(group);
            positions = positions.concat(group);
        }
        counter = 2;
        over = !over;
    }

    values.forEach((val, idx) => {
        if (over === null) {
            over = val < mean;
            counterUp();
        } else if (over) {
            if (val > mean) {
                counterUp();
            } else {
                endSequence(idx);
            }
        } else if (val < mean) {
            counterUp();
        } else {
            endSequence(idx);
        }
    });

    endSequence(values.length);

    return {
        mean,
        triggers,
        positions,
        groups,
    };
}

// Rule 3 (Trend): Seven+ points in a row continually increasing or decreasing
export function nelsonRule3(values: number[]) {
    if (values.length === 0) {
        return {
            groups: [] as number[][],
            positions: [] as number[],
            triggers: 0,
        };
    }

    const groups: number[][] = [];
    let positions: number[] = [];

    let triggers = 0;
    let trendUp: boolean | null = null;
    let counter = 1;

    function counterUp() {
        counter += 1;
        if (counter === CONFIDENCE) {
            triggers += 1;
        }
    }

    function endSequence(idx: number) {
        const group: number[] = [];
        if (counter >= CONFIDENCE) {
            for (let i = (idx + 1) - counter; i < idx; i++) {
                group.push(i);
            }
            groups.push(group);
            positions = positions.concat(group);
        }
        counter = 2;
        if (trendUp !== null) {
            trendUp = !trendUp;
        }
    }

    function isUp(a: number, b: number) {
        return a > b;
    }

    function isTrending(a: boolean | null, b: boolean) {
        return a === b;
    }

    values.forEach((val, idx, arr) => {
        const prevVal = arr[idx - 1];
        const goingUp = isUp(val, prevVal);

        if (trendUp === null) {
            if (idx !== 0) {
                trendUp = goingUp;
            }
        } else if (!isTrending(trendUp, goingUp)) {
            endSequence(idx);
        }
        counterUp();
    });

    endSequence(values.length);

    return {
        groups,
        positions,
        triggers,
    };
}