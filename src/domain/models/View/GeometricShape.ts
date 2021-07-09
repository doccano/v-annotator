import { Circle, Line } from "../Line/Shape";
import { SVGNS } from "../Line/SVGNS";

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
  constructor(readonly x: number, readonly y: number, readonly line: Line) {}

  render(): SVGElement {
    const lineElement = document.createElementNS(
      SVGNS,
      "line"
    ) as SVGLineElement;
    // The width is extended by a half circle with a diameter equal to the stroke width.
    // So we need to adjust the x1 and x2.
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap#round
    lineElement.setAttribute("x1", (this.x + this.line.height / 2).toString());
    lineElement.setAttribute(
      "x2",
      (this.x - this.line.height / 2 + this.line.width).toString()
    );
    lineElement.setAttribute("y1", this.y.toString());
    lineElement.setAttribute("y2", this.y.toString());
    lineElement.setAttribute("stroke-width", this.line.height.toString());
    lineElement.setAttribute("stroke-linecap", "round");
    lineElement.setAttribute("stroke", this.line.color);
    lineElement.onmouseover = () => {
      lineElement.setAttribute(
        "stroke-width",
        (this.line.height * 2).toString()
      );
    };
    lineElement.onmouseleave = () => {
      lineElement.setAttribute("stroke-width", this.line.height.toString());
    };
    return lineElement;
  }
}

export class GeometricText implements GeometricShape {
  constructor(readonly x: number, readonly y: number, readonly text: string) {}

  render(): SVGElement {
    const textElement = document.createElementNS(
      SVGNS,
      "text"
    ) as SVGTextElement;
    textElement.setAttribute("fill", "grey");
    textElement.setAttribute("x", this.x.toString());
    textElement.setAttribute("y", this.y.toString());
    textElement.setAttribute("dy", "0.35em");
    textElement.style.cursor = "pointer";
    textElement.style.userSelect = "none";
    textElement.textContent = this.text;
    return textElement;
  }
}
