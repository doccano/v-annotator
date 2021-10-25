import { TextLine } from "../Line/LineText";
import { Entities } from "../Label/Entity";
import { Text } from "../Label/Text";

export function getSelection(): [number, number] {
  const selection = window.getSelection();
  // get elements.
  const startElement = selection!.anchorNode!.parentNode;
  const endElement = selection!.focusNode!.parentNode;

  // get TextLine objects.
  const startLine = (startElement as unknown as { annotatorElement: TextLine })
    .annotatorElement;
  const endLine = (endElement as unknown as { annotatorElement: TextLine })
    .annotatorElement;

  // get offsets.
  const startOffset = startLine.startOffset + selection!.anchorOffset;
  const endOffset = endLine.startOffset + selection!.focusOffset;

  selection?.removeAllRanges();
  if (startOffset > endOffset) {
    return [endOffset, startOffset];
  } else {
    return [startOffset, endOffset];
  }
}

export class TextSelector {
  constructor(
    private readonly allowOverlapping: boolean,
    private readonly graphemeMode: boolean
  ) {}

  getOffsets(entities: Entities, text: Text): [number, number] {
    const [startOffset, endOffset] = this.getRange();
    if (this.validate(startOffset, endOffset, entities)) {
      return this.convert(startOffset, endOffset, text);
    } else {
      throw RangeError(`[${startOffset}, ${endOffset}] is invalid.`);
    }
  }

  private getRange(): [number, number] {
    const selection = window.getSelection();
    // get elements.
    const startElement = selection!.anchorNode!.parentNode;
    const endElement = selection!.focusNode!.parentNode;

    // Get TextLine objects.
    // This depends on BaseText.vue component.
    // See the component in detail.
    const startLine = (
      startElement as unknown as { annotatorElement: TextLine }
    ).annotatorElement;
    const endLine = (endElement as unknown as { annotatorElement: TextLine })
      .annotatorElement;

    // get offsets.
    const startOffset = startLine.startOffset + selection!.anchorOffset;
    const endOffset = endLine.startOffset + selection!.focusOffset;

    selection?.removeAllRanges();
    if (startOffset > endOffset) {
      return [endOffset, startOffset];
    } else {
      return [startOffset, endOffset];
    }
  }

  private validate(
    startOffset: number,
    endOffset: number,
    entities: Entities
  ): boolean {
    if (startOffset >= endOffset) {
      return false;
    }
    if (this.allowOverlapping) {
      return true;
    }
    if (entities.intersectAny(startOffset, endOffset)) {
      return false;
    }
    return true;
  }

  private convert(
    startOffset: number,
    endOffset: number,
    text: Text
  ): [number, number] {
    if (this.graphemeMode) {
      return [
        text.toGraphemeOffset(startOffset)!,
        text.toGraphemeOffset(endOffset)!,
      ];
    } else {
      return [startOffset, endOffset];
    }
  }
}
