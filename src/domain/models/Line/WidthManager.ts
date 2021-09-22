import { Font } from "./Font";

export interface WidthManager {
  width: number;
  add(ch: string, return_max: boolean): void;
  reset(): void;
  isFull(wordOrLabelWidth: number): boolean;
  isEmpty(): boolean;
}

export class LineWidthManager implements WidthManager {
  private totalWidth = 0;

  constructor(
    private font: Font,
    private maxLineWidth: number,
    private maxLabelWidth: number
  ) {}

  get width(): number {
    // console.log(this.maxLineWidth, this.maxLabelWidth)
    return this.totalWidth;
  }

  add(ch: string, return_max = false): void {
    this.totalWidth += this.font.widthOf(ch, return_max);
  }

  reset(): void {
    this.totalWidth = 0;
  }

  isFull(wordOrLabelWidth = 0): boolean {
    return (
      this.maxLineWidth - this.maxLabelWidth <=
      this.totalWidth + wordOrLabelWidth
    );
  }

  isEmpty(): boolean {
    return this.totalWidth === 0;
  }
}
