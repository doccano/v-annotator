import { TextLine } from "./TextLine";
import { WidthCalculator } from "./Strategy";
import { Font } from "./Font";

export class TextLineSplitter {
  constructor(private font: Font, private widthCalculator: WidthCalculator) {}

  split(text: string): TextLine[] {
    let startIndex = 0;
    let line = new TextLine(this.font);
    const lines = [] as TextLine[];

    for (const [i, ch] of Array.from(text).entries()) {
      if (this.widthCalculator.needsNewline(ch)) {
        line.addSpan(0, startIndex, i);
        lines.push(line);
        startIndex = ch === "\n" ? i + 1 : i;
        this.widthCalculator.reset();
        line = new TextLine(this.font);
      }
      this.widthCalculator.add(ch);
    }
    if (this.widthCalculator.remains()) {
      line.addSpan(0, startIndex, text.length);
      lines.push(line);
    }
    return lines;
  }
}
