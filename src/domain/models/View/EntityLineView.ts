import { resolve, reorderPermutation } from "unicode-bidirectional";
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

function createPermutation(text: string, rtl = false): number[] {
  const codepoints = [];
  for (const ch of text) {
    codepoints.push(ch.codePointAt(0));
  }
  const levels = resolve(codepoints, rtl);
  const permutation = reorderPermutation(levels);
  if (rtl) {
    permutation.reverse();
  }
  return permutation;
}

function calculateWidth(element: SVGTextElement): number[] {
  const widths: number[] = [];
  if (element.textLength.baseVal.value === 0) {
    return widths;
  }
  for (let i = 0; i < element.textContent!.length; i++) {
    widths.push(element.getExtentOfChar(i).width);
  }
  return widths;
}

export class EntityLineView {
  private levelManager = new LevelManager();
  constructor(
    private entities: Entity[],
    private entityLabels: EntityLabels,
    private textLine: TextLine,
    private font: Font
  ) {}

  render(element: SVGTextElement, rtl = false): GeometricEntity[] {
    const geometricEntities: GeometricEntity[] = [];
    this.levelManager.clear();
    const permutation = createPermutation(element.textContent!, rtl);
    const widths = calculateWidth(element);
    const visualWidth = [0];
    const logicalWidth = [0];
    let logicalSum = 0;
    let visualSum = 0;
    for (let i = 0; i < widths.length; i++) {
      logicalSum += widths[i];
      visualSum += widths[permutation[i]];
      logicalWidth.push(logicalSum);
      visualWidth.push(visualSum);
    }
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      const ranges = this.createRanges(
        entity,
        permutation,
        logicalWidth,
        visualWidth
      );
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
    entity: Entity,
    permutation: number[],
    logicalWidth: number[],
    visualWidth: number[]
  ): [number, number][] {
    let logicalStart = 0;
    let visualStart = 0;
    let visualEnd = 0;
    let isInsideEntity = false;
    const queue = new Set();
    const s =
      Math.max(entity.startOffset, this.textLine.startOffset) -
      this.textLine.startOffset;
    const e =
      Math.min(entity.endOffset, this.textLine.endOffset) -
      this.textLine.startOffset;
    for (let i = s; i < e; i++) {
      queue.add(i);
    }
    const ranges: [number, number][] = [];
    for (const [i, v] of permutation.entries()) {
      if (!isInsideEntity && queue.has(v)) {
        isInsideEntity = true;
        logicalStart = i;
        visualStart = v;
        visualEnd = v;
        queue.delete(v);
      } else if (isInsideEntity && queue.has(v)) {
        visualStart = v < visualStart ? v : visualStart;
        visualEnd = v > visualEnd ? v : visualEnd;
        queue.delete(v);
      } else if (isInsideEntity && !queue.has(v)) {
        isInsideEntity = false;
        const x1 = visualWidth[logicalStart];
        const x2 = x1 + logicalWidth[visualEnd + 1] - logicalWidth[visualStart];
        ranges.push([x1, x2]);
      }
      if (queue.size === 0) break;
    }
    if (isInsideEntity) {
      const x1 = visualWidth[logicalStart];
      const x2 = x1 + logicalWidth[visualEnd + 1] - logicalWidth[visualStart];
      ranges.push([x1, x2]);
    }
    return ranges;
  }
}
