import { TextWidthCalculator } from "../Line/Strategy";
import { createTextLineSplitter } from "../Line/TextLineSplitterFactory";
import { Font } from "../Line/Font";
import { Entities } from "../Label/Entity";
import { EntityLabels } from "../Line/Shape";
import { TextLineView } from "./TextLineView";
import { EntityLineView } from "./EntityLineView";
import { EventEmitter } from "events";
import { SVGNS } from "./SVGNS";
import { TextSelectionHandler } from "../EventHandler/TextSelectionHandler";

export class Annotator {
  private textSelectionHandler: TextSelectionHandler;
  constructor(
    private containerElement: HTMLElement,
    private svgElement: SVGSVGElement,
    private textElement: SVGTextElement,
    private showLabelText: boolean,
    private emitter: EventEmitter
  ) {
    this.textSelectionHandler = new TextSelectionHandler(this.emitter);
  }

  get maxWidth(): number {
    return this.containerElement!.clientWidth;
  }

  onChangeLabelOption(showLabelText: boolean): void {
    this.showLabelText = showLabelText;
  }

  onResize(): void {
    this.svgElement.setAttribute("width", `${this.maxWidth}px`);
  }

  render(
    text: string,
    font: Font,
    entities: Entities,
    entityLabels: EntityLabels
  ): void {
    let y = font.lineHeight;
    const marginBottom = 12;
    while (this.svgElement.lastChild) {
      this.svgElement.removeChild(this.svgElement.lastChild);
    }
    this.textElement = document.createElementNS(SVGNS, "text");
    this.textElement.onmouseup = () => {
      if (window.getSelection()!.type === "Range") {
        this.textSelectionHandler.textSelected();
      }
    };
    this.svgElement.appendChild(this.textElement);
    const calculator = new TextWidthCalculator(font, this.maxWidth);
    const splitter = createTextLineSplitter(
      this.showLabelText,
      calculator,
      entities,
      entityLabels
    );
    const lines = splitter.split(text);
    for (const line of lines) {
      new TextLineView(line, this.textElement).render(text, y);
      const entityLine = new EntityLineView(
        this.svgElement,
        entities.filterByRange(line.startOffset, line.endOffset),
        entityLabels,
        line,
        font,
        this.emitter,
        this.showLabelText
      );
      entityLine.render(text, y);
      y += font.lineHeight;
      y += Math.max(entityLine.height, font.lineHeight);
      y += marginBottom;
    }
    this.svgElement.setAttribute(
      "height",
      this.svgElement.getBBox().height.toString()
    );
  }
}
