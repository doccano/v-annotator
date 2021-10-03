import { LevelManager } from "../Label/Entity";
import { LabelList } from "../Label/Label";
import { RelationListItem } from "../Label/Relation";
import { GeometricEntity } from "./LineEntity";
import { TextLine } from "./LineText";

export interface LineRelation {
  x1: number | undefined;
  x2: number | undefined;
  label: string;
  labelWidth: number;
  level: number;
  relation: RelationListItem;
  marker: string;
}

export class RelationLine {
  private levelManager = new LevelManager();
  constructor(
    private relations: RelationListItem[],
    private relationLabels: LabelList,
    private textLine: TextLine
  ) {}

  render(entities: GeometricEntity[]): LineRelation[] {
    const lineRelations: LineRelation[] = [];
    this.levelManager.clear();
    const entityMap: Map<number, GeometricEntity> = new Map();
    entities.forEach((entity) => {
      entityMap.set(entity.entity.id, entity);
    });
    for (const relation of this.relations) {
      let x1 = undefined;
      let x2 = undefined;
      let marker = "";
      const fromEntity = entityMap.get(relation.fromId);
      const toEntity = entityMap.get(relation.toId);
      const label = this.relationLabels.getById(relation.labelId);
      if (fromEntity) {
        if (this.textLine.startOffset <= fromEntity.entity.startOffset) {
          x1 = fromEntity.ranges.center();
        }
      }
      if (toEntity) {
        x2 = toEntity.ranges.center();
        marker = "end";
        if (toEntity.entity.startOffset < this.textLine.startOffset) continue;
      }
      if (x1 === undefined && x2 === undefined) continue;
      if (x1 && x2 && x1 > x2) {
        marker = "start";
        [x1, x2] = [x2, x1];
      }
      // this.levelManager.update();
      // const level = this.levelManager.fetchLevel(relation)!;
      const level = 0;
      lineRelations.push({
        x1,
        x2,
        level,
        label: label!.text,
        labelWidth: label!.width,
        relation,
        marker,
      });
    }
    return lineRelations;
  }
}
