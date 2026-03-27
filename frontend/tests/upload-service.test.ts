import { upload } from "@/services/upload-service";
import { apiService } from "@/services/api-service";

// Run: npm test -- upload-service.test

jest.mock("@/services/api-service", () => ({
	apiService: { post: jest.fn() }
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

beforeEach(() => {
	jest.clearAllMocks();
});

const mockProfileId = 1;
const mockAudio = "sample-audio.m4a";
const mockCreatedAt = new Date("2026-04-02T12:00:00.000Z");

const mockResponse = {
	id: 1,
	profile_id: 1,
	created_at: "2026-02-14T00:00:00Z",
	total_duration: 45.2,
	words_per_minute: { "Speaker-1": 120 },
	average_word_length: { "Speaker-1": 3.89 },
	adverb_ratio: { "Speaker-1": 0.11 },
	flesch_kincaid_grade: { "Speaker-1": 3.2 },
	personal_pronoun_ratio: { "Speaker-1": 0.4 },
	number_of_unique_words: { "Speaker-1": 1 },
	impoverished_vocabulary: { "Speaker-1": 1 },
	word_finding_difficulties: { "Speaker-1": 1 },
	semantic_paraphasias: { "Speaker-1": 1 },
	syntactic_simplification: { "Speaker-1": 2 },
	discourse_impairment: { "Speaker-1": 2 },
	raw_segments: [
		{
			duration: 7,
			offset: 5,
			speaker: "Speaker-1",
			text: "I see 3 figures in the picture, they are all doing an activity of sorts."
		}
	],
};

describe("upload", () => {
	it ("The response data is returned when upload is successful", async () => {
		mockApiService.post.mockResolvedValueOnce({ data: mockResponse });

		const response = await upload(mockProfileId, mockAudio, mockCreatedAt);

		expect(mockApiService.post).toHaveBeenCalledTimes(1);
		expect(response).toEqual(mockResponse);
	});

	it("The request runs with the correct headers", async () => {
		mockApiService.post.mockResolvedValueOnce({ data: mockResponse });
		await upload(mockProfileId, mockAudio, mockCreatedAt);

		const expectedConfig = {
			timeout: 600000,
			headers: {
				"Profile-Id": mockProfileId.toString(),
				"Created-At": mockCreatedAt.toISOString(),
				"Content-Type": undefined
			}
		};
		expect(mockApiService.post).toHaveBeenCalledTimes(1);
		expect(mockApiService.post).toHaveBeenCalledWith("/upload", expect.any(FormData), expectedConfig);
	});

	it ("An error is thrown when upload fails", async () => {
		const error = new Error("Network error");
		mockApiService.post.mockRejectedValueOnce(error);

		await expect(upload(mockProfileId, mockAudio, mockCreatedAt)).rejects.toThrow("Network error");
		expect(mockApiService.post).toHaveBeenCalledTimes(1);
	});
});