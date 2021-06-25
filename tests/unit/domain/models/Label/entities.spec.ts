import { Entity } from "@/domain/models/Label/Entity";
import { TextLine } from "@/domain/models/Line/TextLine";
import { Entities } from "@/domain/models/Label/Entity";

describe("Entities component", () => {
  it("can filter by range", () => {
    const content = "example text";
    const textLine = new TextLine(content, 0, content.length, new Map());
    const entities = new Entities([
      new Entity(0, 0, 0, 0, content.length),
      new Entity(0, 0, 0, 0, content.length + 1),
      new Entity(0, 0, 0, content.length, content.length + 1),
    ]);
    const expected = new Entities([
      new Entity(0, 0, 0, 0, content.length),
      new Entity(0, 0, 0, 0, content.length + 1),
    ]);
    const actual = entities.filterByRange(
      textLine.startOffset,
      textLine.endOffset
    );
    expect(actual).toEqual(expected);
  });
});
