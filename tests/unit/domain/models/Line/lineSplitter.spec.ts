import { Line } from "@/domain/models/Line/Line";
import { LineSplitter } from "@/domain/models/Line/LineSplitter";

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

    const lineSplitter = new LineSplitter(vocab, maxWidth);
    const lines = lineSplitter.split(content);
    const expected = [
      new Line("exa"),
      new Line("mpl"),
      new Line("e t"),
      new Line("ext"),
    ];
    expect(lines).toEqual(expected);
  });
});
