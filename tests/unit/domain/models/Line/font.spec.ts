import { Font } from "@/domain/models/Line/Font";

describe("Font", () => {
  it("calculate width", () => {
    const text = "abc";
    const width = new Map();
    for (const ch of Array.from(text)) {
      width.set(ch, 1);
    }
    const font = new Font(0, "0", "0", 0, width);
    expect(font.widthOf("abc")).toEqual(3);
    expect(font.widthOf("a")).toEqual(1);
    expect(font.widthOf("")).toEqual(0);
    expect(font.widthOf("unknown")).toEqual(0);
  });
});
