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
  private levels: Map<number, number>;

  constructor(private entities: Entity[]) {
    //this.entities.sort((a: Entity, b: Entity) => a.startOffset - b.startOffset);
    this.entities = entities;
    this.levels = new Map();
    this.calculateLevel();
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
    return this.entities.length;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  private calculateLevel() {
    for (const [i, entity] of this.entities.entries()) {
      const levels = this.entities
        .slice(0, i)
        .filter((item) => entity.isIn(item.startOffset, item.endOffset))
        .map((item) => this.levels.get(item.id));
      let level = 0;
      while (levels.includes(level)) {
        level++;
      }
      this.levels.set(entity.id, level);
    }
  }

  getLevelOf(id: number): number | undefined {
    return this.levels.get(id);
  }

  getAt(startOffset: number): Entities {
    return new Entities(
      this.entities.filter((entity) => entity.startOffset === startOffset)
    );
  }

  startsAt(startOffset: number): boolean {
    const entities = this.getAt(startOffset);
    return !entities.isEmpty();
  }

  list(): Entity[] {
    return this.entities;
  }

  filterByRange(startOffset: number, endOffset: number): Entities {
    return new Entities(
      this.entities.filter((entity) => entity.isIn(startOffset, endOffset))
    );
  }
}
