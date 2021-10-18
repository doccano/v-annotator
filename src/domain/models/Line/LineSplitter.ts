import { Text } from "../Label/Text";
import { TextLine } from "./LineText";
import { WidthManager } from "./WidthManager";
import { Font } from "./Font";

export interface BaseLineSplitter {
  split(text: Text): TextLine[];
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
  constructor(private widthManager: WidthManager, private font: Font) {}

  split(text: Text): TextLine[] {
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
          this.widthManager.add(this.font.widthOf(ch, ch.length > 1));
        }
      } else {
        this.widthManager.add(this.font.widthOf(ch, ch.length > 1));
      }
      i += ch.length;
    }
    if (!this.widthManager.isEmpty()) {
      lines.push(new TextLine(startOffset, text.codePointLength));
    }
    return lines;
  }

  private needsNewline(i: number, text: Text, char: string): boolean {
    const ch = text.charAt(i);
    if (isLF(ch) || isCR(ch)) {
      return true;
    }

    if (!this.widthManager.canAdd(this.font.widthOf(char, char.length > 1))) {
      return true;
    }

    // check whether the word exceeds the maxWidth
    const wordWidth = this.calculateWordLength(i, text);
    const isShortWord = wordWidth <= this.widthManager.maxWidth;
    if (isShortWord && this.widthManager.isFull(wordWidth)) {
      return true;
    }
    return false;
  }

  private calculateWordLength(i: number, text: Text): number {
    const word = text.getWord(i);
    if (word) {
      let total = 0;
      for (let j = i; j < i + word.length; j++) {
        const ch = text.graphemeAt(j);
        total += ch ? this.font.widthOf(ch, ch.length > 1) : 0;
      }
      return total;
    } else {
      return 0;
    }
  }
}
