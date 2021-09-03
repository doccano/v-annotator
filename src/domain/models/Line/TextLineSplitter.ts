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
    const dx = 0;
    let line = new TextLine();
    this.widthCalculator.reset();
    this.resetLevels();

    for (let i = startOffset; i < text.length; i++) {
      const ch = text[i];
      if (this.needsNewline(i, ch, entities)) {
        line.addSpan(dx, startOffset, i);
        line.level = this.levelManager.maxLevel;
        yield line;
        line = new TextLine();
        startOffset = ch === "\n" ? i + 1 : i;
        this.widthCalculator.reset();
        this.resetLevels();
      }
      if (entities.startsAt(i)) {
        const _entities = entities.getAt(i);
        _entities.forEach((entity) => {
          this.levelManager.update(
            entity,
            this.widthCalculator.width,
            this.widthCalculator.width +
              this.entityLabels.getById(entity.label)!.width
          );
        });
        _entities.forEach((e) => this.updateLevel(e));
        if (startOffset !== i) {
          line.addSpan(dx, startOffset, i);
        }
        startOffset = i;
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
