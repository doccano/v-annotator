export class Label {
  constructor(
    public id: number,
    public text: string,
    public prefixKey: string | null,
    public suffixKey: string | null,
    public color: string
  ) {}
}
