import { Font } from "./Font";

export class TextLine {
  private _spans: Span[] = [];
  constructor(private font: Font) {}

  get startOffset(): number {
    return this._spans[0].startOffset;
  }

  get endOffset(): number {
    return this._spans[this._spans.length - 1].endOffset;
  }

  get spans(): Span[] {
    return this._spans;
  }

  addSpan(dx: number, startOffset: number, endOffset: number): void {
    const span = new Span(dx, startOffset, endOffset);
    this._spans.push(span);
  }

  range(
    content: string,
    startOffset: number,
    endOffset: number
  ): [number, number] {
    const calcPosition = (start: number, end: number) =>
      this.font.widthOf(content.substring(start, end)) + // sum of character width
      this.spans // sum of dx
        .filter((span) => span.startOffset < end)
        .reduce((p, span) => p + span.dx, 0);
    const x1 = calcPosition(this.startOffset, startOffset);
    const x2 = x1 + calcPosition(startOffset, endOffset);
    return [x1, x2];
  }
}

export class Span {
  constructor(
    readonly dx: number,
    readonly startOffset: number,
    readonly endOffset: number
  ) {}
}
