import { Line } from "./Line";

export class LineSplitter {
  constructor(private vocab: Map<string, number>, private maxWidth: number) {}

  split(text: string): Line[] {
    let accumulatedWidth = 0;
    let startIndex = 0;
    const lines = [] as Line[];

    for (const [i, ch] of Array.from(text).entries()) {
      const charWidth = this.vocab.get(ch)!;
      accumulatedWidth += charWidth;
      if (accumulatedWidth > this.maxWidth) {
        const line = new Line(text.substring(startIndex, i));
        lines.push(line);
        startIndex = i;
        accumulatedWidth = charWidth;
      }
    }
    if (accumulatedWidth > 0) {
      const line = new Line(text.substring(startIndex));
      lines.push(line);
    }
    return lines;
  }
}
