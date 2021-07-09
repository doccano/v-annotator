import { SVGNS } from "./SVGNS";
import { Entities, Entity } from "../Label/Entity";
import { TextLine } from "../Line/TextLine";
import { EventEmitter } from "events";
import { EntityLabels } from "../Line/Shape";
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
    private emitter: EventEmitter,
    private showLabelText: boolean
  ) {}

  render(content: string): SVGGElement {
    const elements = document.createElementNS(SVGNS, "g") as SVGGElement;
    for (const entity of this.entities.list()) {
      const entityLabel = this.entityLabels.getById(entity.label);
      const [x1, x2] = this.textLine.range(
        content,
        entity.startOffset,
        entity.endOffset
      );
      const entityLabelElement = document.createElementNS(
        SVGNS,
        "g"
      ) as SVGGElement;
      const line = new GeometricLine(
        x1,
        x2,
        this.calculateLineY(entity),
        lineWidth,
        entityLabel!.color
      );
      entityLabelElement.appendChild(line.render());
      // Do not show a label text if the entity continues from the previous line.
      if (
        this.showLabelText &&
        this.textLine.startOffset <= entity.startOffset
      ) {
        const marginTop = 5;
        const y = this.calculateLineY(entity) + fontHeight / 2 + marginTop;
        const circle = new GeometricCircle(x1, y, entityLabel!.circle);
        const text = new GeometricText(x1, y, entityLabel!);
        entityLabelElement.appendChild(circle.render());
        entityLabelElement.appendChild(text.render());
      }
      elements.appendChild(entityLabelElement);
    }
    this.svgElement.appendChild(elements);
    return elements;
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
