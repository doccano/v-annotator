import GraphemeSplitter from "grapheme-splitter";

export class Text {
  private graphemes: string[] = [];
  private g2c: Map<number, number> = new Map();
  private c2g: Map<number, number> = new Map();

  constructor(readonly text: string) {
    const splitter = new GraphemeSplitter();
    this.graphemes = splitter.splitGraphemes(text);
    let total = 0;
    for (let i = 0; i < this.graphemeLength; i++) {
      this.g2c.set(i, total);
      total += this.graphemeAt(i).length;
    }
    for (const [graphemeOffset, codeOffset] of this.g2c) {
      this.c2g.set(codeOffset, graphemeOffset);
    }
  }

  toGraphemeOffset(codePointOffset: number): number | undefined {
    return this.c2g.get(codePointOffset);
  }

  toCodePointOffset(graphemeOffset: number): number | undefined {
    return this.g2c.get(graphemeOffset);
  }

  /**
   * The index of the graphemes to be returned.
   *   If index is out of range, this returns empty string;
   * @param {number} index - An integer between 0 and this.graphemeLength.
   * @returns {string} - A grapheme.
   */
  graphemeAt(index: number): string {
    if (0 <= index && index < this.graphemeLength) {
      return this.graphemes[index];
    } else {
      return "";
    }
  }

  /**
   * Returns a new string consisting of the single UTF-16 code unit.
   *   If index is out of range, this returns empty string.
   * @param {number} index - An integer between 0 and this.codePointLength.
   * @returns {string} - A character.
   */
  charAt(index: number): string {
    return this.text.charAt(index);
  }

  /**
   * Return text length by grapheme clusters.
   * @returns {number} - text length.
   */
  get graphemeLength(): number {
    return this.graphemes.length;
  }

  /**
   * Return text length by CodePoints.
   * @returns {number} - text length.
   */
  get codePointLength(): number {
    return this.text.length;
  }

  /**
   * Return substring of the text.
   * @param {number} from - The Unicode CodePoint offset.
   * @param {number} length - The length. The unit is per CodePoint.
   * @returns {string} - text.
   */
  substr(from: number, length: number): string {
    return this.text.substr(from, length);
  }
}
