import { TextLines } from "@/domain/models/Line/Observer";
import { TextLineSplitter } from "@/domain/models/Line/TextLineSplitter";
import { TextWidthCalculator } from "@/domain/models/Line/Strategy";
import { Font } from "@/domain/models/Line/Font";
import { EntityLabel, EntityLabels } from "@/domain/models/Line/Shape";
import { Entity, Entities } from "@/domain/models/Label/Entity";

jest.mock("@/domain/models/Line/Font");
jest.mock("@/domain/models/Line/Shape");
const FontMock = Font as jest.Mock;
const EntityLabelMock = EntityLabel as jest.Mock;
const EntityLabelsMock = EntityLabels as jest.Mock;

describe("Subject", () => {
  const text =
    "we must respect the will of the individual.\nTake it easy I can assure you that everything will turn out to be fine.\n".repeat(
      10000
    );
  const maxWidth = 1000;
  FontMock.mockImplementationOnce(() => {
    return {
      widthOfChar: (): number => {
        return 1;
      },
    };
  });

  EntityLabelMock.mockImplementationOnce(() => {
    return {
      width: (): number => {
        return maxWidth;
      },
    };
  });

  EntityLabelsMock.mockImplementationOnce(() => {
    return {
      maxLabelWidth: (): number => {
        return 1;
      },
      getById: (): EntityLabel => {
        return new EntityLabelMock();
      },
    };
  });
  const font = new FontMock();
  const entityLabels = new EntityLabelsMock();
  const calculator = new TextWidthCalculator(font, maxWidth);
  const splitter = new TextLineSplitter(calculator, entityLabels);

  beforeEach(() => {
    calculator.reset();
  });

  it("initial run", () => {
    const entities = new Entities([]);
    const lines = new TextLines(text, splitter);
    entities.register(lines);
    const t0 = performance.now();
    entities.update([
      new Entity(0, 0, 0, 3, 7),
      new Entity(4, 0, 0, 35, 46),
      new Entity(1, 1, 0, 59, 62),
      new Entity(2, 0, 0, 79, 89),
      new Entity(3, 1, 0, 79, 94),
    ]);
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    entities.update([
      new Entity(0, 0, 0, 3, 7),
      new Entity(4, 0, 0, 35, 46),
      new Entity(1, 1, 0, 59, 62),
      new Entity(2, 0, 0, 79, 89),
      new Entity(3, 1, 0, 79, 94),
      new Entity(5, 0, 0, 500000, 500001),
    ]);
    const t2 = performance.now();
    console.log(`Call to doSomething took ${t2 - t1} milliseconds.`);
  });
});
