import { getInterventions, getIntervention, createIntervention, updateIntervention, deleteIntervention } from "@/services/intervention-service";
import { apiService } from "@/services/api-service";
import { Intervention } from "@/constants/interfaces";

// Run: npm test -- intervention-service.test
// These test the service logic rather than the API calls

jest.mock("@/services/api-service", () => ({
	apiService: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() }
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

const mockIntervention: Intervention = {
	id: 1,
	profile_id: 1,
	name: "Kitchen Picture Match Activity",
	description: "We have placed pictures of food around the kitchen, move and match the picture.",
	goals: "Support naming and describing food items.",
	success: true,
	start_date: "2026-02-28",
	end_date: "2026-03-31"
};

const mockInterventions: Intervention[] = [
	mockIntervention, {...mockIntervention, id: 2, name: "Puzzle Games"}, {...mockIntervention, id: 3, name: "Morning Coffee Chats"}
];

beforeEach(() => {
	jest.clearAllMocks();
});

describe("getInterventions", () => {
	it ("Interventions are returned when there are interventions", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: { interventions: mockInterventions } });

		const result = await getInterventions(1);
		expect(mockApiService.get).toHaveBeenCalledWith("/interventions?profile_id=1");
		expect(result).toEqual(mockInterventions);
	});

	it ("An empty array is returned when there are no interventions", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: {} });

		const result = await getInterventions(1);
		expect(result).toEqual([]);
	});

	it ("Empty array is returned when response data is null", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: null });

		const result = await getInterventions(1);
		expect(result).toEqual([]);
	});

	it ("An error is returned when API call fails", async () => {
		const error = new Error("Network error");
		mockApiService.get.mockRejectedValueOnce(error);

		await expect(getInterventions(1)).rejects.toThrow("Network error");
	});
});

describe("getIntervention", () => {
	it ("The intervention is returned when there is an intervention", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: mockIntervention });

		const result = await getIntervention(1);
		expect(mockApiService.get).toHaveBeenCalledWith("/interventions/1");
		expect(result).toEqual(mockIntervention);
	});

	it ("An error is thrown when there is no intervention", async () => {
		const error = new Error("Not found");
		mockApiService.get.mockRejectedValueOnce(error);

		await expect(getIntervention(999)).rejects.toThrow("Not found");
	});
});

describe("createIntervention", () => {
	it ("The intervention is created", async () => {
		mockApiService.post.mockResolvedValueOnce({ data: mockIntervention });

		const result = await createIntervention(mockIntervention);
		expect(mockApiService.post).toHaveBeenCalledWith("/interventions", mockIntervention);
		expect(result).toEqual(mockIntervention);
	});

	it ("An error is thrown when intervention creation fails", async () => {
		const error = new Error("Create failed");
		mockApiService.post.mockRejectedValueOnce(error);

		await expect(createIntervention(mockIntervention)).rejects.toThrow("Create failed");
	});
});

describe("updateIntervention", () => {
	it ("The intervention is updated", async () => {
		const updatedIntervention = { ...mockIntervention, name: "Updated Therapy" };
		mockApiService.put.mockResolvedValueOnce({ data: updatedIntervention });

		const result = await updateIntervention(1, updatedIntervention);
		expect(mockApiService.put).toHaveBeenCalledWith("/interventions/1", updatedIntervention);
		expect(result).toEqual(updatedIntervention);
	});

	it ("An error is thrown when intervention update fails", async () => {
		const error = new Error("Update failed");
		mockApiService.put.mockRejectedValueOnce(error);

		await expect(updateIntervention(1, mockIntervention)).rejects.toThrow("Update failed");
	});
});

describe("deleteIntervention", () => {
	it ("The intervention is deleted", async () => {
		mockApiService.delete.mockResolvedValueOnce({});

		await deleteIntervention(1);
		expect(mockApiService.delete).toHaveBeenCalledWith("/interventions/1");
	});

	it ("An error is thrown when intervention deletion fails", async () => {
		const error = new Error("Delete failed");
		mockApiService.delete.mockRejectedValueOnce(error);

		await expect(deleteIntervention(1)).rejects.toThrow("Delete failed");
	});
});