import { TextLine } from "../Line/TextLine";

export class TextLineView {
  constructor(
    private textLine: TextLine,
    private textElement: SVGTextElement
  ) {}

  render(content: string): SVGTSpanElement {
    const tspanElement = this.textLine.render(content);
    Object.assign(tspanElement, { annotatorElement: this });
    this.textElement.appendChild(tspanElement);
    return tspanElement;
  }

  get startOffset(): number {
    return this.textLine.startOffset;
  }

  get endOffset(): number {
    return this.textLine.endOffset;
  }
}
