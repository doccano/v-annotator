import IntervalTree from "@flatten-js/interval-tree";

import { Entity, Entities } from "../Label/Entity";
import { TextLine } from "./TextLine";
import { BaseLineSplitter } from "./TextLineSplitter";

export interface EntityObserverHint {
  entity: Entity;
  mode: "delete" | "update" | "add";
}

export interface EntityObserver {
  update(entities: Entities, hint: EntityObserverHint): void;
}

export class TextLines implements EntityObserver {
  private tree: IntervalTree<TextLine> = new IntervalTree();

  constructor(private text: string = "", private splitter: BaseLineSplitter) {}

  update(entities: Entities, hint?: EntityObserverHint): void {
    const updatedLines = [];
    const startOffset = hint ? this.findByEntity(hint.entity) : 0;
    const lines = this.splitter.split(this.text, startOffset, entities);
    for (const line of lines) {
      if (this.meetStopCriteria(line)) {
        break;
      }
      updatedLines.push(line);
    }
    this.replaceLines(updatedLines);
  }

  list(): TextLine[] {
    return this.tree.values;
  }

  private findByEntity(entity: Entity): number {
    const lines = this.tree.search([entity.startOffset, entity.endOffset]);
    for (const line of lines) {
      if (
        line.endOffset === entity.startOffset ||
        line.startOffset === entity.endOffset
      ) {
        continue;
      }
      return line.startOffset;
    }
    return 0;
  }

  private meetStopCriteria(line: TextLine): boolean {
    return this.tree.exist([line.startOffset, line.endOffset], line);
  }

  private replaceLines(lines: TextLine[]): void {
    const startOffset = lines[0].startOffset;
    const endOffset = lines[lines.length - 1].endOffset;
    for (const line of this.tree.search([startOffset, endOffset])) {
      if (line.endOffset === startOffset || line.startOffset === endOffset) {
        continue;
      }
      this.tree.remove([line.startOffset, line.endOffset], line);
    }
    for (const line of lines) {
      this.tree.insert([line.startOffset, line.endOffset], line);
    }
  }
}
