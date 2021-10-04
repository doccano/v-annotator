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
  ) {}

  isIn(startOffset: number, endOffset: number): boolean {
    return (
      (startOffset <= this.startOffset && this.startOffset < endOffset) ||
      (startOffset < this.endOffset && this.endOffset <= endOffset) ||
      (this.startOffset < startOffset && endOffset < this.endOffset)
    );
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
              ? text.toCodePointOffset(entity.startOffset)
              : entity.startOffset,
            text ? text.toCodePointOffset(entity.endOffset) : entity.endOffset
          )
      )
    );
  }

  get size(): number {
    return this.tree.size;
  }

  list(): Entity[] {
    return this.tree.values;
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

export class LevelManager {
  private intervalPerLevel: IntervalTree[] = [];
  private id2level: Map<number, number> = new Map(); // <id, level>

  update(item: Identifiable, ranges: [number, number][]): void {
    for (const [level, tree] of this.intervalPerLevel.entries()) {
      if (ranges.every((range) => !tree.intersect_any(range))) {
        ranges.forEach((range) => {
          tree.insert(range);
        });
        this.id2level.set(item.id, level);
        return;
      }
    }
    this.id2level.set(item.id, this.intervalPerLevel.length);
    const tree = new IntervalTree();
    ranges.forEach((range) => {
      tree.insert(range);
    });
    this.intervalPerLevel.push(tree);
  }

  fetchLevel(item: Identifiable): number | undefined {
    return this.id2level.get(item.id);
  }

  get maxLevel(): number {
    return Math.max(Math.max(...this.id2level.values()) + 1, 0);
  }

  clear(): void {
    this.intervalPerLevel = [];
    this.id2level.clear();
  }
}
