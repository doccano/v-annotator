import IntervalTree from "@flatten-js/interval-tree";
import { Text } from "./Text";
import { Identifiable } from "./Identifiable";

export class Entity implements Identifiable {
  constructor(
    readonly id: number,
    readonly label: number,
    readonly startOffset: number,
    readonly endOffset: number
  ) {
    if (startOffset > endOffset) {
      throw new RangeError(
        `The startOffset(${startOffset}) must be smaller than endOffset(${endOffset}).`
      );
    }
  }

  /**
   * Return true if the entity and start/end offset has some overlapping.
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
   * Return true if the provided entity equals to the entity.
   * @param {Entity} other - the provided entity.
   * @returns {boolean}
   */
  equalTo(other: Entity): boolean {
    return this.id === other.id;
  }

  /**
   * Return true if the entity is located after the given offset.
   * @param {number} offset - The offset.
   * @returns {boolean} - true if offset <= this.startOffset.
   */
  startsAfter(offset: number): boolean {
    return offset <= this.startOffset;
  }

  /**
   * Return the center offset of the entity.
   * This is used to calculate the width of the relation.
   */
  get center(): number {
    return this.startOffset + (this.endOffset - this.startOffset) / 2;
  }
}

export class Entities {
  private tree: IntervalTree<Entity> = new IntervalTree();
  private id2entity: Map<number, Entity> = new Map();

  constructor(entities: Entity[]) {
    for (const entity of entities) {
      this.tree.insert([entity.startOffset, entity.endOffset], entity);
      this.id2entity.set(entity.id, entity);
    }
  }

  static valueOf(entities: Entity[], text?: Text): Entities {
    return new Entities(
      entities.map(
        (entity) =>
          new Entity(
            entity.id,
            entity.label,
            text
              ? text.toCodePointOffset(entity.startOffset)!
              : entity.startOffset,
            text ? text.toCodePointOffset(entity.endOffset)! : entity.endOffset
          )
      )
    );
  }

  /**
   * Returns the number of entities.
   * @returns {number} - The number of entities.
   */
  get size(): number {
    return this.tree.size;
  }

  /**
   * Returns the entity that matches the provided id.
   *   If no match is found, undefined is returned.
   * @param {number} id - the entity id.
   * @returns {(Entity | undefined)} - Entity if match is found, otherwise undefined.
   */
  findById(id: number): Entity | undefined {
    return this.id2entity.get(id)!;
  }

  /**
   * Filter entities by the provided start/end offsets.
   * @param {number} startOffset - the start offset.
   * @param {number} endOffset - the end offset.
   * @returns {RelationListItem[]} - An array with the filtered entities.
   */
  filterByRange(startOffset: number, endOffset: number): Entity[] {
    return this.tree
      .search([startOffset, endOffset])
      .filter((entity: Entity) => entity.isIn(startOffset, endOffset));
  }

  /**
   * Returns true if intersection between given offsets and entities found.
   * @param {number} startOffset - the start offset.
   * @param {number} endOffset - the end offset.
   * @returns {boolean} - true if intersection found, otherwise false.
   */
  intersectAny(startOffset: number, endOffset: number): boolean {
    return this.filterByRange(startOffset, endOffset).length > 0;
  }
}
