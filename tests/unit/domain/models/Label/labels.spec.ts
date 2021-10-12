import { EntityLabelListItem, LabelList } from "@/domain/models/Label/Label";

describe("Labels", () => {
  it("get by id", () => {
    const expected = new EntityLabelListItem(0, "text", "color", 0);
    const labels = new LabelList([expected]);
    expect(labels.getById(0)).toEqual(expected);
    expect(labels.getById(1)).toBeUndefined();
  });
});
