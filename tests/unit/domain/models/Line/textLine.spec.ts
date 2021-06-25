import { TextLine } from "@/domain/models/Line/TextLine";

describe("Line component", () => {
  it("can get its content", () => {
    const content = "example text";
    const line = new TextLine(content, 0, content.length, new Map());
    expect(line.content).toMatch(content);
  });
});
