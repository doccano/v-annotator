import { Entity } from "@/domain/models/Label/Entity";
import { Entities, LevelManager } from "@/domain/models/Label/Entity";

describe("Entities", () => {
  it("can be filtered by range", () => {
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

  it("is empty", () => {
    const entities = new Entities([]);
    expect(entities.isEmpty()).toBeTruthy();
  });

  it("is not empty", () => {
    const entities = new Entities([new Entity(0, 0, 0, 0, 0)]);
    expect(entities.isEmpty()).toBeFalsy();
  });

  it("starts at", () => {
    const entities = new Entities([new Entity(0, 0, 0, 0, 5)]);
    expect(entities.startsAt(0)).toBeTruthy();
    expect(entities.startsAt(1)).toBeFalsy();
  });

  it("get at", () => {
    const entities = new Entities([new Entity(0, 0, 0, 0, 5)]);
    expect(entities.getAt(0)).toEqual(entities);

    const expected = new Entities([]);
    expect(entities.getAt(1)).toEqual(expected);
  });

  it("can list", () => {
    const expected = [new Entity(0, 0, 0, 0, 0)];
    const entities = new Entities(expected);
    expect(entities.list()).toEqual(expected);
  });

  it("can filter by range", () => {
    const entities = new Entities([new Entity(0, 0, 0, 1, 5)]);
    expect(entities.filterByRange(0, 1).isEmpty()).toBeTruthy();
    expect(entities.filterByRange(1, 5).isEmpty()).toBeFalsy();
    expect(entities.filterByRange(1, 6).isEmpty()).toBeFalsy();
    expect(entities.filterByRange(4, 6).isEmpty()).toBeFalsy();
    expect(entities.filterByRange(5, 6).isEmpty()).toBeTruthy();
  });

  it("can get size", () => {
    const entities = new Entities([new Entity(0, 0, 0, 0, 0)]);
    expect(entities.size).toEqual(1);
  });
});

describe("LevelManager", () => {
  it("can calculate level", () => {
    const entities = [
      new Entity(0, 0, 0, 0, 5),
      new Entity(1, 0, 0, 1, 7),
      new Entity(2, 0, 0, 2, 8),
      new Entity(3, 0, 0, 6, 9),
    ];
    const manager = new LevelManager();
    entities.forEach((entity) => {
      manager.update(entity);
    });
    expect(manager.fetchLevel(entities[0])).toEqual(0);
    expect(manager.fetchLevel(entities[1])).toEqual(1);
    expect(manager.fetchLevel(entities[2])).toEqual(2);
    expect(manager.fetchLevel(entities[3])).toEqual(0);
  });
});
