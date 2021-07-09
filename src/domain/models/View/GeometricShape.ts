import { Circle, EntityLabel } from "../Line/Shape";
import { SVGNS } from "./SVGNS";

interface GeometricShape {
  render(): SVGElement;
}

export class GeometricCircle implements GeometricShape {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly circle: Circle
  ) {}

  render(): SVGElement {
    const circleElement = document.createElementNS(
      SVGNS,
      "circle"
    ) as SVGCircleElement;
    circleElement.setAttribute("fill", this.circle.color);
    circleElement.setAttribute("cx", (this.x + this.circle.radius).toString());
    circleElement.setAttribute("r", this.circle.radius.toString());
    circleElement.setAttribute("cy", this.y.toString());
    return circleElement;
  }
}

export class GeometricLine implements GeometricShape {
  constructor(
    readonly x1: number,
    readonly x2: number,
    readonly y: number,
    readonly height: number,
    readonly color: string
  ) {}

  render(): SVGElement {
    const lineElement = document.createElementNS(
      SVGNS,
      "line"
    ) as SVGLineElement;
    // The width is extended by a half circle with a diameter equal to the stroke width.
    // So we need to adjust the x1 and x2.
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap#round
    lineElement.setAttribute("x1", (this.x1 + this.height / 2).toString());
    lineElement.setAttribute("x2", (this.x2 - this.height / 2).toString());
    lineElement.setAttribute("y1", this.y.toString());
    lineElement.setAttribute("y2", this.y.toString());
    lineElement.setAttribute("stroke-width", this.height.toString());
    lineElement.setAttribute("stroke-linecap", "round");
    lineElement.setAttribute("stroke", this.color);
    lineElement.onmouseover = () => {
      lineElement.setAttribute("stroke-width", (this.height * 2).toString());
    };
    lineElement.onmouseleave = () => {
      lineElement.setAttribute("stroke-width", this.height.toString());
    };
    return lineElement;
  }
}

export class GeometricText implements GeometricShape {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly label: EntityLabel
  ) {}

  render(): SVGElement {
    const textElement = document.createElementNS(
      SVGNS,
      "text"
    ) as SVGTextElement;
    textElement.setAttribute("fill", "grey");
    textElement.setAttribute("x", (this.x + this.label.marginLeft).toString());
    textElement.setAttribute("y", this.y.toString());
    textElement.setAttribute("dy", "0.35em");
    textElement.style.cursor = "pointer";
    textElement.style.userSelect = "none";
    textElement.textContent = this.label.text;
    return textElement;
  }
}
