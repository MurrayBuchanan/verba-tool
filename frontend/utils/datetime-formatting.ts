// Set the time to midnight for day-to-day comparison
export function dateToMidnight(date: Date): Date {
	const midnight = new Date(date);
	midnight.setHours(0, 0, 0, 0);
	return midnight;
}

// Format a date to the international standard format YYYY-MM-DD for the API
export function formatAPIDate(date: Date): string {
	return date.toISOString().split("T")[0];
}

// Format a date to DD/MM/YYYY format for displaying
export function formatDisplayDate(date: Date | string): string {
	const displayFormat = new Date(date);
	return displayFormat.toLocaleDateString("en-GB");
}

// Format a date and time in the format Day Month Year, Time AM/PM
export function formatDisplayDateTime(date: Date | string): string {
	const validDate = new Date(date);
	const displayDate = validDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
	const displayTime = validDate.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
	return `${displayDate}, ${displayTime}`;
}

export function formatDuration(inputSeconds: number): string {
	const totalSeconds = Math.floor(inputSeconds);

	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	if (minutes === 0) {
		return `${seconds} seconds`;
	}
	if (seconds === 0) {
		return `${minutes} minutes`;
	}	

	return `${minutes} minutes ${seconds} seconds`;
}