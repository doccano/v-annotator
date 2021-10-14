import { LevelManager } from "@/domain/models/Line/LevelManager";

describe("LevelManager", () => {
  const item1 = { id: 0 };
  const item2 = { id: 1 };

  it("fetch level", () => {
    const manager = new LevelManager();
    manager.update(item1, [[0, 10]]);
    expect(manager.fetchLevel(item1)).toBe(0);
  });

  it("fetch empty", () => {
    const manager = new LevelManager();
    manager.update(item1, [[0, 10]]);
    expect(manager.fetchLevel(item2)).toBeUndefined();
  });

  it("fetch level without intersects", () => {
    const manager = new LevelManager();
    manager.update(item1, [[0, 10]]);
    manager.update(item2, [[10, 20]]);
    expect(manager.fetchLevel(item1)).toBe(0);
    expect(manager.fetchLevel(item2)).toBe(0);
  });

  it("fetch level with intersects", () => {
    const manager = new LevelManager();
    manager.update(item1, [[0, 10]]);
    manager.update(item2, [[9, 20]]);
    expect(manager.fetchLevel(item1)).toBe(0);
    expect(manager.fetchLevel(item2)).toBe(1);
  });

  it("clear", () => {
    const manager = new LevelManager();
    manager.update(item1, [[0, 10]]);
    expect(manager.fetchLevel(item1)).toBe(0);
    manager.clear();
    expect(manager.fetchLevel(item1)).toBeUndefined();
  });
});
