export class Label {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly color: string
  ) {}
}

export interface ILabel {
  id: number;
  text: string;
  color: string;
}

export class Labels {
  constructor(private labels: Label[]) {}

  static valueOf(labels: ILabel[]): Labels {
    return new Labels(
      labels.map((label) => new Label(label.id, label.text, label.color))
    );
  }

  getById(id: number): Label | undefined {
    return this.labels.find((label) => label.id === id);
  }

  list(): Label[] {
    return this.labels;
  }
}
