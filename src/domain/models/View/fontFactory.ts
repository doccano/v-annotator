import { SVGNS } from "./SVGNS";
import { Font } from "../Line/Font";

export function createFont(text: string, container: HTMLElement): Font {
  // Create elements
  const svgElement = document.createElementNS(SVGNS, "svg") as SVGElement;
  const textElement = document.createElementNS(SVGNS, "text") as SVGTextElement;
  const tspanElement = document.createElementNS(
    SVGNS,
    "tspan"
  ) as SVGTSpanElement;

  // Append elements
  container.appendChild(svgElement);
  svgElement.appendChild(textElement);
  textElement.appendChild(tspanElement);

  // Calculate font width
  const characterSet = new Set(text);
  const width = new Map();
  characterSet.delete("\n");
  const characterArray = Array.from(characterSet);
  tspanElement.textContent = characterArray.join("");
  characterArray.forEach((ch: string, index: number) => {
    width.set(ch, tspanElement.getExtentOfChar(index).width);
  });
  width.set("\n", 0);

  // Extract font information
  const fontSize = parseFloat(window.getComputedStyle(tspanElement).fontSize);
  const fontFamily = window.getComputedStyle(tspanElement).fontFamily;
  const fontWeight = window.getComputedStyle(tspanElement).fontWeight;
  const lineHeight = tspanElement.getBoundingClientRect().height;
  tspanElement.remove();
  return new Font(fontSize, fontFamily, fontWeight, lineHeight, width);
}

export function widthOf(text: string, tspanElement: SVGTSpanElement): number {
  let width = 0;
  tspanElement.textContent = text;
  for (let i = 0; i < text.length; i++) {
    width += tspanElement.getExtentOfChar(i).width;
  }
  return width;
}
