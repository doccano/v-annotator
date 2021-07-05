import { TextLine } from "./TextLine";
import { WidthCalculator } from "./Strategy";

export class TextLineSplitter {
  constructor(
    private vocab: Map<string, number>,
    private widthCalculator: WidthCalculator
  ) {}

  split(text: string): TextLine[] {
    let accumulatedWidth = 0;
    let startIndex = 0;
    const lines = [] as TextLine[];

    for (const [i, ch] of Array.from(text).entries()) {
      const charWidth = this.widthCalculator.calculateWidth(ch);
      accumulatedWidth += charWidth;
      if (this.widthCalculator.needsNewline(accumulatedWidth, ch)) {
        const line = new TextLine(
          text.substring(startIndex, i),
          startIndex,
          i,
          this.vocab
        );
        lines.push(line);
        startIndex = ch === "\n" ? i + 1 : i;
        accumulatedWidth = charWidth;
      }
    }
    if (accumulatedWidth > 0) {
      const line = new TextLine(
        text.substring(startIndex),
        startIndex,
        text.length,
        this.vocab
      );
      lines.push(line);
    }
    return lines;
  }
}
