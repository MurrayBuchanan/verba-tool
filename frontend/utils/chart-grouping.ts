import { TranscriptWithFeatures } from "@/constants/interfaces";

/*
* Helpers for the chart
* • Groups data into date groupings for chart day-by-day, week-by-week and month-by-month displays
* • Speaker 2 is the focus of analysis, if empty fallbacks to Speaker 1 (as if they are using it for themselves - unlikely edge case) 
* • Places the data into array and pushes to chart
* • Additional support functions for calculating the Upper Control Limit (UCL) and Lower Control Limit (LCL) for SDP
*  • The neilsons rules are from the rehabilitation SPC paper which emphasises these three, more than this can lead to false alarms.
* 
* Additional supporting research
* • Evidence of SDP in healthcare rehabiltiation (process): https://www.researchgate.net/profile/Charles-Callahan-3/publication/232583626_Statistical_process_control_and_rehabilitation_outcome_The_single-subject_design_reconsidered/links/5b81be844585151fd13328c3/Statistical-Process-Control-and-Rehabilitation-Outcome-The-Single-Subject-Design-Reconsidered.pdf
* • Evidence of SDP in healthcare improvement (sub-reference): https://pmc.ncbi.nlm.nih.gov/articles/PMC1758030/
*/

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Enum for date groupings
const DateGrouping = { 
    Day: "Day", 
    Week: "Week", 
    Month: "Month" 
};

export type Data = {
	x: number;
	value: number;
	label: string;
	transcriptId: number;
	date: Date;
	grouping: string;
};

type DateGroup = {
	date: Date;
	transcripts: TranscriptWithFeatures[];
};

function dateCategory(startDate: Date, endDate: Date): string {
	const difference = Math.abs(endDate.getTime() - startDate.getTime());
	const days = Math.ceil(difference / 86400000);
	
	if (days <= 14) {
		return DateGrouping.Day;
	} else if (days <= 90) {
		return DateGrouping.Week;
	} else {
		return DateGrouping.Month;
	}
}

function getWeekNumber(date: Date) {
	const year = date.getFullYear();
	const startOfYear = new Date(year, 0, 1);
	const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
	const dayOfWeek = startOfYear.getDay();
	const adjusted = days + dayOfWeek;
	return Math.floor(adjusted / 7);
}

function getGroupKey(date: Date, grouping: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    
    if (grouping === DateGrouping.Day) {
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    } else if (grouping === DateGrouping.Week) {
        const week = String(getWeekNumber(date)).padStart(2, "0");
        return `${year}-W${week}`;
    } else {
        return `${year}-${month}`;
    }
}

function groupByTimePeriod(transcripts: TranscriptWithFeatures[], grouping: string): DateGroup[] {
	const groups = new Map<string, TranscriptWithFeatures[]>();
	
	for (let i = 0; i < transcripts.length; i++) {
		const transcript = transcripts[i];
		const date = new Date(transcript.created_at);
		const groupKey = getGroupKey(date, grouping);
		
		if (!groups.has(groupKey)) {
			groups.set(groupKey, []);
		}
		const group = groups.get(groupKey);
		if (group) {
			group.push(transcript);
		}
	}
	
	const result = [];
	for (const transcripts of groups.values()) {
		const sorted = [...transcripts];
		sorted.sort((a, b) => {
			return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
		});
		
		result.push({
			date: new Date(sorted[0].created_at),
			transcripts: sorted,
		});
	}
	
	result.sort((a, b) => {
		return a.date.getTime() - b.date.getTime();
	});
	return result;
}

function formatGroupLabel(date: Date, grouping: string): string {
	const day = String(date.getDate()).padStart(2, "0");
	const monthNum = String(date.getMonth() + 1).padStart(2, "0");
	const monthName = MONTH_NAMES[date.getMonth()];
	const yearShort = String(date.getFullYear()).slice(2);

	if (grouping === DateGrouping.Day || grouping === DateGrouping.Week) {
		return `${day}/${monthNum}`;
	}

	return `${monthName} '${yearShort}`;
}

function getMetricValue(transcript: TranscriptWithFeatures, metricKey: string): number {
	const value = transcript[metricKey as keyof TranscriptWithFeatures] as Record<string, number> | undefined;

	if (!value) {
		return 0;
	}
	const speakers = Object.keys(value).sort();
	return value[speakers[1] || speakers[0]] ?? 0;
}

function getDates(transcripts: TranscriptWithFeatures[]): Date[] {
	const dates = [];
	for (let i = 0; i < transcripts.length; i++) {
		dates.push(new Date(transcripts[i].created_at));
	}
	dates.sort((a, b) => {
		return a.getTime() - b.getTime();
	});
	return dates;
}

export function getMetricProgression(transcripts: TranscriptWithFeatures[], metricKey: string): Data[] {
	if (transcripts.length === 0) {
		return [];
	}
	
	const dates = getDates(transcripts);
	const startDate = dates[0];
	const endDate = dates[dates.length - 1];
	
	const grouping = dateCategory(startDate, endDate);
	const groups = groupByTimePeriod(transcripts, grouping);
	
	const result = [];
	for (let i = 0; i < groups.length; i++) {
		const group = groups[i];
		const transcript = group.transcripts[0];
		result.push({
			x: i + 1,
			value: getMetricValue(transcript, metricKey),
			label: formatGroupLabel(group.date, grouping),
			transcriptId: transcript.id,
			date: group.date,
			grouping
		});
	}
	return result;
}

// Baseline
export function calculateMean(values: number[]): number {
    if (values.length === 0) {
        return 0;
    }
    
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum / values.length;
}

// Upper/Lower Control Limits
export function calculateStandardDeviation(values: number[], mean: number): number {
    if (values.length < 2) {
        return 0;
    }
    
    let sumSquaredDifferences = 0;
    for (let i = 0; i < values.length; i++) {
        const difference = values[i] - mean;
        sumSquaredDifferences += difference * difference;
    }
    
    const variance = sumSquaredDifferences / values.length;
    return Math.sqrt(variance);
}