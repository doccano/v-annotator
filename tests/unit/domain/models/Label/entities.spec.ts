import { Entity } from "@/domain/models/Label/Entity";
import { Entities } from "@/domain/models/Label/Entity";

describe("Entities", () => {
  it("can be filtered by range", () => {
    const content = "example text";
    const entities = new Entities([
      new Entity(0, 0, 0, 0, content.length),
      new Entity(0, 0, 0, 0, content.length + 1),
      new Entity(0, 0, 0, content.length, content.length + 1),
    ]);
    const expected = [
      new Entity(0, 0, 0, 0, content.length),
      new Entity(0, 0, 0, 0, content.length + 1),
    ];
    const actual = entities.filterByRange(0, content.length);
    expect(actual).toEqual(expected);
  });

  it("can filter by range", () => {
    const entities = new Entities([new Entity(0, 0, 0, 1, 5)]);
    expect(entities.filterByRange(0, 1).length == 0).toBeTruthy();
    expect(entities.filterByRange(1, 5).length == 0).toBeFalsy();
    expect(entities.filterByRange(1, 6).length == 0).toBeFalsy();
    expect(entities.filterByRange(4, 6).length == 0).toBeFalsy();
    expect(entities.filterByRange(5, 6).length == 0).toBeTruthy();
  });

  it("return empty list by filtering", () => {
    const entities = new Entities([]);
    expect(entities.filterByRange(0, 1)).toEqual([]);
  });

  it("can get size", () => {
    const entities = new Entities([new Entity(0, 0, 0, 0, 0)]);
    expect(entities.size).toEqual(1);
  });
});
