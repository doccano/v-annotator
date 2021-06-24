export class TextLine {
  constructor(
    private _content: string,
    private _startOffset: number,
    private _endOffset: number
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
}
