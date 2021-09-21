export class TextLine {
  constructor(readonly startOffset: number, readonly endOffset: number) {}

  equal(line: TextLine): boolean {
    return (
      this.startOffset === line.startOffset && this.endOffset === line.endOffset
    );
  }
}
