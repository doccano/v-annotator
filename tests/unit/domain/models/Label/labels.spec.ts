import {
  EntityLabelListItem,
  LabelList,
  LabelListItem,
} from "@/domain/models/Label/Label";
import config from "@/domain/models/Config/Config";

describe("LabelListItem", () => {
  it("check properties", () => {
    const id = 0;
    const text = "x".repeat(15);
    const color = "color";
    const width = 10;
    const label = new LabelListItem(id, text, color, width);
    const truncatedText = "x".repeat(config.maxLabelLength) + "...";
    expect(label.id).toBe(id);
    expect(label.text).toBe(text);
    expect(label.color).toBe(color);
    expect(label.width).toBe(width);
    expect(label.truncatedText).toBe(truncatedText);
  });

  it("check truncated text", () => {
    const text = "x".repeat(100);
    const width = 100;
    const label = new LabelListItem(0, text, "color", width);
    expect(label.truncatedText).toBe("x".repeat(config.maxLabelLength) + "...");
    expect(label.truncatedWidth).toBeLessThan(width);
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
    expect(labels.getWidth(id)).toBeGreaterThanOrEqual(width);
    expect(labels.getWidth(1)).toBeUndefined();
  });

  it("checkMaxLabelWidth", () => {
    expect(labels.maxLabelWidth).toBeGreaterThanOrEqual(width);
  });

  it("check max width of empty labels", () => {
    const emptyLabels = new LabelList([]);
    expect(emptyLabels.maxLabelWidth).toBe(0);
  });

  it("check valueOf", () => {
    const labelObjects = [{ id, text, color }];
    const widths = [10];
    const entityLabels = LabelList.valueOf(
      config.maxLabelLength,
      labelObjects,
      widths,
      EntityLabelListItem
    );
    expect(entityLabels.getById(id)).toBeInstanceOf(EntityLabelListItem);
  });
});
