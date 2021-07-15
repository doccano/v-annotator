import { SVGNS } from "./SVGNS";
import { Entities, Entity } from "../Label/Entity";
import { TextLine } from "../Line/TextLine";
import { EventEmitter } from "events";
import { EntityLabels } from "../Line/Shape";
import { Font } from "../Line/Font";
import {
  GeometricCircle,
  GeometricText,
  GeometricLine,
} from "./GeometricShape";

const lineWidth = 5;
const fontHeight = 16;

export class EntityLineView {
  constructor(
    private svgElement: SVGSVGElement,
    private entities: Entities,
    private entityLabels: EntityLabels,
    private textLine: TextLine,
    private font: Font,
    private emitter: EventEmitter,
    private showLabelText: boolean
  ) {}

  render(content: string): SVGGElement {
    const elements = document.createElementNS(SVGNS, "g") as SVGGElement;
    for (const entity of this.entities.list()) {
      const [x1, x2] = this.textLine.range(
        this.font,
        content,
        entity.startOffset,
        entity.endOffset
      );
      const element = document.createElementNS(SVGNS, "g") as SVGGElement;
      this.addLine(element, x1, x2, entity);
      if (this.canDisplayText(entity)) {
        this.addText(element, x1, entity);
      }
      elements.appendChild(element);
    }
    this.svgElement.appendChild(elements);
    return elements;
  }

  private canDisplayText(entity: Entity) {
    // Do not show a label text if the entity continues from the previous line.
    const startsWithLine = this.textLine.startOffset <= entity.startOffset;
    return this.showLabelText && startsWithLine;
  }

  private addLine(
    element: SVGGElement,
    x1: number,
    x2: number,
    entity: Entity
  ) {
    const entityLabel = this.entityLabels.getById(entity.label);
    const y = this.calculateLineY(entity);
    const line = new GeometricLine(x1, x2, y, lineWidth, entityLabel!.color);
    element.appendChild(line.render());
  }

  private addText(element: SVGGElement, x1: number, entity: Entity) {
    const marginTop = 5;
    const entityLabel = this.entityLabels.getById(entity.label);
    const y = this.calculateLineY(entity) + fontHeight / 2 + marginTop;
    const circle = new GeometricCircle(x1, y, entityLabel!.circle);
    const text = new GeometricText(x1, y, entityLabel!);
    element.appendChild(circle.render());
    element.appendChild(text.render());
  }

  private calculateLineY(entity: Entity): number {
    const level = this.entities.getLevelOf(entity.id)!;
    if (this.showLabelText) {
      const marginBottom = 8;
      return lineWidth + (lineWidth + fontHeight + marginBottom) * level;
    } else {
      const marginBottom = 5;
      return lineWidth + (lineWidth + marginBottom) * level;
    }
  }
}
