import { SVGNS } from "../View/SVGNS";

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

export function createFont(text: string, textElement: SVGTextElement): Font {
  const testRenderElement = document.createElementNS(
    SVGNS,
    "tspan"
  ) as SVGTSpanElement;
  textElement.appendChild(testRenderElement);
  const characterSet = new Set(text);
  const width = new Map();
  characterSet.delete("\n");
  const characterArray = Array.from(characterSet);
  testRenderElement.textContent = characterArray.join("");
  characterArray.forEach((ch: string, index: number) => {
    width.set(ch, testRenderElement.getExtentOfChar(index).width);
  });
  width.set("\n", 0);
  const fontSize = parseFloat(
    window.getComputedStyle(testRenderElement).fontSize
  );
  const fontFamily = window.getComputedStyle(testRenderElement).fontFamily;
  const fontWeight = window.getComputedStyle(testRenderElement).fontWeight;
  const lineHeight = testRenderElement.getBoundingClientRect().height;
  testRenderElement.remove();
  return new Font(fontSize, fontFamily, fontWeight, lineHeight, width);
}
