export class TextLine {
  constructor(
    private _content: string,
    private _startOffset: number,
    private _endOffset: number,
    private vocab: Map<string, number>
  ) {}

  get content(): string {
    return this._content;
  }

  get startOffset(): number {
    return this._startOffset;
  }

  get endOffset(): number {
    return this._endOffset;
  }

  range(startOffset: number, endOffset: number): [number, number] {
    const x1 = Array.from(
      this._content.substring(0, startOffset - this.startOffset)
    )
      .map((ch) => this.vocab.get(ch)!)
      .reduce((p, x) => p + x, 0);
    const x2 =
      x1 +
      Array.from(
        this._content.substring(
          startOffset - this.startOffset,
          endOffset - this.startOffset
        )
      )
        .map((ch) => this.vocab.get(ch)!)
        .reduce((p, x) => p + x, 0);
    return [x1, x2];
  }
}
