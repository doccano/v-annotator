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
  it("calculate width", () => {
    expect(calculator.calculateWidth("a")).toEqual(1);
    expect(calculator.calculateWidth("d")).toEqual(0);
  });

  it("add character", () => {
    expect(calculator.width).toEqual(0);
    calculator.add("a");
    expect(calculator.width).toEqual(1);
  });

  it("add width", () => {
    expect(calculator.width).toEqual(0);
    calculator.addWidth(3);
    expect(calculator.width).toEqual(3);
  });

  it("can reset", () => {
    calculator.addWidth(3);
    expect(calculator.width).toEqual(3);
    calculator.reset();
    expect(calculator.width).toEqual(0);
  });

  it("check remains", () => {
    expect(calculator.remains()).toBeFalsy();
    calculator.addWidth(1);
    expect(calculator.remains()).toBeTruthy();
  });

  it("check needsNewline", () => {
    expect(calculator.needsNewline("", 0)).toBeFalsy();
    expect(calculator.needsNewline("", maxWidth - 1)).toBeFalsy();
    expect(calculator.needsNewline("", maxWidth)).toBeTruthy();
    expect(calculator.needsNewline("\n", 0)).toBeTruthy();
    calculator.addWidth(2);
    expect(calculator.needsNewline("", 0)).toBeFalsy();
    expect(calculator.needsNewline("", 1)).toBeTruthy();
    calculator.reset();
    calculator.addWidth(3);
    expect(calculator.needsNewline("", 0)).toBeTruthy();
  });
});
