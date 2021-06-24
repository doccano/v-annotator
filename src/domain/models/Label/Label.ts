export class Label {
  constructor(
    public id: number,
    public text: string,
    public prefixKey: string | null,
    public suffixKey: string | null,
    public color: string
  ) {}
}

interface ILabel {
  id: number;
  text: string;
  prefixKey: string | null;
  suffixKey: string | null;
  color: string;
}

export class Labels {
  constructor(private labels: Label[]) {}

  static valueOf(labels: ILabel[]): Labels {
    return new Labels(
      labels.map(
        (label) =>
          new Label(
            label.id,
            label.text,
            label.prefixKey,
            label.suffixKey,
            label.color
          )
      )
    );
  }

  getById(id: number): Label | undefined {
    return this.labels.find((label) => label.id === id);
  }
}
