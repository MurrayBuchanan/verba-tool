import { getTranscripts, getTranscript, deleteTranscript } from "@/services/transcript-service";
import { apiService } from "@/services/api-service";
import { TranscriptWithFeatures, TranscriptWithSegments } from "@/constants/interfaces";

// Run: npm test -- transcript-service.test

jest.mock("@/services/api-service", () => ({
	apiService: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() }
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

const mockTranscript: TranscriptWithFeatures = {
	id: 1,
	profile_id: 1,
	created_at: "2026-02-14T00:00:00Z",
	total_duration: 17,
	words_per_minute: { total: 120 },
	average_word_length: { total: 3.89 },
	adverb_ratio: { total: 0.11 },
	flesch_kincaid_grade: { total: 3.2 },
	personal_pronoun_ratio: { total: 0.4 },
	number_of_unique_words: { total: 1 },
	impoverished_vocabulary: { total: 1 },
	word_finding_difficulties: { total: 1 },
	semantic_paraphasias: { total: 1 },
	syntactic_simplification: { total: 2 },
	discourse_impairment: { total: 2 }
};

const mockTranscriptsWithFeatures: TranscriptWithFeatures[] = [
	mockTranscript, {...mockTranscript, id: 2}, {...mockTranscript, id: 3}, {...mockTranscript, id: 4}
];

const mockTranscription: TranscriptWithSegments = {
	id: 1,
	profile_id: 1,
	created_at: "2026-02-14T00:00:00Z",
	total_duration: 17,
	segments: [
		{
			duration: 5,
			offset: 0,
			speaker: "You",
			text: "Describe what you see in this picture."
		},
		{
			duration: 7,
			offset: 5,
			speaker: "John Doe",
			text: "I see 3 figures in the picture, they are all doing an activity of sorts."
		}
	]
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe("getTranscripts", () => {
	it ("Transcripts are returned when there are transcripts", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: { transcripts: mockTranscriptsWithFeatures } });

		const result = await getTranscripts(1);
		expect(mockApiService.get).toHaveBeenCalledWith("/transcripts?profile_id=1");
		expect(result).toEqual(mockTranscriptsWithFeatures);
	});

	it ("An empty array is returned when there are no transcripts", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: {} });

		const result = await getTranscripts(1);
		expect(result).toEqual([]);
	});

	it ("Empty array is returned when response data is null", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: null });

		const result = await getTranscripts(1);
		expect(result).toEqual([]);
	});

	it ("An error is returned when API call fails", async () => {
		const error = new Error("Network error");
		mockApiService.get.mockRejectedValueOnce(error);

		await expect(getTranscripts(1)).rejects.toThrow("Network error");
	});
});

describe("getTranscript", () => {
	it ("The transcript is returned when it is found", async () => {
		mockApiService.get.mockResolvedValueOnce({ data: mockTranscription });

		const result = await getTranscript(1);
		expect(mockApiService.get).toHaveBeenCalledWith("/transcripts/1");
		expect(result).toEqual(mockTranscription);
	});

	it ("An error is thrown when the transcript is not found", async () => {
		const error = new Error("Not found");
		mockApiService.get.mockRejectedValueOnce(error);

		await expect(getTranscript(999)).rejects.toThrow("Not found");
	});
});

describe("deleteTranscript", () => {
	it ("The transcript is deleted", async () => {
		mockApiService.delete.mockResolvedValueOnce({});

		await deleteTranscript(1);
		expect(mockApiService.delete).toHaveBeenCalledWith("/transcripts/1");
	});

	it ("An error is thrown when transcript deletion fails", async () => {
		const error = new Error("Delete failed");
		mockApiService.delete.mockRejectedValueOnce(error);

		await expect(deleteTranscript(1)).rejects.toThrow("Delete failed");
	});
});