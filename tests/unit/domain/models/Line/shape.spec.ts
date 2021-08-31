import { Circle } from "@/domain/models/Line/Shape";
import { Font } from "@/domain/models/Line/Font";
import { LabelText } from "@/domain/models/Line/Shape";

describe("Circle", () => {
  it("calculate width", () => {
    const radius = 3;
    const circle = new Circle(radius);
    const expected = radius * 2;
    expect(circle.width).toEqual(expected);
  });
});

describe("LabelText", () => {
  it("calculate width", () => {
    const text = "abc";
    const width = new Map();
    for (const ch of Array.from(text)) {
      width.set(ch, 1);
    }
    const font = new Font(0, "", "", 0, width);
    const labelText = new LabelText(text, font.widthOf(text));
    expect(labelText.width).toEqual(text.length);
  });
});
