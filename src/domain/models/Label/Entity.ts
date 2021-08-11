import IntervalTree from "@flatten-js/interval-tree";

export class Entity {
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

export interface IEntity {
  id: number;
  label: number;
  user: number;
  startOffset: number;
  endOffset: number;
}

export class Entities {
  private entityTree: IntervalTree<Entity> = new IntervalTree();
  private entityByStartOffset: { [key: number]: Entity[] } = {};

  constructor(entities: Entity[]) {
    for (const entity of entities) {
      const interval: [number, number] = [entity.startOffset, entity.endOffset];
      this.entityTree.insert(interval, entity);
      if (!(entity.startOffset in this.entityByStartOffset)) {
        this.entityByStartOffset[entity.startOffset] = [];
      }
      this.entityByStartOffset[entity.startOffset].push(entity);
    }
  }

  static valueOf(entities: IEntity[]): Entities {
    return new Entities(
      entities.map(
        (entity) =>
          new Entity(
            entity.id,
            entity.label,
            entity.user,
            entity.startOffset,
            entity.endOffset
          )
      )
    );
  }

  get size(): number {
    return this.entityTree.size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  getAt(startOffset: number): Entity[] {
    if (startOffset in this.entityByStartOffset) {
      return this.entityByStartOffset[startOffset];
    } else {
      return [];
    }
  }

  startsAt(startOffset: number): boolean {
    const entities = this.getAt(startOffset);
    return entities.length !== 0;
  }

  list(): Entity[] {
    return this.entityTree.values;
  }

  filterByRange(startOffset: number, endOffset: number): Entities {
    const interval: [number, number] = [startOffset, endOffset];
    const entities = this.entityTree
      .search(interval)
      .filter((entity: Entity) => entity.isIn(startOffset, endOffset));
    return new Entities(entities);
  }
}

export class LevelManager {
  private endOffsetPerLevel: Map<number, number> = new Map(); // <level, endOffset>
  private entityLevel: Map<number, number> = new Map(); // <entity.id, level>

  update(entity: Entity): void {
    for (const [level, endOffset] of this.endOffsetPerLevel) {
      if (endOffset <= entity.startOffset) {
        this.endOffsetPerLevel.set(level, entity.endOffset);
        this.entityLevel.set(entity.id, level);
        return;
      }
    }
    this.endOffsetPerLevel.set(this.endOffsetPerLevel.size, entity.endOffset);
    this.entityLevel.set(
      entity.id,
      Math.max(Math.max(...this.entityLevel.values()) + 1, 0)
    );
  }

  fetchLevel(entity: Entity): number | undefined {
    return this.entityLevel.get(entity.id);
  }

  get maxLevel(): number {
    return Math.max(Math.max(...this.entityLevel.values()) + 1, 0);
  }

  clear(): void {
    this.endOffsetPerLevel.clear();
    this.entityLevel.clear();
  }
}
