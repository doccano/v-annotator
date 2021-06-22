export class Relation {
  constructor(
    public id: number,
    public labelId: number,
    public fromId: number,
    public toId: number
  ) {}
}
