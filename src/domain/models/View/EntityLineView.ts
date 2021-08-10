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
    private font: Font,
    private showLabelText: boolean
  ) {
    entities.forEach((entity) => {
      this.levelManager.update(entity);
    });
  }

  render(content: string): GeometricEntity[] {
    const geometricEntities: GeometricEntity[] = [];
    for (const entity of this.entities) {
      const [x1, x2] = this.textLine.range(
        this.font,
        content,
        entity.startOffset,
        entity.endOffset
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
    if (this.showLabelText) {
      const marginBottom = 8;
      return (
        lineWidth + (lineWidth + this.font.fontSize + marginBottom) * level
      );
    } else {
      const marginBottom = 5;
      return lineWidth + (lineWidth + marginBottom) * level;
    }
  }
}
