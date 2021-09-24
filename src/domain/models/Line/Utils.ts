export function widthOf(text: string, textElement: SVGTextElement): number {
  let width = 0;
  textElement.textContent = text;
  for (let i = 0; i < text.length; i++) {
    width += textElement.getExtentOfChar(i).width;
  }
  textElement.textContent = "";
  return width;
}
