import { TextLine } from "../Line/TextLine";
import { SVGNS } from "../Character/SVGNS";

export class TextLineView {
  constructor(
    private textLine: TextLine,
    private textElement: SVGTextElement
  ) {}

  render(): SVGTSpanElement {
    const textSpanElement = document.createElementNS(
      SVGNS,
      "tspan"
    ) as SVGTSpanElement;
    textSpanElement.textContent = this.textLine.content;
    this.textElement.appendChild(textSpanElement);
    return textSpanElement;
  }
}
