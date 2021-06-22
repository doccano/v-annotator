export class Entity {
  constructor(
    public id: number,
    public label: number,
    public user: number,
    public startOffset: number,
    public endOffset: number
  ) {}
}
