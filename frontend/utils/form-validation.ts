import { dateToMidnight } from "@/utils/datetime-formatting";

type ProfileProps = {
	name?: string;
	description?: string;
};

export type ProfileErrors = {
	name?: string;
	description?: string;
};

// Input validation for the profile form
export function validateProfile(values: ProfileProps): ProfileErrors {
	const errors: ProfileErrors = {};
	if (!values.name?.trim()) {
		errors.name = "Name is required";
	} else if (values.name.length > 100) {
		errors.name = "Name must be less than 100 characters.";
	}
	if (values.description && values.description.length > 1000) {
		errors.description = "Description must be less than 1000 characters.";
	}
	return errors;
}

type InterventionProps = {
	name?: string;
	description?: string;
	goals?: string;
	startDate?: Date;
	endDate?: Date;
};

export type InterventionErrors = {
	name?: string;
	description?: string;
	goals?: string;
	startDate?: string;
	endDate?: string;
};

// Input validation for the intervention form
export function validateIntervention(values: InterventionProps): InterventionErrors {
	const errors: InterventionErrors = {};
	if (!values.name?.trim()) {
		errors.name = "Name is required";
	} else if (values.name.length > 100) {
		errors.name = "Name must be less than 100 characters.";
	}
	if (values.description && values.description.length > 1000) {
		errors.description = "Description must be less than 1000 characters.";
	}
	if (values.goals && values.goals.length > 1000) {
		errors.goals = "Goals must be less than 1000 characters.";
	}
	if (values.startDate && values.endDate && dateToMidnight(values.startDate).getTime() >= dateToMidnight(values.endDate).getTime()) {
		errors.endDate = "End date must be after start date";
	}
	return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
	return Object.values(errors).some(Boolean);
}