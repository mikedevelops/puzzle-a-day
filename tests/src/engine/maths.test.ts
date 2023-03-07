import { wrap } from "../../../src/engine/maths";

describe("maths", () => {
  describe("wrap", () => {
    it("should wrap if n is > max", () => {
      expect(wrap(3, 0, 4)).toBe(3);
      expect(wrap(4, 0, 4)).toBe(4);
      expect(wrap(5, 0, 4)).toBe(0);
      expect(wrap(6, 0, 4)).toBe(1);
      expect(wrap(7, 0, 4)).toBe(2);
      expect(wrap(8, 0, 4)).toBe(3);
    });
  });
});
