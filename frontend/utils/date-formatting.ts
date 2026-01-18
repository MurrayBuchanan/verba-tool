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