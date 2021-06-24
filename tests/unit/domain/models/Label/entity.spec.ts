import { Entity } from '@/domain/models/Label/Entity';


describe("Entity component", () => {
  it("check isIn", () => {
    const entity = new Entity(0, 0, 0, 1, 3);
    expect(entity.isIn(0, 2)).toBeTruthy();
    expect(entity.isIn(2, 4)).toBeTruthy();
    expect(entity.isIn(2, 2)).toBeTruthy();
    expect(entity.isIn(1, 3)).toBeTruthy();
    expect(entity.isIn(0, 1)).toBeFalsy();
    expect(entity.isIn(3, 4)).toBeFalsy();
  });
});
