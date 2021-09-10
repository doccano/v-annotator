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
}
