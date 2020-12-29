const { part1, part2, data } = require("./day-01");

describe("Day 01", () => {
  describe("Part 1", () => {
    it("works", () => {
      expect(part1([1, -2, 3, 1])).toBe(3);
      expect(part1([1, 1, 1])).toBe(3);
      expect(part1([1, 1, -2])).toBe(0);
      expect(part1([-1, -2, -3])).toBe(-6);
      expect(part1(data())).toBe(502);
    });
  });

  describe("Part 2", () => {
    it("works", () => {
      expect(part2([1, -1])).toBe(0);
      expect(part2([3, 3, 4, -2, -4])).toBe(10);
      expect(part2(data())).toBe(71961);
    });
  });
});
