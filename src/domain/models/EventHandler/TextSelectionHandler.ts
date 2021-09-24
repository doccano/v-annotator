import { TextLine } from "../Line/LineText";

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
