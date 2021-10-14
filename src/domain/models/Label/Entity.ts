import IntervalTree from "@flatten-js/interval-tree";
import { Text } from "./Text";
import { Identifiable } from "./Identifiable";

export class Entity implements Identifiable {
  constructor(
    readonly id: number,
    readonly label: number,
    readonly user: number,
    readonly startOffset: number,
    readonly endOffset: number
  ) {
    if (startOffset > endOffset) {
      throw new RangeError(
        `The startOffset(${startOffset}) must be smaller than endOffset(${endOffset}).`
      );
    }
  }

  isIn(startOffset: number, endOffset: number): boolean {
    return (
      (startOffset <= this.startOffset && this.startOffset < endOffset) ||
      (startOffset < this.endOffset && this.endOffset <= endOffset) ||
      (this.startOffset < startOffset && endOffset < this.endOffset)
    );
  }

  equalTo(other: Entity): boolean {
    return this.id === other.id;
  }

  startsAfter(offset: number): boolean {
    return offset <= this.startOffset;
  }

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
            entity.user,
            text
              ? text.toCodePointOffset(entity.startOffset)!
              : entity.startOffset,
            text ? text.toCodePointOffset(entity.endOffset)! : entity.endOffset
          )
      )
    );
  }

  get size(): number {
    return this.tree.size;
  }

  findById(id: number): Entity {
    return this.id2entity.get(id)!;
  }

  filterByRange(startOffset: number, endOffset: number): Entity[] {
    return this.tree
      .search([startOffset, endOffset])
      .filter((entity: Entity) => entity.isIn(startOffset, endOffset));
  }
}
