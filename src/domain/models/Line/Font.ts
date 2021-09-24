export class Font {
  constructor(
    readonly fontSize: number,
    readonly fontFamily: string,
    readonly fontWeight: string,
    readonly lineHeight: number,
    readonly width: Map<string, number>
  ) {}

  widthOf(text: string, return_max = false): number {
    if (return_max) {
      return Math.max(...Array.from(text).map((ch) => this.widthOfChar(ch)));
    } else {
      return Array.from(text)
        .map((ch) => this.widthOfChar(ch))
        .reduce((a: number, b: number) => a + b, 0);
    }
  }

  widthOfChar(ch: string): number {
    return this.width.get(ch) || 0;
  }

  static create(text: string, textElement: SVGTextElement): Font {
    // Calculate font width
    const characterSet = new Set(text);
    const width = new Map();
    characterSet.delete("\n");
    const characterArray = Array.from(characterSet);
    characterArray.sort();
    textElement.textContent = characterArray.join("");
    for (let i = 0; i < textElement.getNumberOfChars(); i++) {
      const ch = textElement.textContent.charAt(i);
      width.set(ch, textElement.getExtentOfChar(i).width);
    }
    width.set("\n", 0);

    // Extract font information
    const fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
    const fontFamily = window.getComputedStyle(textElement).fontFamily;
    const fontWeight = window.getComputedStyle(textElement).fontWeight;
    const lineHeight = textElement.getBoundingClientRect().height;
    textElement.textContent = "";
    return new Font(fontSize, fontFamily, fontWeight, lineHeight, width);
  }
}
