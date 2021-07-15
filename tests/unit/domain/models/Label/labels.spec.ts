import { Labels, Label } from "@/domain/models/Label/Label";

describe("Labels", () => {
  it("get by id", () => {
    const expected = new Label(0, "text", "color");
    const labels = new Labels([expected]);
    expect(labels.getById(0)).toEqual(expected);
    expect(labels.getById(1)).toBeUndefined();
  });

  it("can list", () => {
    const expected = [new Label(0, "text", "color")];
    const labels = new Labels(expected);
    expect(labels.list()).toEqual(expected);
  });
});
