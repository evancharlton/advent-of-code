const { part1, part2, data } = require("./day-03");

describe("Day 03", () => {
  describe("Part 1", () => {
    it("works", () => {
      expect(part1(data("test"))).toBe(4);
      expect(part1(data())).toBe(113576);
    });
  });

  describe("Part 2", () => {
    it.skip("works", () => {
      expect(part2(data("test"))).toBe(3);
      expect(part2(data())).toBe(undefined);
    });
  });
});
