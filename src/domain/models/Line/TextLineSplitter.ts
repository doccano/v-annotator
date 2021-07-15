import { TextLine } from "./TextLine";
import { WidthCalculator } from "./Strategy";
import { Font } from "./Font";
import { Entities, Entity } from "../Label/Entity";
import { EntityLabels } from "./Shape";

export class TextLineSplitter {
  private levels: Map<number, number> = new Map();
  constructor(
    private widthCalculator: WidthCalculator,
    private entities: Entities,
    private entityLabels: EntityLabels
  ) {}

  split(text: string): TextLine[] {
    let dx = 0;
    let line = new TextLine();
    let startIndex = 0;
    const lines = [] as TextLine[];

    for (const [i, ch] of Array.from(text).entries()) {
      if (this.needsNewline(i, ch)) {
        line.addSpan(dx, startIndex, i);
        lines.push(line);
        line = new TextLine();
        startIndex = ch === "\n" ? i + 1 : i;
        dx = 0;
        this.widthCalculator.reset();
        this.resetLevels();
      }
      if (this.entities.startsAt(i)) {
        const entities = this.entities.getAt(i);
        const _dx = this.calculateMaxDx(entities);
        this.widthCalculator.addWidth(_dx);
        this.updateLevels(entities);
        line.addSpan(dx, startIndex, i);
        startIndex = i;
        dx = _dx;
      }
      this.widthCalculator.add(ch);
    }
    if (this.widthCalculator.remains()) {
      line.addSpan(dx, startIndex, text.length);
      lines.push(line);
    }
    return lines;
  }

  private needsNewline(i: number, ch: string): boolean {
    const entities = this.entities.getAt(i);
    const labelIds = entities.list().map((e) => e.label);
    const maxLabelWidth = this.entityLabels.maxLabelWidth(labelIds);
    return this.widthCalculator.needsNewline(ch, maxLabelWidth);
  }

  private isOverlapping(entity: Entity): boolean {
    const level = this.entities.getLevelOf(entity.id)!;
    if (this.levels.has(level)) {
      const x = this.widthCalculator.width;
      const endX = this.levels.get(level)!;
      return endX > x;
    }
    return false;
  }

  private calculateMaxDx(entities: Entities): number {
    return Math.max(
      ...entities
        .list()
        .filter((e) => this.isOverlapping(e))
        .map((e) => this.calculateDx(e)),
      0
    );
  }

  private calculateDx(entity: Entity): number {
    const level = this.entities.getLevelOf(entity.id)!;
    const x = this.widthCalculator.width;
    const endX = this.levels.get(level)!;
    return endX - x;
  }

  private updateLevels(entities: Entities): void {
    entities.list().map((e) => this.updateLevel(e));
  }

  private updateLevel(entity: Entity): void {
    const level = this.entities.getLevelOf(entity.id)!;
    const entityLabel = this.entityLabels.getById(entity.label)!;
    const x = this.widthCalculator.width;
    this.levels.set(level, x + entityLabel.width);
  }

  private resetLevels(): void {
    this.levels = new Map();
  }
}
