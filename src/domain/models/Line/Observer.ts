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

  update(entities: Entities, hint: EntityObserverHint): void {
    const updatedLines = [];
    const startLine = this.findByEntity(hint.entity);
    const lines = this.splitter.split(
      this.text,
      startLine.startOffset,
      entities
    );
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

  private findByEntity(entity: Entity): TextLine {
    return this.tree.search([entity.startOffset, entity.endOffset])[0];
  }

  private meetStopCriteria(line: TextLine): boolean {
    return this.tree.exist([line.startOffset, line.endOffset], line);
  }

  private replaceLines(lines: TextLine[]): void {
    const startOffset = lines[0].startOffset;
    const endOffset = lines[lines.length - 1].endOffset;
    this.tree.remove([startOffset, endOffset]);
    for (const line of lines) {
      this.tree.insert([line.startOffset, line.endOffset], line);
    }
  }
}
