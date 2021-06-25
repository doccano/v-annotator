import { SVGNS } from "../Character/SVGNS";
import { Entities, Entity } from "../Label/Entity";
import { Labels } from "../Label/Label";
import { TextLine } from "../Line/TextLine";

export class EntityLineView {
  constructor(
    private svgElement: SVGSVGElement,
    private entities: Entities,
    private labels: Labels,
    private textLine: TextLine
  ) {}

  render(): SVGGElement {
    const elements = document.createElementNS(SVGNS, "g") as SVGGElement;
    for (const entity of this.entities.list()) {
      const [x1, x2] = this.textLine.range(
        entity.startOffset,
        entity.endOffset
      );
      const entityLabelElement = document.createElementNS(
        SVGNS,
        "g"
      ) as SVGGElement;
      const lineElement = this.createLineElement(entity, x1, x2);
      const circleElement = this.createCircleElement(entity, x1);
      const textElement = this.createLabelTextElement(entity, x1);
      entityLabelElement.appendChild(lineElement);
      // Do not show a label text if the entity continues from the previous line.
      if (this.textLine.startOffset <= entity.startOffset) {
        entityLabelElement.appendChild(circleElement);
        entityLabelElement.appendChild(textElement);
      }
      elements.appendChild(entityLabelElement);
    }
    this.svgElement.appendChild(elements);
    return elements;
  }

  private color(entity: Entity): string {
    const label = this.labels.getById(entity.label);
    return label!.color;
  }

  private labelText(entity: Entity): string {
    const label = this.labels.getById(entity.label);
    return label!.text;
  }

  private createLineElement(entity: Entity, x1: number, x2: number) {
    const lineElement = document.createElementNS(
      SVGNS,
      "line"
    ) as SVGLineElement;
    lineElement.setAttribute("x1", x1.toString());
    lineElement.setAttribute("x2", x2.toString());
    lineElement.setAttribute("y1", "6");
    lineElement.setAttribute("y2", "6");
    lineElement.setAttribute("stroke-width", "3");
    lineElement.setAttribute("stroke-linecap", "round");
    lineElement.setAttribute("stroke", this.color(entity));
    return lineElement;
  }

  private createCircleElement(entity: Entity, x1: number) {
    const circleElement = document.createElementNS(
      SVGNS,
      "circle"
    ) as SVGCircleElement;
    circleElement.setAttribute("fill", this.color(entity));
    circleElement.setAttribute("cx", x1.toString());
    circleElement.setAttribute("r", "3");
    circleElement.setAttribute("cy", "20");
    return circleElement;
  }

  private createLabelTextElement(entity: Entity, x1: number) {
    const textElement = document.createElementNS(
      SVGNS,
      "text"
    ) as SVGTextElement;
    textElement.setAttribute("fill", "dimgrey");
    textElement.setAttribute("x", (x1 + 7).toString());
    textElement.setAttribute("y", "20");
    textElement.setAttribute("dy", "0.35em");
    textElement.textContent = this.labelText(entity);
    return textElement;
  }
}
