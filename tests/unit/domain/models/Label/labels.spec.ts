import {
  EntityLabelListItem,
  EntityLabelList,
} from "@/domain/models/Label/Label";

describe("Labels", () => {
  it("get by id", () => {
    const expected = new EntityLabelListItem(0, "text", "color", 0);
    const labels = new EntityLabelList([expected]);
    expect(labels.getById(0)).toEqual(expected);
    expect(labels.getById(1)).toBeUndefined();
  });

  it("can list", () => {
    const expected = [new EntityLabelListItem(0, "text", "color", 0)];
    const labels = new EntityLabelList(expected);
    expect(labels.list()).toEqual(expected);
  });
});
