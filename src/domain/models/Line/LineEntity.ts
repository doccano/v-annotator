import { Entity } from "../Label/Entity";
import { LevelManager } from "./LevelManager";
import { LabelList } from "../Label/Label";
import { TextLine } from "./LineText";

export interface GeometricEntity {
  entity: Entity;
  ranges: Ranges;
  level: number;
}

export class Range {
  constructor(readonly x1: number, readonly x2: number) {}
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
    return this.first.x1 + (this.first.x2 - this.first.x1) / 2;
  }

  getIntervals(startsWith: boolean, labelWidth: number): [number, number][] {
    return this.items.map((range, index) => {
      return index === 0 && startsWith
        ? this.getInterval(range, labelWidth)
        : [range.x1, range.x2];
    });
  }

  private getInterval(range: Range, labelWidth: number): [number, number] {
    if (this.rtl) {
      return [Math.min(range.x1, range.x2 - labelWidth), range.x2];
    } else {
      return [range.x1, Math.max(range.x2, range.x1 + labelWidth)];
    }
  }
}

export class EntityLine {
  private levelManager = new LevelManager();
  constructor(
    private entities: Entity[],
    private entityLabels: LabelList,
    private textLine: TextLine
  ) {}

  render(element: SVGTextElement, rtl = false): GeometricEntity[] {
    if (element.getNumberOfChars() === 0) {
      return [];
    }
    const geometricEntities: GeometricEntity[] = [];
    this.levelManager.clear();
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      const ranges = this.createRanges(element, entity, rtl);
      const startsWith = entity.startsAfter(this.textLine.startOffset);
      const labelWidth = this.entityLabels.getWidth(entity.label);
      const intervals = ranges.getIntervals(startsWith, labelWidth);
      this.levelManager.update(entity, intervals);
      const level = this.levelManager.fetchLevel(entity)!;
      geometricEntities.push({
        entity,
        ranges,
        level,
      });
    }
    return geometricEntities;
  }

  private createRanges(
    element: SVGTextElement,
    entity: Entity,
    rtl: boolean
  ): Ranges {
    const ranges = new Ranges(rtl);
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
