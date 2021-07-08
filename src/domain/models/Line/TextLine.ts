import { SVGNS } from "./SVGNS";
import { Font } from "./Font";

export class TextLine {
  private spans: Span[] = [];
  constructor(private font: Font) {}

  get startOffset(): number {
    return this.spans[0].startOffset;
  }

  get endOffset(): number {
    return this.spans[this.spans.length - 1].endOffset;
  }

  addSpan(dx: number, startOffset: number, endOffset: number): void {
    const span = new Span(dx, startOffset, endOffset);
    this.spans.push(span);
  }

  range(
    content: string,
    startOffset: number,
    endOffset: number
  ): [number, number] {
    const calcPosition = (start: number, end: number) =>
      this.font.widthOf(content.substring(start, end)) + // sum of character width
      this.spans // sum of dx
        .filter((span) => span.startOffset < end)
        .reduce((p, span) => p + span.dx, 0);
    const x1 = calcPosition(this.startOffset, startOffset);
    const x2 = x1 + calcPosition(startOffset, endOffset);
    return [x1, x2];
  }

  render(content: string): SVGTSpanElement {
    const tspanElement = document.createElementNS(
      SVGNS,
      "tspan"
    ) as SVGTSpanElement;
    for (const span of this.spans) {
      tspanElement.appendChild(span.render(content));
    }
    Object.assign(tspanElement, { annotatorElement: this });
    return tspanElement;
  }
}

export class Span {
  constructor(
    readonly dx: number,
    readonly startOffset: number,
    readonly endOffset: number
  ) {}

  render(content: string): SVGTSpanElement {
    const tspanElement = document.createElementNS(
      SVGNS,
      "tspan"
    ) as SVGTSpanElement;
    tspanElement.setAttribute("dx", this.dx.toString());
    tspanElement.textContent = content.substring(
      this.startOffset,
      this.endOffset
    );
    return tspanElement;
  }
}
