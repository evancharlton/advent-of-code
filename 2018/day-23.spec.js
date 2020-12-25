const { part1, part2, data } = require("./day-23");

describe("Day 23", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(7);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(584);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(undefined);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(undefined);
    });
  });
});
