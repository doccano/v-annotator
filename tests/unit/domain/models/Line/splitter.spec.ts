import { TextLineSplitter } from "@/domain/models/Line/TextLineSplitter";
import { LineWidthManager } from "@/domain/models/Line/WidthManager";
import { Font } from "@/domain/models/Line/Font";

jest.mock("@/domain/models/Line/Font");
const FontMock = Font as jest.Mock;

describe("TextLineSplitter", () => {
  const text = "Biden";
  const maxWidth = 2;
  const maxLabelWidth = 0;
  FontMock.mockImplementationOnce(() => {
    return {
      widthOfChar: (): number => {
        return 1;
      },
    };
  });
  const font = new FontMock();

  const calculator = new LineWidthManager(font, maxWidth, maxLabelWidth);
  const splitter = new TextLineSplitter(calculator);

  beforeEach(() => {
    calculator.reset();
  });

  it("startOffset is 0", () => {
    const lines = splitter.split(text);
    const expected = [
      [0, 2],
      [2, 4],
      [4, 5],
    ];
    let i = 0;
    for (const line of lines) {
      expect([line.startOffset, line.endOffset]).toEqual(expected[i++]);
    }
    expect(i).toEqual(3);
  });
});
