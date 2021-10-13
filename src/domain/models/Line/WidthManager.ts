import { Font } from "./Font";

export interface WidthManager {
  width: number;
  maxWidth: number;
  add(ch: string, return_max: boolean): void;
  reset(): void;
  isFull(wordOrLabelWidth: number): boolean;
  isEmpty(): boolean;
  canInsertChar(char: string): boolean;
}

export class LineWidthManager implements WidthManager {
  private totalWidth = 0;

  constructor(
    private font: Font,
    private maxLineWidth: number,
    private maxLabelWidth: number
  ) {}

  get width(): number {
    return this.totalWidth;
  }

  get maxWidth(): number {
    return this.maxLineWidth - this.maxLabelWidth;
  }

  add(ch: string, return_max = false): void {
    this.totalWidth += this.font.widthOf(ch, return_max);
  }

  reset(): void {
    this.totalWidth = 0;
  }

  isFull(wordOrLabelWidth = 0): boolean {
    return this.maxWidth < this.totalWidth + wordOrLabelWidth;
  }

  canInsertChar(char: string): boolean {
    return (
      this.totalWidth + this.font.widthOf(char, char.length > 1) <=
      this.maxWidth
    );
  }

  isEmpty(): boolean {
    return this.totalWidth === 0;
  }
}
