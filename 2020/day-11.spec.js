const { part1, part2, data } = require("./day-11");

describe("Day 10", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(undefined);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(undefined);
    });
  });
});
