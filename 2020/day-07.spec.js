const { part1, part2, data } = require("./day-07");

describe("Day 07", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(4);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(139);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(32);
      expect(part2(data("test2"))).toBe(126);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(58175);
    });
  });
});
