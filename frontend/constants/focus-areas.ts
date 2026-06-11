export type FocusAreaId =
	| "aphasia"
	| "child_language"
	| "concussion"
	| "dementia_language"
	| "speech_practice"
	| "general";

export type FocusAreaOption = {
	id: FocusAreaId;
	title: string;
	description: string;
};

export const FOCUS_AREA_OPTIONS: FocusAreaOption[] = [
	{
		id: "aphasia",
		title: "Aphasia",
		description: "Support communication recovery after stroke or brain injury.",
	},
	{
		id: "child_language",
		title: "Child language development",
		description: "Track how language skills grow and change over time.",
	},
	{
		id: "concussion",
		title: "Concussion monitoring",
		description: "Watch communication patterns during recovery from concussion.",
	},
	{
		id: "dementia_language",
		title: "Dementia & language",
		description: "Monitor communication changes and support meaningful conversation.",
	},
	{
		id: "speech_practice",
		title: "Speech practice",
		description: "Track progress and consistency in speech and articulation work.",
	},
	{
		id: "general",
		title: "General use",
		description: "Explore insights without a specific clinical focus.",
	},
];
