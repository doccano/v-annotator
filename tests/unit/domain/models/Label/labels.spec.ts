import {
  EntityLabelListItem,
  LabelList,
  LabelListItem,
} from "@/domain/models/Label/Label";

describe("LabelListItem", () => {
  it("check properties", () => {
    const id = 0;
    const text = "text";
    const color = "color";
    const width = 10;
    const label = new LabelListItem(id, text, color, width);
    expect(label.id).toBe(id);
    expect(label.text).toBe(text);
    expect(label.color).toBe(color);
    expect(label.width).toBe(width);
  });
});

describe("EntityLabelListItem", () => {
  it("check width", () => {
    const width = 10;
    const label = new EntityLabelListItem(0, "text", "color", width);
    expect(label.width).toBeGreaterThan(width);
  });
});

describe("Labels", () => {
  const id = 0;
  const text = "text";
  const color = "color";
  const width = 10;
  const expected = new EntityLabelListItem(id, text, color, width);
  const labels = new LabelList([expected]);

  it("get by id", () => {
    expect(labels.getById(0)).toEqual(expected);
    expect(labels.getById(1)).toBeUndefined();
  });

  it("getColor", () => {
    expect(labels.getColor(id)).toBe(color);
    expect(labels.getColor(1)).toBeUndefined();
  });

  it("getText", () => {
    expect(labels.getText(id)).toBe(text);
    expect(labels.getText(1)).toBeUndefined();
  });

  it("getWidth", () => {
    expect(labels.getWidth(id)).toBeGreaterThan(width);
    expect(labels.getWidth(1)).toBeUndefined();
  });

  it("checkMaxLabelWidth", () => {
    expect(labels.maxLabelWidth).toBeGreaterThan(width);
  });

  it("check max width of empty labels", () => {
    const emptyLabels = new LabelList([]);
    expect(emptyLabels.maxLabelWidth).toBe(0);
  });

  it("check valueOf", () => {
    const labelObjects = [{ id, text, color }];
    const widths = [10];
    const entityLabels = LabelList.valueOf(
      labelObjects,
      widths,
      EntityLabelListItem
    );
    expect(entityLabels.getById(id)).toBeInstanceOf(EntityLabelListItem);
  });
});
