import { Entity } from "@/domain/models/Label/Entity";
import { EntityLineSplitter } from "@/domain/models/Line/EntityLineSplitter";
import { TextLine } from "@/domain/models/Line/TextLine";

describe("EntityLineSplitter component", () => {
  it("can split", () => {
    const content = "example text";
    const textLine = new TextLine(content, 0, content.length);
    const splitter = new EntityLineSplitter(textLine);
    const entities = [
      new Entity(0, 0, 0, 0, content.length),
      new Entity(0, 0, 0, 0, content.length + 1),
      new Entity(0, 0, 0, content.length, content.length + 1),
    ];
    const lines = splitter.split(entities);
    const expected = [entities[0], entities[1]];
    expect(lines).toEqual(expected);
  });
});
