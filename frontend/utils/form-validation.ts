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
	startDate?: Date;
	endDate?: Date;
};

export type InterventionErrors = {
	name?: string;
	description?: string;
	startDate?: string;
	endDate?: string;
};

// Validate the intervention has a name, the name and description are not too long and the end date is after the start date
export function validateIntervention(values: InterventionProps): InterventionErrors {
	if (!values.name?.trim()) {
		return { name: "Name is required" };
	}
	if (values.name.length > 30) {
		return { name: "Name must be less than 30 characters." };
	}
	if (values.description && values.description.length > 500) {
		return { description: "Description must be less than 500 characters." };
	}
	if (values.startDate && values.endDate && values.startDate.getTime() >= values.endDate.getTime()) {
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