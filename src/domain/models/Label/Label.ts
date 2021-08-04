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
  private id2Label: { [key: number]: Label } = {};

  constructor(private labels: Label[]) {
    for (const label of labels) {
      this.id2Label[label.id] = label;
    }
  }

  static valueOf(labels: ILabel[]): Labels {
    return new Labels(
      labels.map((label) => new Label(label.id, label.text, label.color))
    );
  }

  getById(id: number): Label | undefined {
    return this.id2Label[id];
  }

  list(): Label[] {
    return this.labels;
  }
}
