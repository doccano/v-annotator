import IntervalTree from "@flatten-js/interval-tree";
import { TextLineSplitter } from "@/domain/models/Line/LineSplitter";
import { LineWidthManager } from "@/domain/models/Line/WidthManager";
import { Font } from "@/domain/models/Line/Font";
import { Entity, Entities } from "@/domain/models/Label/Entity";
import { Text } from "@/domain/models/Label/Text";

jest.mock("@/domain/models/Line/Font");
const FontMock = Font as unknown as jest.Mock;

describe("Subject", () => {
  const text =
    "we must respect the will of the individual.\nTake it easy I can assure you that everything will turn out to be fine.\n".repeat(
      10000
    );
  const maxWidth = 1000;
  const maxLabelWidth = 50;
  FontMock.mockImplementationOnce(() => {
    return {
      widthOfChar: (): number => {
        return 1;
      },
      widthOf: (): number => {
        return 1;
      },
    };
  });

  const font = new FontMock();
  const calculator = new LineWidthManager(maxWidth, maxLabelWidth);
  const splitter = new TextLineSplitter(calculator, font);

  beforeEach(() => {
    calculator.reset();
  });

  it("initial run", () => {
    const t0 = performance.now();
    splitter.split(new Text(text));
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
  });

  it("filter by range", () => {
    const entityList: Entity[] = [];
    for (let i = 0; i < 1000; i++) {
      entityList.push(new Entity(i + 5, 0, i * 10 + 100, i * 10 + 105));
    }
    const entities = Entities.valueOf(entityList);
    const t0 = performance.now();
    for (let i = 0; i < 20000; i++) {
      entities.filterByRange(i * 70, (i + 1) * 70);
    }
    const t1 = performance.now();
    console.log(`Call to filterByRange took ${t1 - t0} milliseconds.`);
  });

  it("interval tree", () => {
    const tree = new IntervalTree();
    for (let i = 0; i < 1000; i++) {
      tree.insert([i * 10 + 100, i * 10 + 105], i);
    }
    const t0 = performance.now();
    for (let i = 0; i < 20000; i++) {
      tree.search([i * 70, (i + 1) * 70]);
    }
    const t1 = performance.now();
    console.log(`Call to tree search took ${t1 - t0} milliseconds.`);
  });
});
