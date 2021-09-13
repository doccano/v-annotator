import { Font } from "./Font";
export interface WidthManager {
  width: number;
  add(ch: string): void;
  reset(): void;
  isFull(wordOrLabelWidth: number): boolean;
  isEmpty(): boolean;
}

export class LineWidthManager implements WidthManager {
  private totalWidth = 0;

  constructor(private font: Font, private maxLineWidth: number) {}

  get width(): number {
    return this.totalWidth;
  }

  add(ch: string): void {
    this.totalWidth += this.font.widthOfChar(ch);
  }

  reset(): void {
    this.totalWidth = 0;
  }

  isFull(wordOrLabelWidth = 0): boolean {
    return this.maxLineWidth <= this.totalWidth + wordOrLabelWidth;
  }

  isEmpty(): boolean {
    return this.totalWidth === 0;
  }
}
