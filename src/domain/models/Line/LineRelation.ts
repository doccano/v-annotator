import { LevelManager } from "./LevelManager";
import { LabelList } from "../Label/Label";
import { RelationListItem } from "../Label/Relation";
import { GeometricEntity } from "./LineEntity";
import { TextLine } from "./LineText";

export interface LineRelation {
  x1: number;
  x2: number;
  label: string;
  labelWidth: number;
  level: number;
  relation: RelationListItem;
  marker: string;
  openLeft: boolean;
  openRight: boolean;
}

export class RelationLine {
  private levelManager = new LevelManager();
  constructor(
    private relations: RelationListItem[],
    private relationLabels: LabelList,
    private textLine: TextLine,
    private left: number,
    private right: number
  ) {}

  render(entities: GeometricEntity[], rtl: boolean): LineRelation[] {
    const lineRelations: LineRelation[] = [];
    this.levelManager.clear();
    const entityMap: Map<number, GeometricEntity> = new Map();
    entities.forEach((entity) => {
      entityMap.set(entity.entity.id, entity);
    });
    this.relations.sort((r1, r2) => r1.length - r2.length);
    for (const relation of this.relations) {
      if (!relation.isVisible(this.textLine.startOffset)) {
        continue;
      }
      let x1 = this.left;
      let x2 = this.right;
      let marker = "";
      const fromEntity = entityMap.get(relation.fromEntity.id);
      const toEntity = entityMap.get(relation.toEntity.id);
      const label = this.relationLabels.getById(relation.labelId);
      let openStart = relation.isOpenOnLeft(this.textLine.startOffset);
      let openEnd = relation.isOpenOnRight(this.textLine.endOffset);
      if (openStart && openEnd) {
        x1 = this.left;
        x2 = this.right;
      } else if (openStart) {
        if (rtl) {
          if (fromEntity) {
            x1 = fromEntity.center;
          } else if (toEntity) {
            x1 = toEntity.center;
          }
        } else {
          if (fromEntity) {
            x2 = fromEntity.center;
          } else if (toEntity) {
            x2 = toEntity.center;
          }
        }
      } else if (openEnd) {
        if (rtl) {
          if (fromEntity) {
            x2 = fromEntity.center;
          } else if (toEntity) {
            x2 = toEntity.center;
          }
        } else {
          if (fromEntity) {
            x1 = fromEntity.center;
          } else if (toEntity) {
            x1 = toEntity.center;
          }
        }
      } else {
        if (toEntity && fromEntity) {
          x1 = Math.min(toEntity.center, fromEntity.center);
          x2 = Math.max(toEntity.center, fromEntity.center);
        }
      }
      if (toEntity && x1 === toEntity.center) {
        marker = "start";
      } else if (toEntity && x2 === toEntity.center) {
        marker = "end";
      }
      if (x1 > x2) {
        [x1, x2] = [x2, x1];
      }
      if (rtl) {
        [openStart, openEnd] = [openEnd, openStart];
      }
      if (x2 - x1 < label!.width) {
        const center = x1 + (x2 - x1) / 2;
        const half = label!.width / 2;
        this.levelManager.update(relation, [[center - half, center + half]]);
      } else {
        this.levelManager.update(relation, [[x1, x2]]);
      }
      const level = this.levelManager.fetchLevel(relation)!;
      lineRelations.push({
        x1,
        x2,
        level,
        label: label!.text,
        labelWidth: label!.width,
        relation,
        marker,
        openLeft: openStart,
        openRight: openEnd,
      });
    }
    return lineRelations;
  }
}
