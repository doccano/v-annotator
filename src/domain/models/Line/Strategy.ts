export interface WidthCalculator {
  calculateWidth(ch: string): number;
  needsNewline(accumulatedWidth: number, ch: string): boolean;
}

export class TextWidthCalculator implements WidthCalculator {
  constructor(private vocab: Map<string, number>, private maxWidth: number) {}

  calculateWidth(ch: string): number {
    const charWidth = this.vocab.has(ch) ? this.vocab.get(ch)! : 0;
    return charWidth;
  }

  needsNewline(accumulatedWidth: number, ch: string): boolean {
    return accumulatedWidth > this.maxWidth || ch === "\n";
  }
}
