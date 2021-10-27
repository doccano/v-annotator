import { Entity, Entities } from "./Entity";
import { Identifiable } from "./Identifiable";
import IntervalTree from "@flatten-js/interval-tree";

export interface Relation {
  id: number;
  labelId: number;
  fromId: number;
  toId: number;
}

export class RelationListItem implements Identifiable {
  constructor(
    readonly id: number,
    readonly labelId: number,
    readonly fromEntity: Entity,
    readonly toEntity: Entity
  ) {}

  /**
   * Return true if the relation and start/end offset has some overlapping.
   * @param {number} startOffset - start offset of something(maybe entity or relation)
   * @param {number} endOffset - end offset of something(maybe entity or relation)
   * @returns {boolean} - true if there is an overlapping, otherwise false.
   */
  isIn(startOffset: number, endOffset: number): boolean {
    return (
      (startOffset <= this.startOffset && this.startOffset < endOffset) ||
      (startOffset < this.endOffset && this.endOffset <= endOffset) ||
      (this.startOffset < startOffset && endOffset < this.endOffset)
    );
  }

  /**
   * Return true if entity is a part of the relation.
   * @param {Entity} entity - an entity.
   * @returns {boolean} - true if the entity is a part of the relation, otherwise false.
   */
  consistOf(entity: Entity): boolean {
    return this.fromEntity.equalTo(entity) || this.toEntity.equalTo(entity);
  }

  /**
   * Return true if the left side is open, otherwise return false.
   * If the start offset of the relation is smaller than that of text line,
   *   this should return true because I assume that
   *   the vertical line of the relation starts with the first line of the entity.
   * This may be in trouble when the first line is smaller than the second line.
   * @param {number} startOffset - start offset of a text line.
   * @returns {boolean} - the result.
   */
  isOpenOnLeft(startOffset: number): boolean {
    return this.startOffset < startOffset;
  }

  /**
   * Return true if the right side is open, otherwise return false.
   * If the start offset of the entity1 which appears after the another entity
   *   is larger than the end offset of text line,
   *   this should return true because I assume that the vertical line of the
   *   relation starts with the entity1.
   * @param {number} endOffset - end offset of a text line.
   * @returns {boolean} - the result.
   */
  isOpenOnRight(endOffset: number): boolean {
    const offset = Math.max(
      this.fromEntity.startOffset,
      this.toEntity.startOffset
    );
    return offset >= endOffset;
  }

  /**
   * Return true if the relation is visible, otherwise return false.
   * If the start offset of either entity is after the start offset of
   *   the TextLine, it should be visible.
   * @param {number} startOffset - start offset of a text line.
   * @returns {boolean} - the result.
   */
  isVisible(startOffset: number): boolean {
    const offset = Math.max(
      this.fromEntity.startOffset,
      this.toEntity.startOffset
    );
    return startOffset <= offset;
  }

  /**
   * Return width between centers of each entity.
   * @returns {number} - the width between each entity.
   */
  get width(): number {
    return Math.abs(this.fromEntity.center - this.toEntity.center);
  }

  /**
   * Return start offset of the relation.
   * The value is a smaller value of the two entities.
   * @returns {number} - the start offset.
   */
  get startOffset(): number {
    return Math.min(this.fromEntity.startOffset, this.toEntity.startOffset);
  }

  /**
   * Return end offset of the relation.
   * The value is a bigger value of the two entities.
   * @returns {number} - the end offset.
   */
  get endOffset(): number {
    return Math.max(this.fromEntity.endOffset, this.toEntity.endOffset);
  }
}

export class RelationList {
  private tree: IntervalTree<RelationListItem> = new IntervalTree();

  constructor(relations: Relation[], entities: Entities) {
    for (const relation of relations) {
      const fromEntity = entities.findById(relation.fromId)!;
      const toEntity = entities.findById(relation.toId)!;
      const item = new RelationListItem(
        relation.id,
        relation.labelId,
        fromEntity,
        toEntity
      );
      this.tree.insert([item.startOffset, item.endOffset], item);
    }
  }

  /**
   * Filter relations by the provided start/end offsets.
   * @param {number} startOffset - the start offset.
   * @param {number} endOffset - the end offset.
   * @returns {RelationListItem[]} - An array with the filtered relations.
   */
  filterByRange(startOffset: number, endOffset: number): RelationListItem[] {
    return this.tree
      .search([startOffset, endOffset])
      .filter((rel: RelationListItem) => rel.isIn(startOffset, endOffset));
  }
}
