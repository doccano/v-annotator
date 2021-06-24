import { TextLine } from "./TextLine";
import { Entity } from "../Label/Entity";

export class EntityLineSplitter {
  constructor(private textLine: TextLine) {}

  split(entities: Entity[]): Entity[] {
    return entities.filter((entity) =>
      entity.isIn(this.textLine.startOffset, this.textLine.endOffset)
    );
  }
}
