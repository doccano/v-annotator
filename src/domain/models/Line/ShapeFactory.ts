import { widthOf } from "../View/fontFactory";
import { Labels } from "../Label/Label";
import { EntityLabel, EntityLabels } from "./Shape";

export function createEntityLabels(
  tspanElement: SVGTSpanElement,
  labels: Labels
): EntityLabels {
  const entityLabels = [];
  for (const label of labels.list()) {
    const textWidth = widthOf(label.text, tspanElement);
    entityLabels.push(new EntityLabel(label, textWidth));
  }
  return new EntityLabels(entityLabels);
}
