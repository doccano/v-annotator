import { Text } from "../Label/Text";
import { TextLine } from "./LineText";
import { WidthManager } from "./WidthManager";

export interface BaseLineSplitter {
  split(text: Text): TextLine[];
}

function isWhitespace(ch: string): boolean {
  return /^\s$/.test(ch);
}

function isLF(ch: string): boolean {
  return ch === "\n";
}

function isCR(ch: string): boolean {
  return ch === "\r";
}

function isCRLF(text: string): boolean {
  return text === "\r\n";
}

export class TextLineSplitter implements BaseLineSplitter {
  private chunkWidth: Map<number, number> = new Map();
  constructor(private widthManager: WidthManager) {}

  split(text: Text): TextLine[] {
    this.calculateChunkWidth(text.text);
    this.widthManager.reset();
    let startOffset = 0;
    let i = startOffset;
    const lines: TextLine[] = [];
    for (let j = 0; j < text.graphemeLength; j++) {
      const ch = text.graphemeAt(j);
      if (this.needsNewline(i, text, ch)) {
        lines.push(new TextLine(startOffset, i));
        this.widthManager.reset();
        if (isCRLF(text.substr(i, 2))) {
          startOffset = i + 2;
        } else if (isLF(ch) || isCR(ch)) {
          startOffset = i + 1;
        } else {
          startOffset = i;
          this.widthManager.add(ch, ch.length > 1);
        }
      } else {
        this.widthManager.add(ch, ch.length > 1);
      }
      i += ch.length;
    }
    if (!this.widthManager.isEmpty()) {
      lines.push(new TextLine(startOffset, text.codePointLength));
    }
    return lines;
  }

  private calculateChunkWidth(text: string): void {
    if (this.chunkWidth.size > 0) return;
    let isInsideWord = false;
    let start = 0;
    this.widthManager.reset();
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (!isInsideWord && !isWhitespace(ch)) {
        // word starts
        isInsideWord = true;
        start = i;
        this.widthManager.add(ch, ch.length > 1);
      } else if (!isInsideWord && isWhitespace(ch)) {
        // space is continuous.
      } else if (isInsideWord && !isWhitespace(ch)) {
        this.widthManager.add(ch, ch.length > 1);
      } else if (isInsideWord && isWhitespace(ch)) {
        isInsideWord = false;
        this.chunkWidth.set(start, this.widthManager.width);
        this.widthManager.reset();
      }
    }
    if (isInsideWord) {
      this.chunkWidth.set(start, this.widthManager.width);
    }
  }

  private needsNewline(i: number, text: Text, char: string): boolean {
    const ch = text.charAt(i);
    if (isLF(ch) || isCR(ch)) {
      return true;
    }

    if (!this.widthManager.canInsertChar(char)) {
      return true;
    }

    // check whether the word exceeds the maxWidth
    const wordWidth = this.chunkWidth.get(i) || 0;
    const isShortWord = wordWidth <= this.widthManager.maxWidth;
    if (isShortWord && this.widthManager.isFull(wordWidth)) {
      return true;
    }
    return false;
  }
}
