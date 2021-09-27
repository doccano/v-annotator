import { Entity, LevelManager } from "../Label/Entity";
import { LabelList } from "../Label/Label";
import { TextLine } from "./LineText";

export interface GeometricEntity {
  entity: Entity;
  ranges: Ranges;
  level: number;
}

class Range {
  constructor(readonly x1: number, readonly x2: number) {}
}

export class Ranges {
  private _items: Range[] = [];
  constructor(readonly rtl = false) {}

  get items(): Range[] {
    return this.rtl ? this._items.reverse() : this._items;
  }

  add(x1: number, x2: number): void {
    const range = new Range(x1, x2);
    this._items.push(range);
  }

  get first(): Range {
    return this.items[0];
  }

  center(): number {
    return this.first.x1 + (this.first.x2 - this.first.x1) / 2;
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
      this.levelManager.update(
        entity,
        ranges.items.map((range, index) =>
          // If it's the first element,
          index === 0 && this.textLine.startOffset <= entity.startOffset
            ? [
                range.x1,
                // consider label length,
                Math.max(
                  range.x2,
                  range.x1 + this.entityLabels.getById(entity.label)!.width
                ),
              ]
            : [range.x1, range.x2]
        )
      );
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
