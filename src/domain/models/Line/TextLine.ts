import { Font } from "./Font";

export class TextLine {
  private _level = 0;
  constructor(readonly startOffset: number, readonly endOffset: number) {}

  get level(): number {
    return this._level;
  }

  set level(level: number) {
    this._level = level;
  }

  equal(line: TextLine): boolean {
    if (line.level !== this.level) {
      return false;
    }
    return (
      line.startOffset === this.startOffset && line.endOffset === this.endOffset
    );
  }

  range(
    font: Font,
    content: string,
    startOffset: number,
    endOffset: number
  ): [number, number] {
    const s = Math.max(startOffset, this.startOffset);
    const e = Math.min(endOffset, this.endOffset);
    const x1 = font.widthOf(content.substring(this.startOffset, s));
    const x2 = x1 + font.widthOf(content.substring(s, e));
    return [x1, x2];
  }
}
