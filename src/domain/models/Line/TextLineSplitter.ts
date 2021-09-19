import { TextLine } from "./TextLine";
import { WidthManager } from "./WidthManager";
import { Entities, Entity, LevelManager } from "../Label/Entity";
import { LabelList } from "../Label/Label";

export interface BaseLineSplitter {
  split(
    text: string,
    startOffset: number,
    entities?: Entities
  ): Iterable<TextLine>;
  reset(): void;
}

export class TextLineSplitter implements BaseLineSplitter {
  private levels: Map<number, number> = new Map();
  private levelManager = new LevelManager();
  private chunkWidth: Map<number, number> = new Map();
  constructor(
    private widthManager: WidthManager,
    private entityLabels: LabelList
  ) {}

  *split(
    text: string,
    startOffset = 0,
    entities: Entities
  ): Iterable<TextLine> {
    this.calculateChunkWidth(text);
    this.widthManager.reset();
    this.resetLevels();
    let i = startOffset;
    while (i < text.length) {
      const ch = text[i];
      if (this.needsNewline(i, ch, entities)) {
        const line = new TextLine(startOffset, i);
        line.level = this.levelManager.maxLevel;
        yield line;
        if (this.isCRLF(text.substr(i, 2))) {
          startOffset = i + 2;
          i++;
        } else if (this.isLF(ch) || this.isCR(ch)) {
          startOffset = i + 1;
        } else {
          startOffset = i;
        }
        this.widthManager.reset();
        this.resetLevels();
      }
      if (entities.startsAt(i)) {
        const _entities = entities.getAt(i);
        _entities.forEach((entity) => {
          this.levelManager.update(entity, [
            [
              this.widthManager.width,
              this.widthManager.width +
                this.entityLabels.getById(entity.label)!.width,
            ],
          ]);
        });
        _entities.forEach((e) => this.updateLevel(e));
      }
      this.widthManager.add(ch);
      i++;
    }
    if (!this.widthManager.isEmpty()) {
      const line = new TextLine(startOffset, text.length);
      line.level = this.levelManager.maxLevel;
      yield line;
    }
  }

  reset(): void {
    this.chunkWidth.clear();
  }

  private isWhitespace(ch: string): boolean {
    return /^\s$/.test(ch);
  }

  private isLF(ch: string): boolean {
    return ch === "\n";
  }

  private isCR(ch: string): boolean {
    return ch === "\r";
  }

  private isCRLF(text: string): boolean {
    return text === "\r\n";
  }

  private calculateChunkWidth(text: string): void {
    if (this.chunkWidth.size > 0) return;
    let isInsideWord = false;
    let start = 0;
    this.widthManager.reset();
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (!isInsideWord && !this.isWhitespace(ch)) {
        // word starts
        isInsideWord = true;
        start = i;
        this.widthManager.add(ch);
      } else if (!isInsideWord && this.isWhitespace(ch)) {
        // space is continuous.
      } else if (isInsideWord && !this.isWhitespace(ch)) {
        this.widthManager.add(ch);
      } else if (isInsideWord && this.isWhitespace(ch)) {
        isInsideWord = false;
        this.chunkWidth.set(start, this.widthManager.width);
        this.widthManager.reset();
      }
    }
    if (isInsideWord) {
      this.chunkWidth.set(start, this.widthManager.width);
    }
  }

  private needsNewline(i: number, ch: string, entities: Entities): boolean {
    if (this.isLF(ch) || this.isCR(ch)) {
      return true;
    }
    // check whether the word exceeds the maxWidth
    const wordWidth = this.chunkWidth.get(i) || 0;
    const isShortWord = wordWidth <= this.widthManager.width;
    if (isShortWord && this.widthManager.isFull(wordWidth)) {
      return true;
    }

    // check whether the label exceeds the maxWidth
    const _entities = entities.getAt(i);
    if (_entities.length === 0) {
      return this.widthManager.isFull(0);
    } else {
      const labelIds = _entities.map((e) => e.label);
      const maxLabelWidth = this.entityLabels.maxLabelWidth(labelIds);
      return this.widthManager.isFull(maxLabelWidth);
    }
  }

  private updateLevel(entity: Entity): void {
    const level = this.levelManager.fetchLevel(entity)!;
    const entityLabel = this.entityLabels.getById(entity.label)!;
    const x = this.widthManager.width;
    this.levels.set(level, x + entityLabel.width);
  }

  private resetLevels(): void {
    this.levels.clear();
    this.levelManager.clear();
  }
}
