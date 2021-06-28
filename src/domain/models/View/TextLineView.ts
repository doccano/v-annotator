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
    Object.assign(textSpanElement, { annotatorElement: this });
    this.textElement.appendChild(textSpanElement);
    return textSpanElement;
  }

  get startOffset(): number {
    return this.textLine.startOffset;
  }

  get endOffset(): number {
    return this.textLine.endOffset;
  }
}
