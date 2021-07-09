import { Entity } from "@/domain/models/Label/Entity";
import { Entities } from "@/domain/models/Label/Entity";

describe("Entities component", () => {
  it("can filter by range", () => {
    const content = "example text";
    const entities = new Entities([
      new Entity(0, 0, 0, 0, content.length),
      new Entity(0, 0, 0, 0, content.length + 1),
      new Entity(0, 0, 0, content.length, content.length + 1),
    ]);
    const expected = new Entities([
      new Entity(0, 0, 0, 0, content.length),
      new Entity(0, 0, 0, 0, content.length + 1),
    ]);
    const actual = entities.filterByRange(0, content.length);
    expect(actual).toEqual(expected);
  });

  it("calculate level", () => {
    const entities = new Entities([
      new Entity(0, 0, 0, 0, 5),
      new Entity(1, 0, 0, 1, 7),
      new Entity(2, 0, 0, 2, 8),
      new Entity(3, 0, 0, 6, 9),
    ]);
    expect(entities.getLevelOf(0)).toEqual(0);
    expect(entities.getLevelOf(1)).toEqual(1);
    expect(entities.getLevelOf(2)).toEqual(2);
    expect(entities.getLevelOf(3)).toEqual(0);
  });
});
