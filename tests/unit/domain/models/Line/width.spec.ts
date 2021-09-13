import { LineWidthManager } from "@/domain/models/Line/WidthManager";
import { Font } from "@/domain/models/Line/Font";

let calculator: LineWidthManager;
const maxWidth = 3;

beforeEach(() => {
  const text = "abc";
  const width = new Map();
  for (const ch of Array.from(text)) {
    width.set(ch, 1);
  }
  const font = new Font(0, "0", "0", 0, width);
  calculator = new LineWidthManager(font, maxWidth);
});

describe("Width", () => {
  it("add character", () => {
    expect(calculator.width).toEqual(0);
    calculator.add("a");
    expect(calculator.width).toEqual(1);
  });
});
