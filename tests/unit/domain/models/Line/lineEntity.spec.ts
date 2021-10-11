import { Range, Ranges } from "@/domain/models/Line/LineEntity";

describe("Ranges", () => {
  it("add", () => {
    const ranges = new Ranges();
    expect(ranges.items.length).toEqual(0);
    ranges.add(0, 0);
    expect(ranges.items.length).toEqual(1);
  });

  it("LTR items", () => {
    const ranges = new Ranges();
    ranges.add(0, 1);
    ranges.add(2, 3);
    const expected = [new Range(0, 1), new Range(2, 3)];
    expect(ranges.items).toEqual(expected);
  });

  it("RTL items", () => {
    const ranges = new Ranges(true);
    ranges.add(0, 1);
    ranges.add(2, 3);
    const expected = [new Range(2, 3), new Range(0, 1)];
    expect(ranges.items).toEqual(expected);
  });

  it("LTR first", () => {
    const ranges = new Ranges();
    ranges.add(0, 1);
    ranges.add(2, 3);
    const expected = new Range(0, 1);
    expect(ranges.first).toEqual(expected);
  });

  it("RTL first", () => {
    const ranges = new Ranges(true);
    ranges.add(0, 1);
    ranges.add(2, 3);
    const expected = new Range(2, 3);
    expect(ranges.first).toEqual(expected);
  });

  it("LTR center", () => {
    const ranges = new Ranges();
    ranges.add(0, 1);
    ranges.add(2, 3);
    const expected = 0.5;
    expect(ranges.center).toEqual(expected);
  });

  it("RTL center", () => {
    const ranges = new Ranges(true);
    ranges.add(0, 1);
    ranges.add(2, 3);
    const expected = 2.5;
    expect(ranges.center).toEqual(expected);
  });

  it("LTR getIntervals", () => {
    const ranges = new Ranges();
    ranges.add(0, 1);
    ranges.add(20, 30);
    const actual = ranges.getIntervals(true, 10);
    const expected = [
      [0, 10],
      [20, 30],
    ];
    expect(actual).toEqual(expected);
  });

  it("RTL getIntervals", () => {
    const ranges = new Ranges(true);
    ranges.add(0, 10);
    ranges.add(25, 30);
    const actual = ranges.getIntervals(true, 10);
    const expected = [
      [20, 30],
      [0, 10],
    ];
    expect(actual).toEqual(expected);
  });
});
