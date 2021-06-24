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

export class Entities {
  constructor(private entities: Entity[]) {}

  filterByRange(startOffset: number, endOffset: number): Entities {
    return new Entities(
      this.entities.filter((entity) => entity.isIn(startOffset, endOffset))
    );
  }
}
