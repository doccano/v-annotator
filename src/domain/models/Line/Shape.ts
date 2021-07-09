import { Font } from "./Font";

export class Circle {
  constructor(readonly radius: number = 3, readonly color: string = "grey") {}

  get width(): number {
    return this.radius * 2;
  }
}

export class Line {
  constructor(
    readonly width: number,
    readonly height: number = 5,
    readonly color: string = "grey"
  ) {}
}

export class LabelText {
  constructor(readonly text: string, readonly font: Font) {}

  get width(): number {
    return this.font.widthOf(this.text);
  }
}

export class EntityLabel {
  constructor(
    readonly circle: Circle,
    readonly labelText: LabelText,
    readonly margin = 5
  ) {}

  get width(): number {
    return this.circle.width + this.margin + this.labelText.width;
  }
}
