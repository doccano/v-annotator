import config from "@/domain/models/Config/Config";
import { Identifiable } from "./Identifiable";

export interface Label {
  readonly id: number;
  readonly text: string;
  readonly color?: string;
  readonly backgroundColor?: string;
}

export class LabelListItem implements Identifiable {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly color: string,
    readonly textWidth: number,
    readonly maxLength = config.maxLabelLength
  ) {}

  get width(): number {
    return this.textWidth;
  }

  get truncatedText(): string {
    if (this.text.length <= this.maxLength) {
      return this.text;
    } else {
      return `${this.text.slice(0, this.maxLength)}...`;
    }
  }

  get truncatedWidth(): number {
    const meanCharLength = this.textWidth / this.text.length;
    return meanCharLength * Math.min(this.text.length, this.maxLength);
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
    return this.getById(id)?.truncatedText;
  }

  getWidth(id: number): number | undefined {
    return this.getById(id)?.truncatedWidth;
  }

  get maxLabelWidth(): number {
    return Math.max(...this.labels.map((label) => label.truncatedWidth), 0);
  }

  static valueOf(
    labels: Label[],
    widths: number[],
    itemClass: typeof LabelListItem
  ): LabelList {
    return new LabelList(
      labels.map(
        (label, index) =>
          new itemClass(
            label.id,
            label.text,
            (label.color || label.backgroundColor)!,
            widths[index]
          )
      )
    );
  }
}
