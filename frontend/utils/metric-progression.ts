import { TranscriptWithFeatures } from "@/constants/interfaces";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type Data = {
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

function getTimeGrouping(startDate: Date, endDate: Date): "Day" | "Week" | "Month" {
	const difference = Math.abs(endDate.getTime() - startDate.getTime());
	const days = Math.ceil(difference / 86400000);
	
	if (days <= 14) {
		return "Day";
	} else if (days <= 90) {
		return "Week";
	} else {
		return "Month";
	}
}

function getWeekNumber(date: Date): number {
	const year = date.getFullYear();
	const startOfYear = new Date(year, 0, 1);
	const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
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
		case "Day": {
			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0");
			return `${day}/${month}`;
		}
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
	
	const grouping = getTimeGrouping(startDate, endDate);
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