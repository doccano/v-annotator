import { WidthCalculator } from "./Strategy";
import { EntityLabels } from "./Shape";
import {
  BaseLineSplitter,
  SimpleLineSplitter,
  TextLineSplitter,
} from "./TextLineSplitter";

export function createTextLineSplitter(
  showLabelText: boolean,
  widthCalculator: WidthCalculator,
  entityLabels: EntityLabels
): BaseLineSplitter {
  if (showLabelText) {
    return new TextLineSplitter(widthCalculator, entityLabels);
  } else {
    return new SimpleLineSplitter(widthCalculator);
  }
}
