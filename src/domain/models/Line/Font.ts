export class Font {
  constructor(
    readonly fontSize: number,
    readonly fontFamily: string,
    readonly fontWeight: string,
    readonly lineHeight: number,
    readonly width: Map<string, number>
  ) {}

  widthOf(text: Array<string> | string): number {
    if (typeof text === "string") {
      return this.widthOf(Array.from(text));
    } else {
      return text
        .map((ch) => this.width.get(ch)!)
        .reduce((a: number, b: number) => a + b, 0);
    }
  }
}
