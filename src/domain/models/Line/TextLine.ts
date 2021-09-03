import { Font } from "./Font";

export class TextLine {
  private _level = 0;
  constructor(private _spans: Span[] = []) {}

  get startOffset(): number {
    return this._spans[0].startOffset;
  }

  get endOffset(): number {
    return this._spans[this._spans.length - 1].endOffset;
  }

  get spans(): Span[] {
    return this._spans;
  }
  get level(): number {
    return this._level;
  }

  set level(level: number) {
    this._level = level;
  }

  equal(line: TextLine): boolean {
    if (line.spans.length !== this.spans.length) {
      return false;
    }
    if (line.level !== this.level) {
      return false;
    }
    for (let i = 0; i < line.spans.length; i++) {
      if (!line.spans[i].equalTo(this.spans[i])) {
        return false;
      }
    }
    return true;
  }

  addSpan(dx: number, startOffset: number, endOffset: number): void {
    const span = new Span(dx, startOffset, endOffset);
    this._spans.push(span);
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

export class Span {
  constructor(
    readonly dx: number,
    readonly startOffset: number,
    readonly endOffset: number
  ) {}

  equalTo(other: Span): boolean {
    return (
      this.dx === other.dx &&
      this.startOffset === other.startOffset &&
      this.endOffset === other.endOffset
    );
  }
}
