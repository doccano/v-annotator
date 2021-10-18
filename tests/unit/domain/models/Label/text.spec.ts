import { Text } from "@/domain/models/Label/Text";

describe("Text", () => {
  it("check grapheme length", () => {
    const text = new Text("👶🏻👦🏻👧🏻👨🏻");
    expect(text.graphemeLength).toBe(4);
  });

  it("check codepoint length", () => {
    const text = new Text("👶🏻👦🏻👧🏻👨🏻");
    expect(text.codePointLength).toBe(16);
  });

  it("check substr", () => {
    const text = new Text("👶🏻👦🏻👧🏻👨🏻");
    expect(text.substr(4, 4)).toBe("👦🏻");
  });

  it("grapheme At", () => {
    const text = new Text("👶🏻👦🏻👧🏻👨🏻");
    expect(text.graphemeAt(1)).toBe("👦🏻");
    expect(text.graphemeAt(-1)).toBe("");
    expect(text.graphemeAt(4)).toBe("");
  });

  it("char at", () => {
    const text = new Text("abcd");
    expect(text.graphemeAt(1)).toBe("b");
    expect(text.graphemeAt(-1)).toBe("");
    expect(text.graphemeAt(4)).toBe("");
  });

  it("toGraphemeOffset", () => {
    const text = new Text("👶🏻👦🏻👧🏻👨🏻");
    expect(text.toGraphemeOffset(4)).toBe(1);
    expect(text.toGraphemeOffset(3)).toBeUndefined();
  });

  it("toCodePointOffset", () => {
    const text = new Text("👶🏻👦🏻👧🏻👨🏻");
    expect(text.toCodePointOffset(1)).toBe(4);
    expect(text.toCodePointOffset(4)).toBeUndefined();
  });

  it("getWord", () => {
    const text = new Text("we\tmust  respect\nthe");
    expect(text.getWord(0)).toBe("we");
    expect(text.getWord(3)).toBe("must");
    expect(text.getWord(9)).toBe("respect");
    expect(text.getWord(17)).toBe("the");
    for (let i = 0; i < 20; i++) {
      if ([0, 3, 9, 17].includes(i)) {
        continue;
      }
      expect(text.getWord(i)).toBeUndefined();
    }
  });
});
