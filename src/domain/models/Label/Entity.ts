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

export class Entities {
  private tree: IntervalTree<Entity> = new IntervalTree();

  constructor(entities: Entity[]) {
    for (const entity of entities) {
      this.tree.insert([entity.startOffset, entity.endOffset], entity);
    }
  }

  static valueOf(entities: Entity[]): Entities {
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
    return this.tree.size;
  }

  delete(entity: Entity): void {
    this.tree.remove([entity.startOffset, entity.endOffset], entity);
  }

  add(entity: Entity): void {
    this.tree.insert([entity.startOffset, entity.endOffset], entity);
  }

  replace(oldEntity: Entity, newEntity: Entity): void {
    this.delete(oldEntity);
    this.add(newEntity);
  }

  update(others: Entity[]): void {
    const oldEntities = this.list();
    const newMapping: { [key: number]: Entity } = {};
    for (let i = 0; i < others.length; i++) {
      newMapping[others[i].id] = others[i];
    }
    // delete entities
    const oldMapping: { [key: number]: Entity } = {};
    for (let i = 0; i < oldEntities.length; i++) {
      const entity = oldEntities[i];
      oldMapping[entity.id] = entity;
      if (!(entity.id in newMapping)) {
        this.delete(entity);
      }
    }
    // add or update entities
    for (let i = 0; i < others.length; i++) {
      const entity = others[i];
      if (entity.id in oldMapping) {
        const other = oldMapping[entity.id];
        if (
          !(
            entity.label === other.label &&
            entity.startOffset === other.startOffset &&
            entity.endOffset === other.endOffset
          )
        ) {
          this.replace(other, entity);
        }
      } else {
        this.add(entity);
      }
    }
  }

  list(): Entity[] {
    return this.tree.values;
  }

  filterByRange(startOffset: number, endOffset: number): Entity[] {
    return this.tree
      .search([startOffset, endOffset])
      .filter((entity: Entity) => entity.isIn(startOffset, endOffset));
  }
}

export class LevelManager {
  private labelIntervalPerLevel: IntervalTree[] = [];
  private entityLevel: Map<number, number> = new Map(); // <entity.id, level>

  update(entity: Entity, ranges: [number, number][]): void {
    for (const [level, tree] of this.labelIntervalPerLevel.entries()) {
      if (ranges.every((range) => !tree.intersect_any(range))) {
        ranges.forEach((range) => {
          tree.insert(range);
        });
        this.entityLevel.set(entity.id, level);
        return;
      }
    }
    this.entityLevel.set(entity.id, this.labelIntervalPerLevel.length);
    const tree = new IntervalTree();
    ranges.forEach((range) => {
      tree.insert(range);
    });
    this.labelIntervalPerLevel.push(tree);
  }

  fetchLevel(entity: Entity): number | undefined {
    return this.entityLevel.get(entity.id);
  }

  get maxLevel(): number {
    return Math.max(Math.max(...this.entityLevel.values()) + 1, 0);
  }

  clear(): void {
    this.labelIntervalPerLevel = [];
    this.entityLevel.clear();
  }
}
