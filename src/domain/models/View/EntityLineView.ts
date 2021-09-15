import { Entity, LevelManager } from "../Label/Entity";
import { TextLine } from "../Line/TextLine";
import { EntityLabels, EntityLabel } from "../Line/Shape";
import { Font } from "../Line/Font";

const lineWidth = 5;
const marginTop = 5;

export interface GeometricEntity {
  entity: Entity;
  ranges: [number, number][];
  lineY: number;
  textY: number;
  entityLabel: EntityLabel;
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
      for (const [x1, x2] of ranges) {
        this.levelManager.update(
          entity,
          x1,
          entity.startOffset < this.textLine.startOffset // entity continue from the previous line
            ? x2
            : x1 + this.entityLabels.getById(entity.label)!.width
        );
      }
      const entityLabel = this.entityLabels.getById(entity.label)!;
      const lineY = this.calculateLineY(entity);
      const textY = lineY + this.font.fontSize / 2 + marginTop;
      geometricEntities.push({
        entity,
        ranges,
        lineY,
        textY,
        entityLabel,
      });
    }
    return geometricEntities;
  }

  private calculateLineY(entity: Entity): number {
    const level = this.levelManager.fetchLevel(entity)!;
    const marginBottom = 8;
    return lineWidth + (lineWidth + this.font.fontSize + marginBottom) * level;
  }

  private createRanges(
    element: SVGTextElement,
    entity: Entity
  ): [number, number][] {
    const ranges: [number, number][] = [];
    const node = element.firstChild!;
    const s =
      Math.max(entity.startOffset, this.textLine.startOffset) -
      this.textLine.startOffset;
    const e =
      Math.min(entity.endOffset, this.textLine.endOffset) -
      this.textLine.startOffset;
    if (node.textContent && node.textContent.length < e) {
      return [[0, 0]];
    }
    const range = document.createRange();
    range.setStart(node, s);
    range.setEnd(node, e);
    const rects = range.getClientRects();
    for (const rect of rects) {
      ranges.push([rect.left, rect.right]);
    }
    return ranges;
  }
}
