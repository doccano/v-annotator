import { TextLine } from "./TextLine";
import { WidthCalculator } from "./Strategy";
import { Entities, Entity, LevelManager } from "../Label/Entity";
import { EntityLabels } from "./Shape";

export interface BaseLineSplitter {
  split(text: string): TextLine[];
}

export class SimpleLineSplitter implements BaseLineSplitter {
  constructor(private widthCalculator: WidthCalculator) {}

  split(text: string): TextLine[] {
    let line = new TextLine();
    let startIndex = 0;
    const lines = [] as TextLine[];

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (this.widthCalculator.needsNewline(ch, 0)) {
        line.addSpan(0, startIndex, i);
        lines.push(line);
        line = new TextLine();
        startIndex = ch === "\n" ? i + 1 : i;
        this.widthCalculator.reset();
      }
      this.widthCalculator.add(ch);
    }
    if (this.widthCalculator.remains()) {
      line.addSpan(0, startIndex, text.length);
      lines.push(line);
    }
    return lines;
  }
}

export class TextLineSplitter implements BaseLineSplitter {
  private levels: Map<number, number> = new Map();
  private levelManager = new LevelManager();
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

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
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
        entities.forEach((entity) => {
          this.levelManager.update(entity);
        });
        const _dx = this.calculateMaxDx(entities);
        this.widthCalculator.addWidth(_dx);
        entities.forEach((e) => this.updateLevel(e));
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
    // For performance.
    if (entities.length === 0) {
      return this.widthCalculator.needsNewline(ch, 0);
    }
    const labelIds = entities.map((e) => e.label);
    const maxLabelWidth = this.entityLabels.maxLabelWidth(labelIds);
    return this.widthCalculator.needsNewline(ch, maxLabelWidth);
  }

  private isOverlapping(entity: Entity): boolean {
    const level = this.levelManager.fetchLevel(entity)!;
    if (this.levels.has(level)) {
      const x = this.widthCalculator.width;
      const endX = this.levels.get(level)!;
      return endX > x;
    }
    return false;
  }

  private calculateMaxDx(entities: Entity[]): number {
    return Math.max(
      ...entities
        .filter((e) => this.isOverlapping(e))
        .map((e) => this.calculateDx(e)),
      0
    );
  }

  private calculateDx(entity: Entity): number {
    const level = this.levelManager.fetchLevel(entity)!;
    const x = this.widthCalculator.width;
    const endX = this.levels.get(level)!;
    return endX - x;
  }

  private updateLevel(entity: Entity): void {
    const level = this.levelManager.fetchLevel(entity)!;
    const entityLabel = this.entityLabels.getById(entity.label)!;
    const x = this.widthCalculator.width;
    this.levels.set(level, x + entityLabel.width);
  }

  private resetLevels(): void {
    this.levels.clear();
    this.levelManager.clear();
  }
}
