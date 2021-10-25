import { Text } from "@/domain/models/Label/Text";
import { Entities } from "@/domain/models/Label/Entity";
import { TextSelector } from "@/domain/models/EventHandler/TextSelectionHandler";

jest.mock("@/domain/models/Label/Text");
const TextMock = Text as unknown as jest.Mock;
const range: [number, number] = [0, 5];
const graphemeRange: [number, number] = [1, 6];

class EntitiesIntersectMock extends Entities {
  intersectAny(startOffset: number, endOffset: number): boolean {
    return true;
  }
}

class EntitiesNotIntersectMock extends Entities {
  intersectAny(startOffset: number, endOffset: number): boolean {
    return false;
  }
}

describe("TextSelector", () => {
  TextMock.mockImplementation(() => {
    return {
      toGraphemeOffset: (offset: number): number => {
        return offset + 1; // rough simulation.
      },
    };
  });
  const handleErrorSpy = jest
    .spyOn(TextSelector.prototype as any, "getRange")
    .mockReturnValue(range);
  const text = new TextMock();
  const entitiesIntersect = new EntitiesIntersectMock([]);
  const entitiesNotIntersect = new EntitiesNotIntersectMock([]);

  it("allowOverlapping=false and graphemeMode=false", () => {
    const allowOverlapping = false;
    const graphemeMode = false;
    const textSelector = new TextSelector(allowOverlapping, graphemeMode);
    const actual = textSelector.getOffsets(entitiesNotIntersect, text);
    expect(actual).toEqual(range);
    expect(() => textSelector.getOffsets(entitiesIntersect, text)).toThrowError(
      RangeError
    );
  });

  it("allowOverlapping=true and graphemeMode=false", () => {
    const allowOverlapping = true;
    const graphemeMode = false;
    const textSelector = new TextSelector(allowOverlapping, graphemeMode);
    const actual1 = textSelector.getOffsets(entitiesNotIntersect, text);
    expect(actual1).toEqual(range);
    const actual2 = textSelector.getOffsets(entitiesIntersect, text);
    expect(actual2).toEqual(range);
  });

  it("allowOverlapping=false and graphemeMode=true", () => {
    const allowOverlapping = false;
    const graphemeMode = true;
    const textSelector = new TextSelector(allowOverlapping, graphemeMode);
    const actual = textSelector.getOffsets(entitiesNotIntersect, text);
    expect(actual).toEqual(graphemeRange);
    expect(() => textSelector.getOffsets(entitiesIntersect, text)).toThrowError(
      RangeError
    );
  });

  it("allowOverlapping=true and graphemeMode=true", () => {
    const allowOverlapping = true;
    const graphemeMode = true;
    const textSelector = new TextSelector(allowOverlapping, graphemeMode);
    const actual1 = textSelector.getOffsets(entitiesNotIntersect, text);
    expect(actual1).toEqual(graphemeRange);
    const actual2 = textSelector.getOffsets(entitiesIntersect, text);
    expect(actual2).toEqual(graphemeRange);
  });

  it("getRange gets the same start/end offsets", () => {
    const allowOverlapping = true;
    const graphemeMode = true;
    const spy = jest
      .spyOn(TextSelector.prototype as any, "getRange")
      .mockReturnValue([0, 0]);
    const textSelector = new TextSelector(allowOverlapping, graphemeMode);
    expect(() =>
      textSelector.getOffsets(entitiesNotIntersect, text)
    ).toThrowError(RangeError);
    spy.mockClear();
  });
});
