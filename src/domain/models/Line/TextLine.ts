export class TextLine {
  constructor(
    readonly content: string,
    readonly startOffset: number,
    readonly endOffset: number,
    private vocab: Map<string, number>
  ) {}

  range(startOffset: number, endOffset: number): [number, number] {
    const x1 = Array.from(
      this.content.substring(0, startOffset - this.startOffset)
    )
      .map((ch) => this.vocab.get(ch)!)
      .reduce((p, x) => p + x, 0);
    const x2 =
      x1 +
      Array.from(
        this.content.substring(
          startOffset - this.startOffset,
          endOffset - this.startOffset
        )
      )
        .map((ch) => this.vocab.get(ch)!)
        .reduce((p, x) => p + x, 0);
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
