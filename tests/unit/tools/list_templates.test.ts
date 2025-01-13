import { handleListTemplates } from "../../../src/tools/list_templates/index.js";
import { PlacidClient } from "../../../src/services/placid/client.js";

// Mock the PlacidClient
jest.mock("../../../src/services/placid/client.js");

describe("handleListTemplates", () => {
  const mockConfig = {
    placidApiToken: "test-token",
    apiBaseUrl: "https://api.placid.app/api/rest",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should list templates without filters", async () => {
    const mockTemplates = {
      data: [
        {
          uuid: "template-1",
          title: "Test Template",
          thumbnail: "https://example.com/thumb.jpg",
          layers: [
            { name: "title", type: "text" },
            { name: "image", type: "picture" },
          ],
          tags: ["test"],
        },
      ],
    };

    (PlacidClient.prototype.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);

    const result = await handleListTemplates({}, mockConfig);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("Test Template");
    expect(result.content[0].text).toContain("template-1");
  });

  it("should handle API errors gracefully", async () => {
    (PlacidClient.prototype.listTemplates as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    const result = await handleListTemplates({}, mockConfig);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("Error listing templates");
  });

  it("should filter templates by collection", async () => {
    const mockTemplates = {
      data: [
        {
          uuid: "template-1",
          title: "Collection Template",
          thumbnail: null,
          layers: [{ name: "title", type: "text" }],
          tags: [],
        },
      ],
    };

    (PlacidClient.prototype.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);

    const result = await handleListTemplates(
      { collection_id: "test-collection" },
      mockConfig
    );

    expect(PlacidClient.prototype.listTemplates).toHaveBeenCalledWith({
      collection_id: "test-collection",
    });
    expect(result.content[0].text).toContain("Collection Template");
  });
});