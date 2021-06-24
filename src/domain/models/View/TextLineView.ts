import { TextLine } from "../Line/TextLine";
import { SVGNS } from "../Character/SVGNS";

export class TextLineView {
  private _y: number;

  constructor(private textLine: TextLine, private textElement: SVGTextElement) {
    this.textLine = textLine;
    this.textElement = textElement;
    this._y = 0;
  }

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

  set y(y: number) {
    this._y = y;
  }
}
