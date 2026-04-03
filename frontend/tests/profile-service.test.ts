import { getProfiles, getProfile, createProfile, updateProfile, deleteProfile } from "@/services/profile-service";
import { apiService } from "@/services/api-service";
import { Profile } from "@/constants/interfaces";

// Run: npm test -- profile-service.test
// These test the service logic rather than the API calls

jest.mock("@/services/api-service", () => ({ 
	apiService: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() } 
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

const mockProfile: Profile = {
	id: 1,
	first_name: "John",
	last_name: "Doe",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

const mockProfiles: Profile[] = [mockProfile, { ...mockProfile, id: 2, first_name: "Jane", last_name: "Doe" }];

beforeEach(() => {
	jest.clearAllMocks();
});

describe("getProfiles", () => {
	it ("Profiles are returned when there are profiles", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: { profiles: mockProfiles } });

		const result = await getProfiles();
		expect(mockApiService.get).toHaveBeenCalledWith("/profiles");
		expect(result).toEqual(mockProfiles);
	});

	it ("An empty array is returned when there are no profiles", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: {} });

		const result = await getProfiles();
		expect(result).toEqual([]);
	});

	it ("Empty array is returned when response data is null", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: null });

		const result = await getProfiles();

		expect(result).toEqual([]);
	});

	it ("An error is returned when API call fails", async () => {
		const error = new Error("Network error");
		mockApiService.get.mockRejectedValueOnce(error);

		await expect(getProfiles()).rejects.toThrow("Network error");
	});
});

describe("getProfile", () => {
	it ("The profile is returned when there is a profile", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: mockProfile });

		const result = await getProfile(1);
		expect(mockApiService.get).toHaveBeenCalledWith("/profiles/1");
		expect(result).toEqual(mockProfile);
	});

	it ("An error is thrown when there is no profile", async () => {
		const error = new Error("Not found");
		mockApiService.get.mockRejectedValueOnce(error);

		await expect(getProfile(999)).rejects.toThrow("Not found");
	});
});

describe("createProfile", () => {
	it ("The profile is created", async () => {
		mockApiService.post.mockResolvedValueOnce({ data: mockProfile });

		const result = await createProfile(mockProfile);
		expect(mockApiService.post).toHaveBeenCalledWith("/profiles", mockProfile);
		expect(result).toEqual(mockProfile);
	});

	it ("An error is thrown when profile creation fails", async () => {
		const error = new Error("Create failed");
		mockApiService.post.mockRejectedValueOnce(error);

		await expect(createProfile(mockProfile)).rejects.toThrow("Create failed");
	});
});

describe("updateProfile", () => {
	it ("The profile is updated", async () => {
		const updatedProfile = { ...mockProfile, first_name: "Bob", last_name: "Marley" };
		mockApiService.put.mockResolvedValueOnce({ data: updatedProfile });

		const result = await updateProfile(1, updatedProfile);
		expect(mockApiService.put).toHaveBeenCalledWith("/profiles/1", updatedProfile);
		expect(result).toEqual(updatedProfile);
	});

	it ("An error is thrown when profile update fails", async () => {
		const error = new Error("Update failed");
		mockApiService.put.mockRejectedValueOnce(error);

		await expect(updateProfile(1, mockProfile)).rejects.toThrow("Update failed");
	});
});

describe("deleteProfile", () => {
	it ("The profile is deleted", async () => {
		mockApiService.delete.mockResolvedValueOnce({});

		await deleteProfile(1);
		expect(mockApiService.delete).toHaveBeenCalledWith("/profiles/1");
	});

	it ("An error is thrown when profile deletion fails", async () => {
		const error = new Error("Delete failed");
		mockApiService.delete.mockRejectedValueOnce(error);

		await expect(deleteProfile(1)).rejects.toThrow("Delete failed");
	});
});