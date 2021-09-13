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
    return (
      this.level === line.level &&
      this.startOffset === line.startOffset &&
      this.endOffset === line.endOffset
    );
  }
}
