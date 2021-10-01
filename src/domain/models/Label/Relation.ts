import { Entities } from "./Entity";
import IntervalTree from "@flatten-js/interval-tree";

export interface Relation {
  id: number;
  labelId: number;
  fromId: number;
  toId: number;
}

export class RelationListItem {
  constructor(
    readonly id: number,
    readonly labelId: number,
    readonly fromId: number,
    readonly toId: number,
    readonly startOffset: number,
    readonly endOffset: number
  ) {}

  isIn(startOffset: number, endOffset: number): boolean {
    return (
      (startOffset <= this.startOffset && this.startOffset < endOffset) ||
      (startOffset < this.endOffset && this.endOffset <= endOffset) ||
      (this.startOffset < startOffset && endOffset < this.endOffset)
    );
  }
}

export class RelationList {
  private tree: IntervalTree<RelationListItem> = new IntervalTree();

  constructor(relations: Relation[], entities: Entities) {
    for (const relation of relations) {
      const e1 = entities.findById(relation.fromId);
      const e2 = entities.findById(relation.toId);
      const startOffset = Math.min(e1.startOffset, e2.startOffset);
      const endOffset = Math.max(e1.startOffset, e2.startOffset);
      const item = new RelationListItem(
        relation.id,
        relation.labelId,
        relation.fromId,
        relation.toId,
        startOffset,
        endOffset
      );
      this.tree.insert([startOffset, endOffset], item);
    }
  }

  filterByRange(startOffset: number, endOffset: number): RelationListItem[] {
    return this.tree
      .search([startOffset, endOffset])
      .filter((rel: RelationListItem) => rel.isIn(startOffset, endOffset));
  }
}
