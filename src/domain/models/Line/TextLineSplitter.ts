import { TextLine } from "./TextLine";
import { WidthCalculator } from "./Strategy";

export class TextLineSplitter {
  constructor(
    private vocab: Map<string, number>,
    private widthCalculator: WidthCalculator
  ) {}

  split(text: string): TextLine[] {
    let startIndex = 0;
    let line = new TextLine(this.vocab);
    const lines = [] as TextLine[];

    for (const [i, ch] of Array.from(text).entries()) {
      if (this.widthCalculator.needsNewline(ch)) {
        line.addSpan(0, startIndex, i);
        lines.push(line);
        startIndex = ch === "\n" ? i + 1 : i;
        this.widthCalculator.reset();
      }
      this.widthCalculator.add(ch);
      line = new TextLine(this.vocab);
    }
    if (this.widthCalculator.remains()) {
      line.addSpan(0, startIndex, text.length);
      lines.push(line);
    }
    return lines;
  }
}
