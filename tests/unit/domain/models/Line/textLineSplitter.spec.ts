import { TextLine } from "@/domain/models/Line/TextLine";
import { TextLineSplitter } from "@/domain/models/Line/TextLineSplitter";

describe("LineSplitter component", () => {
  it("can split text", () => {
    const content = "example text";
    const vocab = new Map();
    const maxWidth = 3;

    const characterSet = new Set(content);
    const characterArray = Array.from(characterSet);
    characterArray.forEach((ch: string) => {
      vocab.set(ch, 1);
    });

    const lineSplitter = new TextLineSplitter(vocab, maxWidth);
    const lines = lineSplitter.split(content);
    const expected = [
      new TextLine("exa", 0, 3),
      new TextLine("mpl", 3, 6),
      new TextLine("e t", 6, 9),
      new TextLine("ext", 9, 12),
    ];
    expect(lines).toEqual(expected);
  });

  it("can split text with new line", () => {
    const content = "aaa\nbbb";
    const vocab = new Map();
    const maxWidth = 10;

    const characterSet = new Set(content);
    const characterArray = Array.from(characterSet);
    characterArray.forEach((ch: string) => {
      vocab.set(ch, 1);
    });

    const lineSplitter = new TextLineSplitter(vocab, maxWidth);
    const lines = lineSplitter.split(content);
    const expected = [new TextLine("aaa", 0, 3), new TextLine("bbb", 4, 7)];
    expect(lines).toEqual(expected);
  });
});
