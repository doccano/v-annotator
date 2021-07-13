import { TextLine } from "./TextLine";
import { WidthCalculator } from "./Strategy";
import { Font } from "./Font";
import { Entities, Entity } from "../Label/Entity";
import { EntityLabels } from "./Shape";

export class TextLineSplitter {
  private levels: Map<number, number> = new Map();
  constructor(
    private font: Font,
    private widthCalculator: WidthCalculator,
    private entities: Entities,
    private entityLabels: EntityLabels
  ) {}

  split(text: string): TextLine[] {
    let dx = 0;
    let startIndex = 0;
    let line = new TextLine(this.font);
    const lines = [] as TextLine[];

    for (const [i, ch] of Array.from(text).entries()) {
      const entities = this.entities.getAt(i);
      const maxLabelWidth = Math.max(
        ...entities
          .list()
          .map((e) => this.entityLabels.getById(e.label))
          .map((e) => e!.width),
        0
      );
      if (!entities.isEmpty()) {
        const newDx = Math.max(
          ...entities
            .list()
            .filter((e) => this.isOverlapping(e))
            .map((e) => this.calculateDx(e)),
          0
        );
        entities.list().map((e) => this.updateLevels(e));
        line.addSpan(dx, startIndex, i);
        startIndex = i;
        dx = newDx;
        // this.widthCalculator.addWidth(dx);
      }
      if (this.widthCalculator.needsNewline(ch, maxLabelWidth)) {
        line.addSpan(0, startIndex, i);
        lines.push(line);
        line = new TextLine(this.font);
        startIndex = ch === "\n" ? i + 1 : i;
        this.widthCalculator.reset();
        this.resetLevels();
      }
      this.widthCalculator.add(ch);
    }
    if (this.widthCalculator.remains()) {
      line.addSpan(dx, startIndex, text.length);
      lines.push(line);
    }
    return lines;
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

  private calculateDx(entity: Entity): number {
    const level = this.entities.getLevelOf(entity.id)!;
    if (this.isOverlapping(entity)) {
      const x = this.widthCalculator.width;
      const endX = this.levels.get(level)!;
      return endX - x;
    }
    return 0;
  }

  private updateLevels(entity: Entity): void {
    const level = this.entities.getLevelOf(entity.id)!;
    const entityLabel = this.entityLabels.getById(entity.label)!;
    if (this.isOverlapping(entity)) {
      const dx = this.calculateDx(entity);
      const x = this.levels.get(level)!;
      this.levels.set(level, x + entityLabel.width - dx);
    } else {
      const x = this.widthCalculator.width;
      this.levels.set(level, x + entityLabel.width);
    }
  }

  private resetLevels(): void {
    this.levels = new Map();
  }
}
