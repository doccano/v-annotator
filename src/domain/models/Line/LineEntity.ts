import { Entity } from "../Label/Entity";
import { LevelManager } from "./LevelManager";
import { LabelList } from "../Label/Label";
import { TextLine } from "./LineText";

export class GeometricEntity {
  constructor(
    readonly entity: Entity,
    readonly ranges: Ranges,
    readonly level: number
  ) {}

  get center(): number {
    return this.ranges.center;
  }
}

export class Range {
  constructor(readonly x1: number, readonly x2: number) {
    if (x1 > x2) {
      throw new RangeError(`The argument must be x1 <= x2.`);
    }
  }

  get center(): number {
    return this.x1 + (this.x2 - this.x1) / 2;
  }

  getInterval(rtl = false, labelWidth = 0): [number, number] {
    if (rtl) {
      return [Math.min(this.x1, this.x2 - labelWidth), this.x2];
    } else {
      return [this.x1, Math.max(this.x2, this.x1 + labelWidth)];
    }
  }
}

export class Ranges {
  private _items: Range[] = [];
  constructor(readonly rtl = false) {}

  get items(): Range[] {
    return this._items;
  }

  add(x1: number, x2: number): void {
    const range = new Range(x1, x2);
    if (this.rtl) {
      this._items.unshift(range);
    } else {
      this._items.push(range);
    }
  }

  get first(): Range {
    return this.items[0];
  }

  get center(): number {
    return this.first.center;
  }

  getIntervals(startsWith: boolean, labelWidth: number): [number, number][] {
    return this.items.map((range, index) => {
      return index === 0 && startsWith
        ? range.getInterval(this.rtl, labelWidth)
        : range.getInterval();
    });
  }
}

export class EntityLine {
  private levelManager = new LevelManager();
  constructor(private textLine: TextLine, private rtl = false) {}

  render(
    element: SVGTextElement,
    entities: Entity[],
    entityLabels: LabelList
  ): GeometricEntity[] {
    if (element.getNumberOfChars() === 0) {
      return [];
    }
    const geometricEntities: GeometricEntity[] = [];
    this.levelManager.clear();
    for (const entity of entities) {
      const ranges = this.createRanges(element, entity);
      const startsWith = entity.startsAfter(this.textLine.startOffset);
      const labelWidth = entityLabels.getWidth(entity.label);
      const intervals = ranges.getIntervals(startsWith, labelWidth);
      this.levelManager.update(entity, intervals);
      const level = this.levelManager.fetchLevel(entity)!;
      geometricEntities.push(new GeometricEntity(entity, ranges, level));
    }
    return geometricEntities;
  }

  private createRanges(element: SVGTextElement, entity: Entity): Ranges {
    const ranges = new Ranges(this.rtl);
    const node = element.firstChild!;
    const s =
      Math.max(entity.startOffset, this.textLine.startOffset) -
      this.textLine.startOffset;
    const e =
      Math.min(entity.endOffset, this.textLine.endOffset) -
      this.textLine.startOffset;
    if (node.textContent && node.textContent.length < e) {
      ranges.add(0, 0);
      return ranges;
    }
    const range = document.createRange();
    range.setStart(node, s);
    range.setEnd(node, e);
    const rects = range.getClientRects();
    for (const rect of rects) {
      ranges.add(rect.left, rect.right);
    }
    return ranges;
  }
}
