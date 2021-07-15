import { WidthCalculator } from "./Strategy";
import { Entities } from "../Label/Entity";
import { EntityLabels } from "./Shape";
import {
  BaseLineSplitter,
  SimpleLineSplitter,
  TextLineSplitter,
} from "./TextLineSplitter";

export function createTextLineSplitter(
  showLabelText: boolean,
  widthCalculator: WidthCalculator,
  entities: Entities,
  entityLabels: EntityLabels
): BaseLineSplitter {
  if (showLabelText) {
    return new TextLineSplitter(widthCalculator, entities, entityLabels);
  } else {
    return new SimpleLineSplitter(widthCalculator);
  }
}
