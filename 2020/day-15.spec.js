const { part1, part2, data } = require("./day-15");

describe("Day 15", () => {
  describe("Part 1", () => {
    it.skip("works for test data", () => {
      expect(part1([0, 3, 6], 4)).toBe(0);
      expect(part1([0, 3, 6], 5)).toBe(3);
      expect(part1([0, 3, 6], 6)).toBe(3);
      expect(part1([0, 3, 6], 7)).toBe(1);
      expect(part1([0, 3, 6], 8)).toBe(0);
      expect(part1([0, 3, 6], 9)).toBe(4);
      expect(part1([0, 3, 6], 10)).toBe(0);
      expect(part1([0, 3, 6])).toBe(436);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(1373);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2([0, 3, 6])).toBe(175594);
      expect(part2([1, 3, 2])).toBe(2578);
      expect(part2([2, 1, 3])).toBe(3544142);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(112458);
    });
  });
});
