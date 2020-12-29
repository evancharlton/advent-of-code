const { part1, part2, data } = require("./day-06");

describe("Day 06", () => {
  describe("Part 1", () => {
    it("works", () => {
      expect(part1(data("test"))).toBe(17);
      expect(part1(data())).toBe(5532);
    });
  });

  describe("Part 2", () => {
    it("works", () => {
      expect(part2(data("test"))).toBe(undefined);
      expect(part2(data())).toBe(undefined);
    });
  });
});
