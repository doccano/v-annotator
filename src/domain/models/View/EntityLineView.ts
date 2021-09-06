import { Entity, LevelManager } from "../Label/Entity";
import { TextLine } from "../Line/TextLine";
import { EntityLabels, EntityLabel } from "../Line/Shape";
import { Font } from "../Line/Font";

const lineWidth = 5;
const marginTop = 5;

export interface GeometricEntity {
  entity: Entity;
  x1: number;
  x2: number;
  lineY: number;
  textY: number;
  entityLabel: EntityLabel;
}
export class EntityLineView {
  private levelManager = new LevelManager();
  constructor(
    private entities: Entity[],
    private entityLabels: EntityLabels,
    private textLine: TextLine,
    private font: Font
  ) {}

  render(element: SVGTextElement): GeometricEntity[] {
    const geometricEntities: GeometricEntity[] = [];
    this.levelManager.clear();
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      const [x1, x2] = this.textLine.range(
        element,
        entity.startOffset,
        entity.endOffset
      );
      this.levelManager.update(
        entity,
        x1,
        entity.startOffset < this.textLine.startOffset // entity continue from the previous line
          ? x2
          : x1 + this.entityLabels.getById(entity.label)!.width
      );
      const entityLabel = this.entityLabels.getById(entity.label)!;
      const lineY = this.calculateLineY(entity);
      const textY = lineY + this.font.fontSize / 2 + marginTop;
      geometricEntities.push({
        entity,
        x1,
        x2,
        lineY,
        textY,
        entityLabel,
      });
    }
    return geometricEntities;
  }

  private calculateLineY(entity: Entity): number {
    const level = this.levelManager.fetchLevel(entity)!;
    const marginBottom = 8;
    return lineWidth + (lineWidth + this.font.fontSize + marginBottom) * level;
  }
}
