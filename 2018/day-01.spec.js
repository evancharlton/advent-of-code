const { part1, part2, data } = require("./day-01");

describe("Day 01", () => {
  describe("Part 1", () => {
    it("works", () => {
      expect(part1([1, -2, 3, 1])).toBe(3);
      expect(part1([1, 1, 1])).toBe(3);
      expect(part1([1, 1, -2])).toBe(0);
      expect(part1([-1, -2, -3])).toBe(-6);
      expect(part1(data())).toBe(undefined);
    });
  });

  describe("Part 2", () => {
    it("works", () => {
      expect(part2()).toBe(undefined);
      expect(part2(data())).toBe(undefined);
    });
  });
});
