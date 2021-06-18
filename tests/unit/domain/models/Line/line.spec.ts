import { Line } from "@/domain/models/Line";

describe("Line component", () => {
  it("can get its content", () => {
    const content = "example text";
    const line = new Line(content);
    expect(line.content).toMatch(content);
  });
});
