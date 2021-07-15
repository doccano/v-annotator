export class Font {
  constructor(
    readonly fontSize: number,
    readonly fontFamily: string,
    readonly fontWeight: string,
    readonly lineHeight: number,
    readonly width: Map<string, number>
  ) {}

  widthOf(text: string): number {
    return Array.from(text)
      .map((ch) => (this.width.has(ch) ? this.width.get(ch)! : 0))
      .reduce((a: number, b: number) => a + b, 0);
  }
}
