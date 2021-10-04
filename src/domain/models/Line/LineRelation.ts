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
      let x1 = this.left;
      let x2 = this.right;
      let marker = "";
      const fromEntity = entityMap.get(relation.fromId);
      const toEntity = entityMap.get(relation.toId);
      const label = this.relationLabels.getById(relation.labelId);
      let openLeft = relation.startOffset < this.textLine.startOffset;
      let openRight = relation.endOffset > this.textLine.endOffset;
      if (rtl) {
        [openLeft, openRight] = [openRight, openLeft];
      }
      if (openLeft && openRight) {
        x1 = this.left;
        x2 = this.right;
      } else {
        if (fromEntity) {
          if (this.textLine.startOffset <= fromEntity.entity.startOffset) {
            x1 = fromEntity.ranges.center();
          }
        } else {
          if (openLeft) {
            x1 = rtl ? this.right : this.left;
          } else {
            x1 = rtl ? this.left : this.right;
          }
        }
        if (toEntity) {
          x2 = toEntity.ranges.center();
          marker = "end";
          if (toEntity.entity.startOffset < this.textLine.startOffset) continue;
        } else {
          if (openRight) {
            x2 = rtl ? this.left : this.right;
          } else {
            x2 = rtl ? this.right : this.left;
          }
        }
      }
      if (x1 && x2 && x1 > x2) {
        marker = "start";
        [x1, x2] = [x2, x1];
      }
      this.levelManager.update(relation, [[x1, x2]]);
      const level = this.levelManager.fetchLevel(relation)!;
      lineRelations.push({
        x1,
        x2,
        level,
        label: label!.text,
        labelWidth: label!.width,
        relation,
        marker,
        openLeft,
        openRight,
      });
    }
    return lineRelations;
  }
}
