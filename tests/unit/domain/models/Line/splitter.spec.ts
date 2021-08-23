import { SimpleLineSplitter } from "@/domain/models/Line/TextLineSplitter";
import { TextWidthCalculator } from "@/domain/models/Line/Strategy";
import { Font } from "@/domain/models/Line/Font";
jest.mock("@/domain/models/Line/Font");
const FontMock = Font as jest.Mock;

describe("SimpleLineSplitter", () => {
  const text = "abc";
  const maxWidth = 1;
  FontMock.mockImplementationOnce(() => {
    return {
      widthOfChar: (): number => {
        return 1;
      },
    };
  });

  const font = new FontMock();
  const calculator = new TextWidthCalculator(font, maxWidth);
  const splitter = new SimpleLineSplitter(calculator);

  beforeEach(() => {
    calculator.reset();
  });

  it("startOffset is 0", () => {
    const lines = splitter.split(text);
    let i = 0;
    for (const line of lines) {
      expect(line.startOffset).toEqual(i);
      expect(line.endOffset).toEqual(i + 1);
      i++;
    }
    expect(i).toEqual(3);
  });

  it("startOffset is not 0", () => {
    const startOffset = 1;
    const lines = splitter.split(text, startOffset);
    let i = 0;
    for (const line of lines) {
      expect(line.startOffset).toEqual(startOffset + i);
      expect(line.endOffset).toEqual(startOffset + i + 1);
      i++;
    }
    expect(i).toEqual(2);
  });
});
