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
    readonly id: number,
    readonly circle: Circle,
    readonly labelText: LabelText,
    readonly margin = 5
  ) {}

  get width(): number {
    return this.circle.width + this.marginLeft + this.labelText.width;
  }

  get text(): string {
    return this.labelText.text;
  }

  get marginLeft(): number {
    return this.margin + this.circle.radius;
  }

  get color(): string {
    return this.circle.color;
  }
}

export class EntityLabels {
  private mapping: Map<number, EntityLabel> = new Map();

  constructor(readonly entityLabels: EntityLabel[]) {
    for (const entityLabel of entityLabels) {
      this.mapping.set(entityLabel.id, entityLabel);
    }
  }

  getById(id: number): EntityLabel | undefined {
    return this.mapping.get(id);
  }
}
