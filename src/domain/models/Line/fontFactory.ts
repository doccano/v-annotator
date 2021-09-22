import { Font } from "./Font";

export function createFont(text: string, textElement: SVGTextElement): Font {
  // Calculate font width
  const characterSet = new Set(text);
  const width = new Map();
  characterSet.delete("\n");
  const characterArray = Array.from(characterSet);
  characterArray.sort();
  textElement.textContent = characterArray.join("");
  characterArray.forEach((ch: string, index: number) => {
    width.set(ch, textElement.getExtentOfChar(index).width);
  });
  width.set("\n", 0);

  // Extract font information
  const fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
  const fontFamily = window.getComputedStyle(textElement).fontFamily;
  const fontWeight = window.getComputedStyle(textElement).fontWeight;
  const lineHeight = textElement.getBoundingClientRect().height;
  textElement.textContent = "";
  return new Font(fontSize, fontFamily, fontWeight, lineHeight, width);
}

export function widthOf(text: string, textElement: SVGTextElement): number {
  let width = 0;
  textElement.textContent = text;
  for (let i = 0; i < text.length; i++) {
    width += textElement.getExtentOfChar(i).width;
  }
  textElement.textContent = "";
  return width;
}
