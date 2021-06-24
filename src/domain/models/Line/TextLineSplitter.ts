import { TextLine } from "./TextLine";

export class TextLineSplitter {
  constructor(private vocab: Map<string, number>, private maxWidth: number) {}

  split(text: string): TextLine[] {
    let accumulatedWidth = 0;
    let startIndex = 0;
    const lines = [] as TextLine[];

    for (const [i, ch] of Array.from(text).entries()) {
      const charWidth = this.vocab.has(ch) ? this.vocab.get(ch)! : 0;
      accumulatedWidth += charWidth;
      if (accumulatedWidth > this.maxWidth || ch === "\n") {
        const line = new TextLine(text.substring(startIndex, i), startIndex, i);
        lines.push(line);
        startIndex = ch === "\n" ? i + 1 : i;
        accumulatedWidth = charWidth;
      }
    }
    if (accumulatedWidth > 0) {
      const line = new TextLine(
        text.substring(startIndex),
        startIndex,
        text.length
      );
      lines.push(line);
    }
    return lines;
  }
}
