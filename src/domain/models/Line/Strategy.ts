import { Font } from "./Font";
export interface WidthCalculator {
  width: number;
  calculateWidth(ch: string): number;
  add(ch: string): void;
  addWidth(width: number): void;
  reset(): void;
  needsNewline(ch: string, maxLabelWidth: number): boolean;
  remains(): boolean;
}

export class TextWidthCalculator implements WidthCalculator {
  private accumulatedWidth = 0;
  constructor(private font: Font, private maxWidth: number) {}

  get width(): number {
    return this.accumulatedWidth;
  }

  calculateWidth(ch: string): number {
    return this.font.widthOfChar(ch);
  }

  add(ch: string): void {
    this.accumulatedWidth += this.calculateWidth(ch);
  }

  addWidth(width: number): void {
    this.accumulatedWidth += width;
  }

  reset(): void {
    this.accumulatedWidth = 0;
  }

  needsNewline(ch: string, maxLabelWidth = 0): boolean {
    return (
      this.accumulatedWidth + maxLabelWidth >= this.maxWidth || ch === "\n"
    );
  }

  remains(): boolean {
    return this.accumulatedWidth > 0;
  }
}
