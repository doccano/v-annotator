import GraphemeSplitter from "grapheme-splitter";

export class Text {
  private graphemes: string[] = [];
  private g2c: Map<number, number> = new Map();
  private c2g: Map<number, number> = new Map();

  constructor(readonly text: string) {
    const splitter = new GraphemeSplitter();
    this.graphemes = splitter.splitGraphemes(text);
    let total = 0;
    for (let i = 0; i < this.graphemeLength; i++) {
      this.g2c.set(i, total);
      total += this.graphemeAt(i).length;
    }
    for (const [graphemeOffset, codeOffset] of this.g2c) {
      this.c2g.set(codeOffset, graphemeOffset);
    }
  }

  toGraphemeOffset(codePointOffset: number): number {
    return this.c2g.get(codePointOffset)!;
  }

  toCodePointOffset(graphemeOffset: number): number {
    return this.g2c.get(graphemeOffset)!;
  }

  graphemeAt(pos: number): string {
    return this.graphemes[pos];
  }

  charAt(pos: number): string {
    return this.text.charAt(pos);
  }

  get graphemeLength(): number {
    return this.graphemes.length;
  }

  get codePointLength(): number {
    return this.text.length;
  }

  substr(from: number, length: number): string {
    return this.text.substr(from, length);
  }
}
