import { TextLine } from "./TextLine";
import { WidthCalculator } from "./Strategy";
import { Entities, Entity, LevelManager } from "../Label/Entity";
import { EntityLabels } from "./Shape";

export interface BaseLineSplitter {
  split(
    text: string,
    startOffset: number,
    entities?: Entities
  ): Iterable<TextLine>;
}

export class SimpleLineSplitter implements BaseLineSplitter {
  constructor(private widthCalculator: WidthCalculator) {}

  *split(text: string, startOffset = 0): Iterable<TextLine> {
    let line = new TextLine();

    for (let i = startOffset; i < text.length; i++) {
      const ch = text[i];
      if (this.widthCalculator.needsNewline(ch, 0)) {
        line.addSpan(0, startOffset, i);
        yield line;
        line = new TextLine();
        startOffset = ch === "\n" ? i + 1 : i;
        this.widthCalculator.reset();
      }
      this.widthCalculator.add(ch);
    }
    if (this.widthCalculator.remains()) {
      line.addSpan(0, startOffset, text.length);
      yield line;
    }
  }
}

export class TextLineSplitter implements BaseLineSplitter {
  private levels: Map<number, number> = new Map();
  private levelManager = new LevelManager();
  constructor(
    private widthCalculator: WidthCalculator,
    private entityLabels: EntityLabels
  ) {}

  *split(
    text: string,
    startOffset = 0,
    entities: Entities
  ): Iterable<TextLine> {
    let dx = 0;
    let line = new TextLine();
    this.widthCalculator.reset();

    for (let i = startOffset; i < text.length; i++) {
      const ch = text[i];
      if (this.needsNewline(i, ch, entities)) {
        line.addSpan(dx, startOffset, i);
        line.level = this.levelManager.maxLevel;
        yield line;
        line = new TextLine();
        startOffset = ch === "\n" ? i + 1 : i;
        dx = 0;
        this.widthCalculator.reset();
        this.resetLevels();
      }
      if (entities.startsAt(i)) {
        const _entities = entities.getAt(i);
        _entities.forEach((entity) => {
          this.levelManager.update(entity);
        });
        const _dx = this.calculateMaxDx(_entities);
        this.widthCalculator.addWidth(_dx);
        _entities.forEach((e) => this.updateLevel(e));
        line.addSpan(dx, startOffset, i);
        startOffset = i;
        dx = _dx;
      }
      this.widthCalculator.add(ch);
    }
    if (this.widthCalculator.remains()) {
      line.addSpan(dx, startOffset, text.length);
      line.level = this.levelManager.maxLevel;
      yield line;
    }
  }

  private needsNewline(i: number, ch: string, entities: Entities): boolean {
    const _entities = entities.getAt(i);
    // For performance.
    if (_entities.length === 0) {
      return this.widthCalculator.needsNewline(ch, 0);
    }
    const labelIds = _entities.map((e) => e.label);
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
