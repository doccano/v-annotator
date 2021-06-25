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
  constructor(private entities: Entity[]) {}

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

  list(): Entity[] {
    return this.entities;
  }

  filterByRange(startOffset: number, endOffset: number): Entities {
    return new Entities(
      this.entities.filter((entity) => entity.isIn(startOffset, endOffset))
    );
  }
}
