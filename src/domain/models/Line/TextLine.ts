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
    element: SVGTextElement,
    startOffset: number,
    endOffset: number
  ): [number, number] {
    const s = Math.max(startOffset, this.startOffset);
    const e = Math.min(endOffset, this.endOffset);
    const widthOf = (startOffset: number, endOffset: number) => {
      let sum = 0;
      for (let i = startOffset; i < endOffset; i++) {
        sum += element.getExtentOfChar(i - this.startOffset).width;
      }
      return sum;
    };
    const x1 = widthOf(this.startOffset, s);
    const x2 = x1 + widthOf(s, e);
    return [x1, x2];
  }
}
