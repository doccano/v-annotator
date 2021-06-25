export class Entity {
  constructor(
    public id: number,
    public label: number,
    public user: number,
    public startOffset: number,
    public endOffset: number
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

  list(): Entity[] {
    return this.entities;
  }

  filterByRange(startOffset: number, endOffset: number): Entities {
    return new Entities(
      this.entities.filter((entity) => entity.isIn(startOffset, endOffset))
    );
  }
}
