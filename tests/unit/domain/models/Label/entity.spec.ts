import { Entity } from "@/domain/models/Label/Entity";

describe("Entity component", () => {
  it("validate offset", () => {
    expect(() => new Entity(0, 0, 0, 1, 0)).toThrow(RangeError);
  });

  it("check isIn", () => {
    const entity = new Entity(
      0,
      0,
      0,
      1, // startOffset,
      3 // endOffset
    );
    expect(entity.isIn(0, 2)).toBeTruthy();
    expect(entity.isIn(2, 4)).toBeTruthy();
    expect(entity.isIn(2, 2)).toBeTruthy();
    expect(entity.isIn(1, 3)).toBeTruthy();
    expect(entity.isIn(0, 1)).toBeFalsy();
    expect(entity.isIn(3, 4)).toBeFalsy();
  });

  it("check equality", () => {
    const entity1 = new Entity(0, 0, 0, 0, 0);
    const entity2 = new Entity(1, 0, 0, 0, 0);
    expect(entity1.equalTo(entity1)).toBeTruthy();
    expect(entity1.equalTo(entity2)).toBeFalsy();
  });

  it("starsAfter", () => {
    const entity = new Entity(0, 0, 0, 3, 5);
    expect(entity.startsAfter(3)).toBeTruthy();
    expect(entity.startsAfter(4)).toBeFalsy();
  });

  it("check center", () => {
    const entity = new Entity(0, 0, 0, 1, 2);
    expect(entity.center).toEqual(1.5);
  });
});
