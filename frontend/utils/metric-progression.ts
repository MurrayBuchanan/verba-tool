import { TranscriptWithFeatures } from "@/constants/transcript";
import { MAX_DAYS_FOR_DAILY_VIEW, MAX_DAYS_FOR_WEEKLY_VIEW, MILLISECONDS_PER_DAY, DAY_NAMES, MONTH_NAMES } from "@/constants/time";

export type MetricDataPoint = {
	x: number;
	value: number;
	label: string;
	transcriptId: number;
	date: Date;
	grouping?: "Day" | "Week" | "Month";
};

type DateGroup = {
	date: Date;
	transcripts: TranscriptWithFeatures[];
};

function getDaysDifference(startDate: Date, endDate: Date): number {
	return Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY);
}

function getTimeGrouping(startDate: Date, endDate: Date): "Day" | "Week" | "Month" {
	const days = getDaysDifference(startDate, endDate);
	
	if (days <= MAX_DAYS_FOR_DAILY_VIEW) {
		return "Day";
	}
	if (days <= MAX_DAYS_FOR_WEEKLY_VIEW) {
		return "Week";
	}
	return "Month";
}

function getWeekNumber(date: Date): number {
	const year = date.getFullYear();
	const startOfYear = new Date(year, 0, 1);
	const days = Math.floor((date.getTime() - startOfYear.getTime()) / MILLISECONDS_PER_DAY);
	const dayOfWeek = startOfYear.getDay();
	const adjusted = days + dayOfWeek;
	return Math.floor(adjusted / 7);
}

function getGroupKey(date: Date, grouping: "Day" | "Week" | "Month"): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	
	switch (grouping) {
		case "Day":
			const day = String(date.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		case "Week":
			const week = String(getWeekNumber(date)).padStart(2, "0");
			return `${year}-W${week}`;
		case "Month":
			return `${year}-${month}`;
	}
}

function groupByTimePeriod(transcripts: TranscriptWithFeatures[], grouping: "Day" | "Week" | "Month"): DateGroup[] {
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

function formatGroupLabel(date: Date, grouping: "Day" | "Week" | "Month"): string {
	switch (grouping) {
		case "Day":
			return DAY_NAMES[date.getDay()];
		case "Week":
			return `W${getWeekNumber(date) + 1}`;
		case "Month":
			return MONTH_NAMES[date.getMonth()];
	}
}

function getMetricValue(transcript: TranscriptWithFeatures, metricKey: string): number {
	const value = transcript[metricKey as keyof TranscriptWithFeatures] as Record<string, number>;
	const speakers = Object.keys(value).sort();
	return value[speakers[0]];
}

function calculateAverage(values: number[]): number {
	let sum = 0;
	for (let i = 0; i < values.length; i++) {
		sum += values[i];
	}
	return sum / values.length;
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

export function getMetricProgression(transcripts: TranscriptWithFeatures[], metricKey: string): MetricDataPoint[] {
	if (transcripts.length === 0) {
		return [];
	}
	
	const dates = getDates(transcripts);
	const startDate = dates[0];
	const endDate = dates[dates.length - 1];
	
	const grouping = getTimeGrouping(startDate, endDate);
	const groups = groupByTimePeriod(transcripts, grouping);
	
	const result = [];
	for (let i = 0; i < groups.length; i++) {
		const group = groups[i];
		const values = [];
		for (let j = 0; j < group.transcripts.length; j++) {
			values.push(getMetricValue(group.transcripts[j], metricKey));
		}
		
		result.push({
			x: i + 1,
			value: calculateAverage(values),
			label: formatGroupLabel(group.date, grouping),
			transcriptId: group.transcripts[0].id,
			date: group.date,
			grouping,
		});
	}
	return result;
}