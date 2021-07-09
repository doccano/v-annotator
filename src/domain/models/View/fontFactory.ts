import { SVGNS } from "./SVGNS";
import { Font } from "../Line/Font";

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
