import { dateToMidnight } from "@/utils/datetime-formatting";

type ProfileProps = {
	name?: string;
	description?: string;
};

export type ProfileErrors = {
	name?: string;
	description?: string;
};

// Validate the profile has a name and the name and description are not too long
export function validateProfile(values: ProfileProps): ProfileErrors {
	if (!values.name?.trim()) {
		return { name: "Name is required" };
	}
	if (values.name.length > 30) {
		return { name: "Name must be less than 30 characters." };
	}
	if (values.description && values.description.length > 500) {
		return { description: "Description must be less than 500 characters." };
	}
	return {};
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

// Validate the intervention has a name, the name and description are not too long and the end date is after the start date
export function validateIntervention(values: InterventionProps): InterventionErrors {
	if (!values.name?.trim()) {
		return { name: "Name is required" };
	}
	if (values.name.length > 100) {
		return { name: "Name must be less than 100 characters." };
	}
	if (values.description && values.description.length > 1000) {
		return { description: "Description must be less than 1000 characters." };
	}
	if (values.goals && values.goals.length > 1000) {
		return { goals: "Goals must be less than 1000 characters." };
	}
	if (values.startDate && values.endDate && dateToMidnight(values.startDate).getTime() >= dateToMidnight(values.endDate).getTime()) {
		return { endDate: "End date must be after start date" };
	}
	return {};
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
	for (const key in errors) {
		if (errors[key]) {
			return true;
		}
	}
	return false;
}