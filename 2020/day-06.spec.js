const { part1, part2, data } = require("./day-06");

describe("Day 06", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(11);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(6382);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(6);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(3197);
    });
  });
});
