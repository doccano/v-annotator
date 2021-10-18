export interface WidthManager {
  width: number;
  maxWidth: number;
  add(width: number): void;
  reset(): void;
  isFull(wordOrLabelWidth: number): boolean;
  isEmpty(): boolean;
  canAdd(width: number): boolean;
}

export class LineWidthManager implements WidthManager {
  private totalWidth = 0;

  constructor(private maxLineWidth: number, private maxLabelWidth: number) {}

  get width(): number {
    return this.totalWidth;
  }

  get maxWidth(): number {
    return this.maxLineWidth - this.maxLabelWidth;
  }

  add(width: number): void {
    this.totalWidth += width;
  }

  reset(): void {
    this.totalWidth = 0;
  }

  isFull(wordOrLabelWidth = 0): boolean {
    return this.maxWidth < this.totalWidth + wordOrLabelWidth;
  }

  canAdd(width: number): boolean {
    return this.totalWidth + width <= this.maxWidth;
  }

  isEmpty(): boolean {
    return this.totalWidth === 0;
  }
}
