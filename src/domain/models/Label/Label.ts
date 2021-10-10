import config from "@/domain/models/Config/Config";
export interface Label {
  readonly id: number;
  readonly text: string;
  readonly color: string;
}

export interface LabelListItem {
  readonly id: number;
  readonly text: string;
  readonly color: string;
  readonly textWidth: number;
  width: number;
}

export class EntityLabelListItem implements LabelListItem {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly color: string,
    readonly textWidth: number
  ) {}

  get width(): number {
    return config.diameter + config.labelMargin + this.textWidth;
  }
}

export class RelationLabelListItem implements LabelListItem {
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

export abstract class LabelList {
  private id2Label: { [key: number]: LabelListItem } = {};

  constructor(private labels: LabelListItem[]) {
    for (const label of labels) {
      this.id2Label[label.id] = label;
    }
  }

  getById(id: number): LabelListItem | undefined {
    return this.id2Label[id];
  }

  getColor(id: number): string {
    return this.getById(id)!.color;
  }

  getText(id: number): string {
    return this.getById(id)!.text;
  }

  getWidth(id: number): number {
    return this.getById(id)!.width;
  }

  maxLabelWidth(): number {
    return Math.max(...this.labels.map((label) => label.width), 0);
  }

  list(): LabelListItem[] {
    return this.labels;
  }
}

export class EntityLabelList extends LabelList {
  static valueOf(labels: Label[], widths: number[]): EntityLabelList {
    return new EntityLabelList(
      labels.map(
        (label, index) =>
          new EntityLabelListItem(
            label.id,
            label.text,
            label.color,
            widths[index]
          )
      )
    );
  }
}

export class RelationLabelList extends LabelList {
  static valueOf(labels: Label[], widths: number[]): RelationLabelList {
    return new RelationLabelList(
      labels.map(
        (label, index) =>
          new RelationLabelListItem(
            label.id,
            label.text,
            label.color,
            widths[index]
          )
      )
    );
  }
}
