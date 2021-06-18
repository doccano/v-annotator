import { SVGNS } from "./SVGNS";

export function calcWidth(
  text: string,
  textElement: SVGTextElement
): Map<string, number> {
  const testRenderElement = document.createElementNS(
    SVGNS,
    "tspan"
  ) as SVGTSpanElement;
  textElement.appendChild(testRenderElement);
  const width = new Map();
  const characterSet = new Set(text);
  characterSet.delete("\n");
  const characterArray = Array.from(characterSet);
  testRenderElement.textContent = characterArray.join("");
  characterArray.forEach((ch: string, index: number) => {
    width.set(ch, testRenderElement.getExtentOfChar(index).width);
  });
  testRenderElement.remove();
  return width;
}
