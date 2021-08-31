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
    expect(actual).toEqual(expected.list());
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
    expect(entities.getAt(0)).toEqual(entities.list());

    const expected = new Entities([]);
    expect(entities.getAt(1)).toEqual(expected.list());
  });

  it("can list", () => {
    const expected = [new Entity(0, 0, 0, 0, 0)];
    const entities = new Entities(expected);
    expect(entities.list()).toEqual(expected);
  });

  it("can filter by range", () => {
    const entities = new Entities([new Entity(0, 0, 0, 1, 5)]);
    expect(entities.filterByRange(0, 1).length == 0).toBeTruthy();
    expect(entities.filterByRange(1, 5).length == 0).toBeFalsy();
    expect(entities.filterByRange(1, 6).length == 0).toBeFalsy();
    expect(entities.filterByRange(4, 6).length == 0).toBeFalsy();
    expect(entities.filterByRange(5, 6).length == 0).toBeTruthy();
  });

  it("can get size", () => {
    const entities = new Entities([new Entity(0, 0, 0, 0, 0)]);
    expect(entities.size).toEqual(1);
  });

  it("delete", () => {
    const entities = new Entities([
      new Entity(0, 0, 0, 0, 5),
      new Entity(1, 0, 0, 0, 5),
    ]);
    const expected = [new Entity(1, 0, 0, 0, 5)];
    entities.delete(entities.list()[0]);
    expect(entities.list()).toEqual(expected);
  });

  it("add", () => {
    const entities = new Entities([]);
    entities.add(new Entity(1, 0, 0, 0, 5));
    const expected = [new Entity(1, 0, 0, 0, 5)];
    expect(entities.list()).toEqual(expected);
  });

  it("replace", () => {
    const oldEntity = new Entity(0, 0, 0, 0, 5);
    const newEntity = new Entity(0, 0, 0, 3, 5);
    const entities = new Entities([oldEntity]);
    entities.replace(oldEntity, newEntity);
    const expected = [newEntity];
    expect(entities.list()).toEqual(expected);
  });

  it("update", () => {
    const entities = new Entities([
      new Entity(0, 0, 0, 0, 5),
      new Entity(1, 0, 0, 3, 5),
      new Entity(2, 0, 0, 3, 5),
    ]);
    const newEntities = [new Entity(1, 0, 0, 3, 5), new Entity(2, 0, 0, 4, 5)];
    entities.update(newEntities);
    expect(entities.list()).toEqual(newEntities);
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
