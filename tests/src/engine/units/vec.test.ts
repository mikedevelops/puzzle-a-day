import { Vec, vec } from "../../../../src/engine/units/vec";

describe("vec", () => {
  describe("isMatchingList", () => {
    it("should return true if the lists match", () => {
      const a = [vec(1, 1), vec(2, 2), vec(3, 3)];
      const b = [vec(1, 1), vec(2, 2), vec(3, 3)];
      expect(Vec.isMatchingList(a, b)).toBe(true);
    });

    it("should return false if the lists do not match", () => {
      let a = [vec(1, 1), vec(2, 2), vec(3, 3)];
      let b = [vec(1, 1), vec(2, 2)];
      expect(Vec.isMatchingList(a, b)).toBe(false);

      a = [vec(1, 1), vec(2, 2), vec(3, 3)];
      b = [vec(1, 1), vec(2, 2), vec(3, 4)];
      expect(Vec.isMatchingList(a, b)).toBe(false);
    });
  });
});
