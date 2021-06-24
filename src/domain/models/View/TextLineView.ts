import { TextLine } from "../Line/TextLine";
import { SVGNS } from "../Character/SVGNS";

export class TextLineView {
  constructor(
    private textLine: TextLine,
    private textElement: SVGTextElement
  ) {}

  get height(): number {
    const textSpanElement = document.createElementNS(
      SVGNS,
      "tspan"
    ) as SVGTSpanElement;
    this.textElement.appendChild(textSpanElement);
    textSpanElement.textContent = this.textLine.content;
    const height = textSpanElement.getBBox().height;
    this.textElement.removeChild(textSpanElement);
    return height;
  }
}
