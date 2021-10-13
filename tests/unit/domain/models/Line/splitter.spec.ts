import { TextLineSplitter } from "@/domain/models/Line/LineSplitter";
import { LineWidthManager } from "@/domain/models/Line/WidthManager";
import { Font } from "@/domain/models/Line/Font";
import { Text } from "@/domain/models/Label/Text";

jest.mock("@/domain/models/Line/Font");
const FontMock = Font as unknown as jest.Mock;

describe("TextLineSplitter", () => {
  const maxWidth = 5;
  const maxLabelWidth = 0;
  FontMock.mockImplementationOnce(() => {
    return {
      widthOfChar: (): number => {
        return 1;
      },
      widthOf: (): number => {
        return 1;
      },
    };
  });
  const font = new FontMock();

  const calculator = new LineWidthManager(font, maxWidth, maxLabelWidth);
  const splitter = new TextLineSplitter(calculator);
  const assertOffset = (text: string, expected: [number, number][]) => {
    const lines = splitter.split(new Text(text));
    for (let i = 0; i < lines.length; i++) {
      const actual = [lines[i].startOffset, lines[i].endOffset];
      expect(actual).toEqual(expected[i]);
    }
  };

  beforeEach(() => {
    calculator.reset();
  });

  it("newline is \n or \r", () => {
    const texts = ["Bush\nObama\nTrump", "Bush\rObama\rTrump"];
    const expected: [number, number][] = [
      [0, 4],
      [5, 10],
      [11, 16],
    ];
    for (const text of texts) {
      assertOffset(text, expected);
    }
  });

  it("newline is \r\n", () => {
    const text = "Bush\r\nObama\r\nTrump";
    const expected: [number, number][] = [
      [0, 4],
      [6, 11],
      [13, 18],
    ];
    assertOffset(text, expected);
  });
});
