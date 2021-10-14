import config from "@/domain/models/Config/Config";
export interface Label {
  readonly id: number;
  readonly text: string;
  readonly color: string;
}

export class LabelListItem {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly color: string,
    readonly textWidth: number
  ) {}

  get width(): number {
    return this.textWidth;
  }
}

export class EntityLabelListItem extends LabelListItem {
  get width(): number {
    return config.diameter + config.labelMargin + this.textWidth;
  }
}

export class RelationLabelListItem extends LabelListItem {}

export class LabelList {
  private id2Label: { [key: number]: LabelListItem } = {};

  constructor(private labels: LabelListItem[]) {
    for (const label of labels) {
      this.id2Label[label.id] = label;
    }
  }

  getById(id: number): LabelListItem | undefined {
    return this.id2Label[id];
  }

  getColor(id: number): string | undefined {
    return this.getById(id)?.color;
  }

  getText(id: number): string | undefined {
    return this.getById(id)?.text;
  }

  getWidth(id: number): number | undefined {
    return this.getById(id)?.width;
  }

  get maxLabelWidth(): number {
    return Math.max(...this.labels.map((label) => label.width), 0);
  }

  static valueOf(
    labels: Label[],
    widths: number[],
    itemClass: typeof LabelListItem
  ): LabelList {
    return new LabelList(
      labels.map(
        (label, index) =>
          new itemClass(label.id, label.text, label.color, widths[index])
      )
    );
  }
}
