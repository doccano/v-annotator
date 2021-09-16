import config from "@/domain/models/Config/Config";
import { Label } from "@/domain/models/Label/Label";

export class EntityLabel {
  constructor(readonly label: Label, readonly textWidth: number) {}

  get width(): number {
    return config.diameter + config.labelMargin + this.textWidth;
  }

  get id(): number {
    return this.label.id;
  }

  get color(): string {
    return this.label.color;
  }

  get text(): string {
    return this.label.text;
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

  getColor(id: number): string {
    return this.getById(id)!.color;
  }

  getText(id: number): string {
    return this.getById(id)!.text;
  }

  maxLabelWidth(ids: number[]): number {
    return Math.max(...ids.map((id) => this.getById(id)!.width), 0);
  }
}
