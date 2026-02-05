// Format a date to YYYY-MM-DD format for the API
export function formatAPIDate(date: Date): string {
	return date.toISOString().split('T')[0];
}

// Format a date to DD/MM/YYYY format for displaying
export function formatDisplayDate(date: Date | string): string {
	if (!date) {
		return "Invalid date";
	}
	
	const displayFormat = new Date(date);
	return displayFormat.toLocaleDateString('en-GB');
}

// Format a date and time in the format Day Month Year, Time AM/PM
export function formatDisplayDateTime(date: Date | string): string {
	if (!date) {
		return "Invalid date";
	}
	const validDate = new Date(date);
	const displayDate = validDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
	const displayTime = validDate.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
	return `${displayDate}, ${displayTime}`;
}