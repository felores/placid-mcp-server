import { handleGenerateCreative } from "../../../src/tools/generate_creative/index.js";
import { PlacidClient } from "../../../src/services/placid/client.js";

// Mock the PlacidClient
jest.mock("../../../src/services/placid/client.js");

describe("handleGenerateCreative", () => {
  const mockConfig = {
    placidApiToken: "test-token",
    apiBaseUrl: "https://api.placid.app/api/rest",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate creative successfully with immediate completion", async () => {
    const mockResponse = {
      id: 1,
      status: "finished",
      image_url: "https://placid.app/u/test.jpg",
      polling_url: null,
    };

    (PlacidClient.prototype.generateCreative as jest.Mock).mockResolvedValue(mockResponse);

    const result = await handleGenerateCreative(
      {
        template_id: "template-1",
        layers: {
          title: { text: "Test Title" },
          image: { image: "https://example.com/image.jpg" },
        },
      },
      mockConfig
    );

    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("https://placid.app/u/test.jpg");
  });

  it("should handle queued generation with polling", async () => {
    const mockQueuedResponse = {
      id: 1,
      status: "queued",
      image_url: null,
      polling_url: "https://api.placid.app/api/rest/images/1",
    };

    const mockFinishedResponse = {
      id: 1,
      status: "finished",
      image_url: "https://placid.app/u/test.jpg",
      polling_url: null,
    };

    (PlacidClient.prototype.generateCreative as jest.Mock).mockResolvedValue(mockQueuedResponse);
    (PlacidClient.prototype.getCreativeStatus as jest.Mock)
      .mockResolvedValueOnce({ ...mockQueuedResponse })
      .mockResolvedValueOnce(mockFinishedResponse);

    const result = await handleGenerateCreative(
      {
        template_id: "template-1",
        layers: {
          title: { text: "Test Title" },
        },
      },
      mockConfig
    );

    expect(result.content[0].text).toContain("https://placid.app/u/test.jpg");
    expect(PlacidClient.prototype.getCreativeStatus).toHaveBeenCalledTimes(2);
  });

  it("should handle generation errors", async () => {
    (PlacidClient.prototype.generateCreative as jest.Mock).mockRejectedValue(
      new Error("Generation failed")
    );

    const result = await handleGenerateCreative(
      {
        template_id: "template-1",
        layers: {
          title: { text: "Test Title" },
        },
      },
      mockConfig
    );

    expect(result.content[0].text).toContain("Error generating creative");
  });
});