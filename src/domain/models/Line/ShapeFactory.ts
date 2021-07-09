import { Font } from "./Font";
import { Labels } from "../Label/Label";
import { Circle, LabelText, EntityLabel, EntityLabels } from "./Shape";

export function createEntityLabels(
  radius: number,
  margin: number,
  font: Font,
  labels: Labels
): EntityLabels {
  const entityLabels = [];
  for (const label of labels.list()) {
    const circle = new Circle(radius, label.color);
    const text = new LabelText(label.text, font);
    const entityLabel = new EntityLabel(label.id, circle, text, margin);
    entityLabels.push(entityLabel);
  }
  return new EntityLabels(entityLabels);
}
