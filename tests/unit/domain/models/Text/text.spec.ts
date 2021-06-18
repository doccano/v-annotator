import { Text } from "@/domain/models/Text/Text";

describe("Text component", () => {
  it("can get its content", () => {
    const content = "example text";
    const text = new Text(content);
    expect(text.content).toMatch(content);
  });
});
