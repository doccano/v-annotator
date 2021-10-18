import { LineWidthManager } from "@/domain/models/Line/WidthManager";

let calculator: LineWidthManager;
const maxWidth = 3;

beforeEach(() => {
  calculator = new LineWidthManager(maxWidth, 0);
});

describe("Width", () => {
  it("add character", () => {
    expect(calculator.width).toEqual(0);
    calculator.add(1);
    expect(calculator.width).toEqual(1);
  });
});
