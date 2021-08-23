import {
  SimpleLineSplitter,
  TextLineSplitter,
} from "@/domain/models/Line/TextLineSplitter";
import { TextWidthCalculator } from "@/domain/models/Line/Strategy";
import { Font } from "@/domain/models/Line/Font";
import { EntityLabel, EntityLabels } from "@/domain/models/Line/Shape";
import { Entity, Entities } from "@/domain/models/Label/Entity";

jest.mock("@/domain/models/Line/Font");
jest.mock("@/domain/models/Line/Shape");
const FontMock = Font as jest.Mock;
const EntityLabelMock = EntityLabel as jest.Mock;
const EntityLabelsMock = EntityLabels as jest.Mock;

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

describe("TextLineSplitter", () => {
  const text = "Biden";
  const maxWidth = 2;
  FontMock.mockImplementationOnce(() => {
    return {
      widthOfChar: (): number => {
        return 1;
      },
    };
  });
  const font = new FontMock();

  EntityLabelMock.mockImplementationOnce(() => {
    return {
      width: (): number => {
        return maxWidth;
      },
    };
  });

  EntityLabelsMock.mockImplementationOnce(() => {
    return {
      maxLabelWidth: (): number => {
        return 0;
      },
      getById: (): EntityLabel => {
        return new EntityLabelMock();
      },
    };
  });
  const entityLabels = new EntityLabelsMock();

  const calculator = new TextWidthCalculator(font, maxWidth);
  const splitter = new TextLineSplitter(calculator, entityLabels);
  const entities = new Entities([new Entity(0, 0, 0, 0, 5)]);

  beforeEach(() => {
    calculator.reset();
  });

  it("startOffset is 0", () => {
    const startOffset = 0;
    const lines = splitter.split(text, startOffset, entities);
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

  it("startOffset is not 0", () => {
    const startOffset = 2;
    const lines = splitter.split(text, startOffset, entities);
    const expected = [
      [2, 4],
      [4, 5],
    ];
    let i = 0;
    for (const line of lines) {
      expect([line.startOffset, line.endOffset]).toEqual(expected[i++]);
    }
    expect(i).toEqual(2);
  });
});
