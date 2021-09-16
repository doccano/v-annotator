import { Entity, LevelManager } from "../Label/Entity";
import { TextLine } from "./TextLine";
import { EntityLabels } from "./Shape";
import { Font } from "./Font";
import config from "@/domain/models/Config/Config";
const marginTop = 5;

export interface GeometricEntity {
  entity: Entity;
  ranges: Ranges;
  lineY: number;
  textY: number;
}

class Range {
  constructor(readonly x1: number, readonly x2: number) {}
}

export class Ranges {
  private _items: Range[] = [];

  get items(): Range[] {
    return this._items;
  }

  add(x1: number, x2: number): void {
    const range = new Range(x1, x2);
    this._items.push(range);
  }

  get first(): Range {
    return this._items[0];
  }
}

function elementExists(element: SVGTextElement): boolean {
  return element.textLength.baseVal.value !== 0;
}

export class EntityLineView {
  private levelManager = new LevelManager();
  constructor(
    private entities: Entity[],
    private entityLabels: EntityLabels,
    private textLine: TextLine,
    private font: Font
  ) {}

  render(element: SVGTextElement): GeometricEntity[] {
    if (!elementExists(element)) {
      return [];
    }
    const geometricEntities: GeometricEntity[] = [];
    this.levelManager.clear();
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      const ranges = this.createRanges(element, entity);
      for (const range of ranges.items) {
        this.levelManager.update(
          entity,
          range.x1,
          entity.startOffset < this.textLine.startOffset // entity continue from the previous line
            ? range.x2
            : range.x1 + this.entityLabels.getById(entity.label)!.width
        );
      }
      const lineY = this.calculateLineY(entity);
      const textY = lineY + this.font.fontSize / 2 + marginTop;
      geometricEntities.push({
        entity,
        ranges,
        lineY,
        textY,
      });
    }
    return geometricEntities;
  }

  private calculateLineY(entity: Entity): number {
    const level = this.levelManager.fetchLevel(entity)!;
    const marginBottom = 8;
    return (
      config.lineWidth +
      (config.lineWidth + this.font.fontSize + marginBottom) * level
    );
  }

  private createRanges(element: SVGTextElement, entity: Entity): Ranges {
    const ranges = new Ranges();
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
